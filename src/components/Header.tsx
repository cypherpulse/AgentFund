export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-terminal text-2xl neon-text">AGENT FUND</span>
          <span className="rounded border border-border bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            v1.0
          </span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 font-mono text-xs text-muted-foreground">
          <a href="#terminal" className="transition-colors hover:text-primary">TERMINAL</a>
          <a href="#generate" className="transition-colors hover:text-primary">LINKS</a>
        </nav>
        <div>
          <appkit-button size="sm" />
        </div>
      </div>
    </header>
  );
}
