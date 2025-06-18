"use client";

import Link from "next/link";
import { Clock, TrendingUp } from "lucide-react";
import { useReadContracts } from 'wagmi';
import { formatEther } from 'viem';
// bettingMarketConfig ki jagah bettingMarketInterface ko import karo
import { bettingMarketInterface } from "@/lib/contracts";
import { formatTimeAgo } from "@/lib/utils";

// MarketCard ko ab sirf 'id' (market ka address) chahiye
interface MarketCardProps {
  id: `0x${string}`;
}

export default function MarketCard({ id }: MarketCardProps) {
  // Is market ki saari details fetch karo
  const { data, isLoading } = useReadContracts({
    // allowFailure: false ensures that if one call fails, all fail.
    // Useful for when a component depends on all data being present.
    allowFailure: false, 
    contracts: [
      {
        address: id,
        abi: bettingMarketInterface.abi,
        functionName: 'question',
      },
      {
        address: id,
        abi: bettingMarketInterface.abi,
        functionName: 'deadline',
      },
      {
        address: id,
        abi: bettingMarketInterface.abi,
        functionName: 'totalBetsYes',
      },
      {
        address: id,
        abi: bettingMarketInterface.abi,
        functionName: 'totalBetsNo',
      }
    ]
  });

  // Extract data once loaded
  const [question, deadline, totalYesBets, totalNoBets] = data || [];

  // Format the data for display
  const totalVolume = (totalYesBets ?? 0n) + (totalNoBets ?? 0n);
  const formattedVolume = formatEther(totalVolume);
  const endsIn = deadline ? formatTimeAgo(deadline as bigint) : "Loading...";

  // Loading state ke liye ek placeholder dikhao
  if (isLoading) {
    return (
        <div className="bg-charcoal rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-3"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-12 bg-gray-600 rounded-lg mt-6"></div>
        </div>
    )
  }

  return (
    <div className="bg-charcoal rounded-xl p-6 card-glow flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white leading-tight h-14">
          {question as string}
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-300">
            <TrendingUp size={16} className="mr-2 text-neon-green" />
            <span className="text-sm">
              {`${parseFloat(formattedVolume).toFixed(4)} ETH Volume`}
            </span>
          </div>

          <div className="flex items-center text-gray-300">
            <Clock size={16} className="mr-2 text-electric-purple" />
            <span className="text-sm">{endsIn}</span>
          </div>
        </div>
      </div>

      <Link href={`/chats?market=${id}`} className="mt-auto">
        <button className="w-full py-3 bg-neon-green text-navy-dark font-semibold rounded-lg glow-button hover:bg-neon-green/90">
          View Market
        </button>
      </Link>
    </div>
  )
}