// File: frontend/app/components/MarketCard.tsx

"use client";

import Link from "next/link";
import { Clock, TrendingUp } from "lucide-react";
import { useReadContracts } from 'wagmi';
import { formatEther } from 'viem';
import { bettingMarketConfig } from "@/lib/contracts";
import { formatTimeAgo } from "@/lib/utils";

interface MarketCardProps {
  id: `0x${string}`; // Use a more specific type for the address
  question: string;
}

export default function MarketCard({ id, question }: MarketCardProps) {
  // Define the contract calls
  const marketContract = {
    ...bettingMarketConfig,
    address: id, // Use the specific address for this card
  };

  const { data, isLoading } = useReadContracts({
    contracts: [
      { ...marketContract, functionName: 'deadline' },
      { ...marketContract, functionName: 'totalBets', args: [true] }, // Total bets on YES
      { ...marketContract, functionName: 'totalBets', args: [false] }, // Total bets on NO
    ]
  });

  // Extract data once loaded
  const deadline = data?.[0]?.result;
  const totalYesBets = data?.[1]?.result ?? BigInt(0); // Use BigInt(0) as fallback
  const totalNoBets = data?.[2]?.result ?? BigInt(0); // Use BigInt(0) as fallback

  // Format the data for display
  const totalVolume = formatEther(totalYesBets + totalNoBets);
  const endsIn = deadline ? formatTimeAgo(deadline) : "Loading...";

  return (
    <div className="bg-charcoal rounded-xl p-6 card-glow flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white leading-tight h-14">
          {question}
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-300">
            <TrendingUp size={16} className="mr-2 text-neon-green" />
            <span className="text-sm">
              {isLoading ? 'Loading...' : `${parseFloat(totalVolume).toFixed(4)} ETH Volume`}
            </span>
          </div>

          <div className="flex items-center text-gray-300">
            <Clock size={16} className="mr-2 text-electric-purple" />
            <span className="text-sm">{endsIn}</span>
          </div>
        </div>
      </div>

      <Link href={`/chats?market=${id}`}>
        <button className="w-full mt-auto py-3 bg-neon-green text-navy-dark font-semibold rounded-lg glow-button hover:bg-neon-green/90">
          View Market
        </button>
      </Link>
    </div>
  )
}