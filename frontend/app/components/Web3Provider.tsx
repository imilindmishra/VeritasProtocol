"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { optimismSepolia } from "wagmi/chains";
import { injected } from 'wagmi/connectors';

const wagmiConfig = createConfig({
  chains: [optimismSepolia],
  connectors: [injected()],
  transports: {
    [optimismSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}