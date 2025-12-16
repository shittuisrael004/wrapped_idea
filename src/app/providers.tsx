// src/app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, cookieToInitialState, type State } from "wagmi";
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, celo } from "@reown/appkit/networks"; // Import networks from Reown
import { ReactNode } from "react";


export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "YOUR_PROJECT_ID_HERE";

export const networks = [base, celo];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
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
    analytics: true // Optional
  }
});

const queryClient = new QueryClient();

export function Providers({ children, initialState }: { children: ReactNode, initialState?: State }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}