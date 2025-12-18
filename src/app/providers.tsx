"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, type State } from "wagmi";
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, celo } from "@reown/appkit/networks";
import { ReactNode, useEffect } from "react";
import sdk from "@farcaster/frame-sdk";

// --- CHANGED: IMPORT FROM LOCAL FILE ---
import { frameConnector } from "@/lib/connector"; 

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "YOUR_PROJECT_ID_HERE";

export const networks = [base, celo];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
  connectors: [
    frameConnector()
  ]
});

const metadata = {
  name: 'WrappedOnChain',
  description: 'Your 2025 Onchain Year in Review',
  url: 'https://wrapped-onchain.vercel.app', 
  icons: ['https://wrapped-onchain.vercel.app/favicon.ico'],
}

createAppKit({
  adapters: [wagmiAdapter],
  networks: [base, celo],
  projectId,
  metadata,
  features: {
    analytics: true 
  }
});

const queryClient = new QueryClient();

function FarcasterInit() {
  useEffect(() => {
    const load = async () => {
      sdk.actions.ready();
    };
    if (sdk && sdk.actions) {
        load();
    }
  }, []);

  return null;
}

export function Providers({ children, initialState }: { children: ReactNode, initialState?: State }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <FarcasterInit />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}