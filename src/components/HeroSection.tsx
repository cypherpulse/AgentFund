import { useMinFund } from "@/hooks/useContract";
import { CONTRACT_ADDRESS } from "@/lib/contract";
import { useState } from "react";
import { toast } from "sonner";

export function HeroSection({ onOpenTerminal }: { onOpenTerminal: () => void }) {
  const { minFund, isLoading } = useMinFund();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    toast.success("Contract address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative flex flex-col items-center justify-center px-4 pt-32 pb-20 text-center">
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-secondary/40 px-4 py-2">
        <img src="/logo-mark.svg" alt="Agent Fund logo" className="h-8 w-8" />
        <img src="/logo-wordmark.svg" alt="Agent Fund" className="h-7 w-auto" />
      </div>

      {/* Status indicator */}
      <div className="mb-8 flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-mono">
        <span className="status-dot h-2 w-2 rounded-full bg-primary" />
        <span className="text-muted-foreground">SYSTEM ONLINE</span>
        <span className="text-primary">•</span>
        <span className="text-muted-foreground">CELO MAINNET</span>
      </div>

      {/* Main headline */}
      <h1 className="font-terminal text-5xl sm:text-7xl md:text-8xl lg:text-9xl neon-text glitch-text mb-4 tracking-tight">
        FUND YOUR
        <br />
        AI AGENT
      </h1>

      <p className="max-w-xl text-muted-foreground text-sm sm:text-base mb-8 font-mono">
        The decentralized terminal for funding autonomous AI agents on Celo.
        <br />
        Humans & machines welcome.
      </p>

      {/* Contract address */}
      <button
        onClick={copyAddress}
        className="group mb-8 flex items-center gap-2 rounded border border-border bg-secondary/50 px-4 py-2 font-mono text-xs transition-all hover:neon-border"
      >
        <span className="text-muted-foreground">CONTRACT:</span>
        <span className="text-primary truncate max-w-[200px] sm:max-w-none">
          {CONTRACT_ADDRESS}
        </span>
        <span className="text-muted-foreground group-hover:text-primary transition-colors">
          {copied ? "✓" : "⧉"}
        </span>
      </button>

      {/* MIN_FUND display */}
      {!isLoading && minFund && (
        <div className="mb-8 text-xs font-mono text-muted-foreground">
          MIN_FUND: <span className="text-primary">{minFund} CELO</span>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onOpenTerminal}
          className="glitch-hover neon-border-bright rounded border bg-primary/10 px-8 py-3 font-terminal text-xl text-primary transition-all hover:bg-primary/20"
        >
          {">"} OPEN TERMINAL
        </button>
        <a
          href="#generate"
          className="glitch-hover rounded border border-border bg-secondary/50 px-8 py-3 font-terminal text-xl text-muted-foreground transition-all hover:text-primary hover:border-primary/40"
        >
          GENERATE FUND LINK
        </a>
      </div>

      {/* Wallet connect */}
      <div className="mt-8">
        <appkit-button />
      </div>
    </section>
  );
}
