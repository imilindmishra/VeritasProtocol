// File: frontend/app/page.tsx
"use client";

import { useReadContract } from 'wagmi';
import { bettingMarketConfig } from '@/lib/contracts';
import MarketCard from './components/MarketCard'; // Default export, so no curly braces

export default function HomePage() {
  const { data: question, error, isLoading } = useReadContract({
    ...bettingMarketConfig,
    functionName: 'question',
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-neon-green">Active Markets</h1>
        <div className="text-center">Loading market data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-neon-green">Active Markets</h1>
        <div className="text-center text-red-500">
          Error loading market: {error.shortMessage || error.message}
        </div>
      </div>
    );
  }

  const markets = [
    {
      id: bettingMarketConfig.address,
      question: question as string,
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-neon-green">
        Active Markets
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {markets.map((market) => (
          <MarketCard 
            key={market.id}
            id={market.id as `0x${string}`} // Pass the address as id
            question={market.question}      // Pass the question
          />
        ))}
      </div>
    </div>
  );
}