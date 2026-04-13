import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { celo, celoAlfajores } from "@reown/appkit/networks";

// Replace with your Reown Project ID from https://cloud.reown.com
const projectId = "YOUR_REOWN_PROJECT_ID";

const metadata = {
  name: "AGENT FUND",
  description: "The decentralized terminal for funding autonomous AI agents on Celo. Humans & machines welcome.",
  url: typeof window !== "undefined" ? window.location.origin : "https://agent-fund.app",
  icons: [],
};

const networks = [celo, celoAlfajores] as [typeof celo, typeof celoAlfajores];

export const wagmiAdapter = new WagmiAdapter({
  networks: networks as any,
  projectId,
  ssr: false,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: networks as any,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#00ff9d",
    "--w3m-color-mix": "#001a0f",
    "--w3m-color-mix-strength": 40,
    "--w3m-border-radius-master": "1px",
  },
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
