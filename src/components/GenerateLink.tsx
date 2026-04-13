import { useState } from "react";
import { toast } from "sonner";

export function GenerateLink() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const generate = () => {
    if (!recipient || !/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      toast.error("Invalid recipient address");
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Invalid amount");
      return;
    }
    const url = `${window.location.origin}?recipient=${recipient}&amount=${amount}`;
    setGeneratedLink(url);
    toast.success("Fund link generated!");
  };

  const copy = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success("Link copied!");
  };

  return (
    <section id="generate" className="mx-auto max-w-4xl px-4 py-16">
      <h2 className="font-terminal text-3xl neon-text mb-6">GENERATE FUND LINK</h2>
      <div className="neon-border rounded border bg-terminal-bg p-6">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block font-mono text-xs text-muted-foreground">
              RECIPIENT ADDRESS
            </label>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="w-full rounded border border-border bg-secondary/50 px-4 py-2.5 font-mono text-sm text-foreground outline-none transition-all focus:neon-border placeholder:text-muted-foreground/50"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-muted-foreground">
              AMOUNT (CELO)
            </label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.5"
              type="number"
              step="0.01"
              className="w-full rounded border border-border bg-secondary/50 px-4 py-2.5 font-mono text-sm text-foreground outline-none transition-all focus:neon-border placeholder:text-muted-foreground/50"
            />
          </div>
          <button
            onClick={generate}
            className="glitch-hover neon-border-bright w-full rounded border bg-primary/10 px-6 py-3 font-terminal text-lg text-primary transition-all hover:bg-primary/20"
          >
            GENERATE LINK
          </button>

          {generatedLink && (
            <div className="mt-4 animate-fade-in-up">
              <label className="mb-1 block font-mono text-xs text-muted-foreground">
                SHAREABLE LINK
              </label>
              <div className="flex items-stretch gap-2">
                <input
                  value={generatedLink}
                  readOnly
                  className="flex-1 rounded border border-primary/30 bg-primary/5 px-4 py-2.5 font-mono text-xs text-primary outline-none"
                />
                <button
                  onClick={copy}
                  className="rounded border border-border bg-secondary px-4 font-mono text-xs text-primary transition-all hover:bg-secondary/80"
                >
                  COPY
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
