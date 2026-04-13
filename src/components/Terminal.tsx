import { useState, useRef, useEffect, useCallback } from "react";
import { useFundAgent, useMinFund } from "@/hooks/useContract";
import { useAccount } from "wagmi";
import { CONTRACT_ADDRESS } from "@/lib/contract";

interface TerminalLine {
  type: "input" | "output" | "error" | "success" | "info";
  text: string;
}

const WELCOME = [
  { type: "info" as const, text: "╔══════════════════════════════════════════════╗" },
  { type: "info" as const, text: "║     AGENT FUND v1.0 — AI AGENT TERMINAL      ║" },
  { type: "info" as const, text: "║       Funding Protocol on Celo Network        ║" },
  { type: "info" as const, text: "╚══════════════════════════════════════════════╝" },
  { type: "info" as const, text: "" },
  { type: "output" as const, text: 'Type "help" for available commands.' },
  { type: "info" as const, text: "" },
];

export function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>(WELCOME);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { fundAgent, isPending, isConfirming } = useFundAgent();
  const { minFund } = useMinFund();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  const addLine = useCallback((type: TerminalLine["type"], text: string) => {
    setLines((prev) => [...prev, { type, text }]);
  }, []);

  const processCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim();
      if (!trimmed) return;

      addLine("input", `> ${trimmed}`);
      setHistory((prev) => [trimmed, ...prev]);
      setHistoryIdx(-1);

      const parts = trimmed.split(/\s+/);
      const command = parts[0].toLowerCase();

      switch (command) {
        case "help":
          addLine("info", "");
          addLine("output", "Available commands:");
          addLine("success", "  fund <address> <amount>  — Fund an AI agent with CELO");
          addLine("success", "  generate-link            — Generate a shareable fund link");
          addLine("success", "  status                   — Show connection & contract status");
          addLine("success", "  clear                    — Clear terminal");
          addLine("success", "  help                     — Show this message");
          addLine("info", "");
          break;

        case "fund": {
          if (!isConnected) {
            addLine("error", "ERROR: Wallet not connected. Click the wallet button above.");
            break;
          }
          const recipient = parts[1];
          const amount = parts[2];
          if (!recipient || !amount) {
            addLine("error", "Usage: fund <recipientAddress> <amountInCelo>");
            break;
          }
          if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
            addLine("error", "ERROR: Invalid address format.");
            break;
          }
          if (isNaN(Number(amount)) || Number(amount) <= 0) {
            addLine("error", "ERROR: Invalid amount.");
            break;
          }
          addLine("info", `Initiating fund: ${amount} CELO → ${recipient.slice(0, 6)}...${recipient.slice(-4)}`);
          addLine("info", "Awaiting wallet confirmation...");
          fundAgent(recipient, amount);
          break;
        }

        case "generate-link": {
          addLine("output", "Enter recipient and amount in the Generate Link section below.");
          addLine("info", "Scrolling to generator...");
          document.getElementById("generate")?.scrollIntoView({ behavior: "smooth" });
          break;
        }

        case "status":
          addLine("info", "");
          addLine("output", `Wallet: ${isConnected ? address : "Not connected"}`);
          addLine("output", `Network: Celo Mainnet (42220)`);
          addLine("output", `Contract: ${CONTRACT_ADDRESS}`);
          addLine("output", `MIN_FUND: ${minFund ?? "loading..."} CELO`);
          addLine("info", "");
          break;

        case "clear":
          setLines([]);
          break;

        default:
          addLine("error", `Unknown command: "${command}". Type "help" for commands.`);
      }
    },
    [addLine, fundAgent, isConnected, address, minFund]
  );

  // Show tx status
  useEffect(() => {
    if (isPending) addLine("info", "⏳ Transaction pending...");
  }, [isPending, addLine]);

  useEffect(() => {
    if (isConfirming) addLine("success", "✓ Transaction confirmed on-chain!");
  }, [isConfirming, addLine]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      processCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const idx = Math.min(historyIdx + 1, history.length - 1);
        setHistoryIdx(idx);
        setInput(history[idx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx > 0) {
        const idx = historyIdx - 1;
        setHistoryIdx(idx);
        setInput(history[idx]);
      } else {
        setHistoryIdx(-1);
        setInput("");
      }
    }
  };

  return (
    <section id="terminal" className="mx-auto max-w-4xl px-4 py-16">
      <div className="neon-border rounded border bg-terminal-bg overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border bg-secondary/30 px-4 py-2">
          <span className="h-3 w-3 rounded-full bg-destructive/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-primary/80" />
          <span className="ml-4 font-mono text-xs text-muted-foreground">agent-fund@celo:~</span>
          <span className="ml-auto font-mono text-xs text-primary/60">v1.0</span>
        </div>

        {/* Terminal body */}
        <div
          ref={scrollRef}
          className="h-[400px] overflow-y-auto p-4 font-mono text-sm"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className={`whitespace-pre-wrap break-all ${
                line.type === "input"
                  ? "text-primary"
                  : line.type === "error"
                  ? "text-destructive"
                  : line.type === "success"
                  ? "text-primary"
                  : line.type === "info"
                  ? "text-muted-foreground"
                  : "text-foreground"
              }`}
            >
              {line.text}
            </div>
          ))}

          {/* Input line */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-primary font-bold">{">"}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-foreground outline-none caret-primary font-mono text-sm"
              placeholder="type a command..."
              autoFocus
              spellCheck={false}
            />
            <span className="cursor-blink text-primary">█</span>
          </div>
        </div>
      </div>
    </section>
  );
}
