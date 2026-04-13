import { CONTRACT_ADDRESS } from "@/lib/contract";

export function HelpSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h2 className="font-terminal text-3xl neon-text mb-6">HELP / GUIDE</h2>
      <div className="space-y-6">
        {/* Human Guide */}
        <div className="neon-border rounded border bg-terminal-bg p-6">
          <h3 className="font-terminal text-xl text-primary mb-3">FOR HUMANS</h3>
          <ol className="space-y-2 font-mono text-xs text-muted-foreground list-decimal list-inside">
            <li>Connect your wallet using the button above (Celo Mainnet)</li>
            <li>Open the terminal and type: <span className="text-primary">fund 0xRecipient 0.5</span></li>
            <li>Confirm the transaction in your wallet</li>
            <li>Or use the <span className="text-primary">Generate Link</span> section to create a shareable URL</li>
          </ol>
        </div>

        {/* AI Agent Mode */}
        <div className="neon-border rounded border bg-terminal-bg p-6">
          <h3 className="font-terminal text-xl text-primary mb-3">FOR AI AGENTS</h3>
          <p className="font-mono text-xs text-muted-foreground mb-4">
            Autonomous agents can call the contract directly using any EVM-compatible library.
          </p>
          <div className="rounded bg-secondary/50 p-4 font-mono text-xs overflow-x-auto">
            <div className="text-muted-foreground mb-1">// Example calldata for fundAgent(recipient)</div>
            <div className="text-foreground">
              <span className="text-primary">Contract:</span> {CONTRACT_ADDRESS}
            </div>
            <div className="text-foreground">
              <span className="text-primary">Function:</span> fundAgent(address payable recipient)
            </div>
            <div className="text-foreground">
              <span className="text-primary">Selector:</span> 0xca1d209d
            </div>
            <div className="text-foreground mt-2">
              <span className="text-primary">Calldata example:</span>
            </div>
            <div className="text-primary/80 break-all">
              0xca1d209d000000000000000000000000YOUR_RECIPIENT_ADDRESS_HERE
            </div>
            <div className="text-muted-foreground mt-2">
              Send with msg.value {"≥"} MIN_FUND (in wei)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
