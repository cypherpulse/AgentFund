import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from "wagmi";
import { parseEther, formatEther, type Address, createPublicClient, http } from "viem";
import { celo } from "viem/chains";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract";
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

export interface FundingEvent {
  sender: string;
  recipient: string;
  amount: string;
  txHash: string;
  timestamp: number;
  blockNumber?: bigint;
}

const publicClient = createPublicClient({
  chain: celo,
  transport: http("https://forno.celo.org"),
});

const AGENT_FUNDED_TOPIC0 =
  "0x49af616656db0fca31912fe65a529a84c3634718357324a7397674794e6caf2f";

function normalizeAddressFromTopic(topic: string): string {
  return `0x${topic.slice(-40)}`;
}

function parseMaybeHexToNumber(value: string): number {
  if (value.startsWith("0x")) {
    return Number(BigInt(value));
  }
  return Number(value);
}

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export function useMinFund() {
  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "MIN_FUND",
    chainId: 42220,
  });
  return {
    minFund: data ? formatEther(data) : null,
    isLoading,
  };
}

export function useFundAgent() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const fundAgent = useCallback(
    (recipient: string, amount: string) => {
      if (!recipient || !amount) {
        toast.error("Missing recipient or amount");
        return;
      }
      writeContract(
        {
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "fundAgent",
          args: [recipient as Address],
          value: parseEther(amount),
        } as any,
        {
          onSuccess: () => toast.success("Transaction submitted!"),
          onError: (err) => {
            const msg = err.message;
            if (msg.includes("FundAmountTooLow")) toast.error("Amount too low. Must meet MIN_FUND.");
            else if (msg.includes("ZeroRecipient")) toast.error("Cannot fund zero address.");
            else toast.error("Transaction failed: " + msg.slice(0, 100));
          },
        }
      );
    },
    [writeContract]
  );

  return { fundAgent, hash, isPending, isConfirming, isSuccess, error };
}

export function useFundingEvents() {
  const [events, setEvents] = useState<FundingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch historical events on mount
  useEffect(() => {
    async function fetchPastEvents() {
      try {
        const apiKey = import.meta.env.VITE_CELOSCAN_API_KEY;
        const pastEvents: FundingEvent[] = [];

        if (apiKey) {
          // Fast CeloScan fetch of latest logs first. If this fails or is empty, we fall back to RPC.
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 12000);
          try {
            const qs = new URLSearchParams({
              chainid: "42220",
              module: "logs",
              action: "getLogs",
              fromBlock: "0",
              toBlock: "latest",
              address: CONTRACT_ADDRESS,
              topic0: AGENT_FUNDED_TOPIC0,
              sort: "desc",
              page: "1",
              offset: "100",
              apikey: apiKey,
            });

            const res = await fetch(`https://api.etherscan.io/v2/api?${qs.toString()}`, {
              signal: controller.signal,
            });
            const data = await res.json();

            if (data?.status === "1" && Array.isArray(data.result) && data.result.length > 0) {
              for (const log of data.result) {
                pastEvents.push({
                  sender: normalizeAddressFromTopic(log.topics[1]),
                  recipient: normalizeAddressFromTopic(log.topics[2]),
                  amount: formatEther(BigInt(log.data)),
                  txHash: log.transactionHash ?? "",
                  timestamp: parseMaybeHexToNumber(log.timeStamp) * 1000,
                  blockNumber: BigInt(log.blockNumber),
                });
              }

              pastEvents.sort((a, b) => b.timestamp - a.timestamp);
              setEvents(pastEvents.slice(0, 50));
              return;
            }
          } finally {
            clearTimeout(timeoutId);
          }
        }

        // Fallback to RPC nodes
        const currentBlock = await withTimeout(
          publicClient.getBlockNumber(),
          10000,
          "RPC getBlockNumber"
        );
        // Celo RPC nodes often restrict large ranges, 50k blocks is usually the safe limit
        const fromBlock = currentBlock > 50000n ? currentBlock - 50000n : 0n;

        const logs = await withTimeout(
          publicClient.getLogs({
          address: CONTRACT_ADDRESS,
          event: {
            type: "event",
            name: "AgentFunded",
            inputs: [
              { indexed: true, name: "sender", type: "address" },
              { indexed: true, name: "recipient", type: "address" },
              { indexed: false, name: "amount", type: "uint256" },
            ],
          },
          fromBlock: fromBlock, // Celo RPC nodes often restrict large ranges. We will keep this reasonable.
          toBlock: "latest",
        }),
          15000,
          "RPC getLogs"
        );

        // Get block timestamps for accurate times
        const blockCache = new Map<bigint, number>();

        for (const log of logs) {
          let ts = Date.now();
          if (log.blockNumber) {
            if (!blockCache.has(log.blockNumber)) {
              try {
                const block = await withTimeout(
                  publicClient.getBlock({ blockNumber: log.blockNumber }),
                  8000,
                  "RPC getBlock"
                );
                blockCache.set(log.blockNumber, Number(block.timestamp) * 1000);
              } catch {
                blockCache.set(log.blockNumber, Date.now());
              }
            }
            ts = blockCache.get(log.blockNumber)!;
          }

          pastEvents.push({
            sender: (log.args as any).sender as string,
            recipient: (log.args as any).recipient as string,
            amount: formatEther((log.args as any).amount as bigint),
            txHash: log.transactionHash || "",
            timestamp: ts,
            blockNumber: log.blockNumber ?? undefined,
          });
        }

        setEvents(pastEvents.reverse().slice(0, 50));
      } catch (err) {
        console.error("Failed to fetch past events:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPastEvents();
  }, []);

  // Watch for new live events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: "AgentFunded",
    chainId: 42220,
    onLogs(logs) {
      const newEvents = logs.map((log) => ({
        sender: (log.args as any).sender as string,
        recipient: (log.args as any).recipient as string,
        amount: formatEther((log.args as any).amount as bigint),
        txHash: log.transactionHash || "",
        timestamp: Date.now(),
        blockNumber: log.blockNumber ?? undefined,
      }));
      setEvents((prev) => [...newEvents, ...prev].slice(0, 50));
    },
  });

  return { events, isLoading };
}
