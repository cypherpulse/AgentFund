export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="/" className="flex items-center gap-2 sm:gap-3" aria-label="Agent Fund home">
          <img
            src="/logo-mark.svg"
            alt="Agent Fund logo"
            className="h-8 w-8 rounded-md border border-primary/30 bg-secondary/60 p-1 sm:h-9 sm:w-9"
          />
          <img
            src="/logo-wordmark.svg"
            alt="Agent Fund"
            className="hidden h-6 w-auto sm:block"
          />
          <span className="font-terminal text-lg neon-text sm:hidden">AGENT FUND</span>
          <span className="rounded border border-border bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            v1.0
          </span>
        </a>
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
