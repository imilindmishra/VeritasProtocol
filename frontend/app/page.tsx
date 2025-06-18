"use client";

import { useReadContract } from 'wagmi';
// marketFactoryConfig ko import karo
import { marketFactoryConfig } from '@/lib/contracts'; 
import MarketCard from './components/MarketCard';

export default function HomePage() {
  // MarketFactory se saare deployed market addresses fetch karo
  const { 
    data: marketAddresses, 
    error, 
    isLoading 
  } = useReadContract({
    ...marketFactoryConfig,
    functionName: 'getDeployedMarkets',
    // watch: true, // Isko uncomment karne se naye market create hone pe list automatically update hogi
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-neon-green">Active Markets</h1>
        <div className="text-center text-lg">Loading active markets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-neon-green">Active Markets</h1>
        <div className="text-center text-red-500">
          Error loading markets: {error.shortMessage || error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-neon-green">
        Active Markets
      </h1>

      {/* Check karo ki koi market hai ya nahi */}
      {marketAddresses && marketAddresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* marketAddresses array pe map karke har address ke liye ek MarketCard banao */}
          {marketAddresses.map((address) => (
            <MarketCard 
              key={address}
              id={address} // MarketCard ko ab sirf market ka address as an 'id' chahiye
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-16">
          <p className="text-2xl">No active markets found.</p>
          <p className="mt-2">Why don't you create one?</p>
        </div>
      )}
    </div>
  );
}