import { useFundingEvents, type FundingEvent } from "@/hooks/useContract";
import { useEffect, useState } from "react";

function shortenAddress(addr: string) {
  return addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "—";
}

function timeAgo(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function HexStream() {
  const [chars, setChars] = useState("");
  useEffect(() => {
    const id = setInterval(() => {
      const hex = Array.from({ length: 32 }, () =>
        "0123456789abcdef"[Math.floor(Math.random() * 16)]
      ).join("");
      setChars(hex);
    }, 150);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="text-primary/30 text-[10px] font-mono select-none overflow-hidden whitespace-nowrap drop-shadow-[0_0_3px_rgba(var(--primary),0.3)] animate-pulse">
      {chars}
    </span>
  );
}

function LiveIndicator() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </span>
      <span className="font-mono text-[10px] text-primary uppercase tracking-widest">
        Live Feed
      </span>
    </div>
  );
}

function EventRow({ event, index }: { event: FundingEvent; index: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 60);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className={`group flex items-center justify-between border-b border-border/20 py-3 px-4 font-mono text-xs transition-all duration-500 hover:bg-primary/10 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-6 min-w-0">
        <div className="flex flex-col items-start min-w-[70px]">
          <span className="text-primary font-bold text-sm tracking-tight drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]">
            {Number(event.amount).toFixed(4)}
          </span>
          <span className="text-primary/40 text-[9px] tracking-widest">CELO</span>
        </div>
        
        <div className="hidden sm:flex text-muted-foreground/30 text-xs">
          <span className="animate-pulse">▶</span>
          <span className="animate-pulse" style={{ animationDelay: "150ms" }}>▶</span>
          <span className="animate-pulse" style={{ animationDelay: "300ms" }}>▶</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 flex-1 min-w-0">
          <div className="flex flex-col items-start">
            <span className="text-[9px] text-muted-foreground/50 tracking-widest mb-0.5">SENDER</span>
            <span className="text-muted-foreground group-hover:text-foreground transition-colors truncate px-2 py-0.5 rounded bg-muted/20 border border-border/20">
              {shortenAddress(event.sender)}
            </span>
          </div>

          <span className="text-primary/40 rotate-90 sm:rotate-0 sm:mx-2 hidden sm:inline">→</span>

          <div className="flex flex-col items-start">
            <span className="text-[9px] text-muted-foreground/50 tracking-widest mb-0.5">RECIPIENT</span>
            <span className="text-foreground group-hover:text-primary transition-colors truncate px-2 py-0.5 rounded bg-primary/5 border border-primary/20 font-bold">
              {shortenAddress(event.recipient)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
        {event.txHash && (
          <a
            href={`https://celoscan.io/tx/${event.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary/50 hover:text-primary text-[10px] transition-all hover:bg-primary/10 px-2 py-1 rounded"
            title="View on CeloScan"
          >
            <span>TX</span>
            <span className="inline-block -rotate-45">↗</span>
          </a>
        )}
        <span className="text-muted-foreground/40 text-[10px] tabular-nums tracking-widest">
          {timeAgo(event.timestamp)}
        </span>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="py-8 flex flex-col items-center gap-3">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-1.5 h-6 bg-primary/30 rounded-sm"
            style={{
              animation: `pulse 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
      <div className="font-mono text-[10px] text-primary/50 tracking-widest">
        SCANNING BLOCKCHAIN...
      </div>
    </div>
  );
}

export function RecentFundings() {
  const { events, isLoading } = useFundingEvents();

  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-terminal text-2xl sm:text-3xl neon-text tracking-wider">
          ◈ NETWORK ACTIVITY
        </h2>
        <LiveIndicator />
      </div>

      <div className="relative neon-border rounded-lg border border-primary/30 bg-terminal-bg overflow-hidden shadow-[0_0_30px_rgba(0,255,0,0.15)] group transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,255,0,0.25)] before:absolute before:inset-0 before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] before:bg-[size:30px_30px] before:opacity-10 before:pointer-events-none after:absolute after:inset-y-0 after:-left-[200px] after:w-[200px] after:bg-gradient-to-r after:from-transparent after:via-primary/5 after:to-transparent after:skew-x-[-45deg] after:animate-[scanline_8s_ease-in-out_infinite_alternate]">
        {/* Header bar */}
        <div className="relative flex items-center justify-between border-b border-border/50 bg-secondary/40 px-4 py-3 z-10 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,0,0.8)]"></span>
            </span>
            <span className="font-mono text-xs font-bold text-primary tracking-widest uppercase shadow-black drop-shadow-md">
              SYS.LOG.MONITOR
            </span>
            <span className="text-muted-foreground/30 text-xs">│</span>
            <span className="font-mono text-[10px] text-muted-foreground bg-black/50 px-2 py-0.5 rounded border border-white/5">
              DATA: {events.length} NODES
            </span>
          </div>
          <div className="hidden sm:block w-64 overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-secondary/40 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-secondary/40 to-transparent z-10" />
            <HexStream />
          </div>
        </div>

        {/* Column Headers omitted for cleaner matrix-like layout */}

        {/* Event list */}
        <div className="max-h-[500px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          {isLoading ? (
            <LoadingState />
          ) : events.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center gap-2">
              <div className="font-mono text-xs text-muted-foreground/60">
                ⟐ Monitoring AgentFunded events...
              </div>
              <div className="font-mono text-[10px] text-primary/30">
                No recent transactions detected in the last ~10 hours. Fund an agent to initiate activity.
              </div>
            </div>
          ) : (
            events.map((e, i) => (
              <EventRow key={`${e.txHash}-${i}`} event={e} index={i} />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 bg-secondary/30 px-4 py-2.5 flex items-center justify-between shadow-[inset_0_10px_20px_-10px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground/40 font-bold uppercase">
              NODE: <span className="text-primary/70 ml-1 bg-black/30 px-2 py-0.5 rounded border border-primary/10">{`${CONTRACT_ADDRESS.slice(0, 8)}…${CONTRACT_ADDRESS.slice(-6)}`}</span>
            </span>
          </div>
          <span className="font-mono text-xs font-bold text-muted-foreground/40 flex items-center gap-2">
            CELO-NET 
            <span className="inline-block h-2 w-2 rounded-sm bg-yellow-500/50" />
          </span>
        </div>
      </div>
    </section>
  );
}

const CONTRACT_ADDRESS = "0xf367A28B1705b220e23d140A48cDD89f496bC185";
