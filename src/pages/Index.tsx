import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { Terminal } from "@/components/Terminal";
import { RecentFundings } from "@/components/RecentFundings";
import { GenerateLink } from "@/components/GenerateLink";
import { HelpSection } from "@/components/HelpSection";

const Index = () => {
  const [searchParams] = useSearchParams();
  const terminalRef = useRef<HTMLDivElement>(null);

  // Handle fund links: ?recipient=0x...&amount=0.5
  useEffect(() => {
    const recipient = searchParams.get("recipient");
    const amount = searchParams.get("amount");
    if (recipient && amount) {
      // Scroll to terminal
      setTimeout(() => {
        document.getElementById("terminal")?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [searchParams]);

  const scrollToTerminal = () => {
    document.getElementById("terminal")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="scanlines min-h-screen">
      <Header />
      <main>
        <HeroSection onOpenTerminal={scrollToTerminal} />
        <Terminal />
        <RecentFundings />
        <GenerateLink />
        <HelpSection />
      </main>
      <footer className="border-t border-border/30 py-8 text-center font-mono text-xs text-muted-foreground">
        <div className="mb-2 flex items-center justify-center gap-2">
          <img src="/logo-mark.svg" alt="Agent Fund logo" className="h-5 w-5" />
          <span className="text-primary/80">AGENT FUND</span>
        </div>
        <div>© {new Date().getFullYear()} — Built on Celo</div>
      </footer>
    </div>
  );
};

export default Index;
