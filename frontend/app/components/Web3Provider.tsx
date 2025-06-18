// File: frontend/app/components/Web3Provider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { optimismSepolia } from "wagmi/chains";
import { injected } from 'wagmi/connectors';

// 1. Create a wagmi config
const config = createConfig({
  chains: [optimismSepolia],
  connectors: [injected()],
  transports: {
    [optimismSepolia.id]: http(),
  },
});

// 2. Create a new QueryClient instance
const queryClient = new QueryClient();


// 3. Create the Web3Provider component
export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    </WagmiProvider>
  );
}