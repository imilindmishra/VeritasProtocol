"use client";

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { marketFactoryConfig, bettingMarketInterface } from '@/lib/contracts';
import { formatEther } from 'viem';
import Link from 'next/link';
import { CircleHelp, BadgeCheck, BadgeX } from 'lucide-react';

// Bet ki details store karne ke liye ek interface
interface UserBet {
  marketAddress: `0x${string}`;
  question: string;
  betAmount: string;
  betSide: 'YES' | 'NO';
  isResolved: boolean;
  outcome?: boolean;
}

export default function MyBetsPage() {
  const { address: userAddress, isConnected } = useAccount();
  const [userBets, setUserBets] = useState<UserBet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Step 1: Saare market addresses fetch karo
  const { data: marketAddresses } = useReadContract({
    ...marketFactoryConfig,
    functionName: 'getDeployedMarkets',
    query: { enabled: isConnected },
  });

  // Step 2: Har market se user ki bet details fetch karo
  const contractsToQuery = marketAddresses
    ? (marketAddresses as readonly string[]).flatMap(addr => {
        const address = addr as `0x${string}`;
        return [
          { address, abi: bettingMarketInterface.abi, functionName: 'question' },
          { address, abi: bettingMarketInterface.abi, functionName: 'resolved' },
          { address, abi: bettingMarketInterface.abi, functionName: 'outcome' },
          { address, abi: bettingMarketInterface.abi, functionName: 'betsOnYes', args: [userAddress!] },
          { address, abi: bettingMarketInterface.abi, functionName: 'betsOnNo', args: [userAddress!] },
        ];
      })
    : [];

  const { data: multiCallResult } = useReadContracts({
    contracts: contractsToQuery,
    query: { enabled: !!marketAddresses && !!userAddress },
  });

  useEffect(() => {
    if (multiCallResult && marketAddresses) {
      const bets: UserBet[] = [];
      // Har 5 results ek market ke liye hain
      for (let i = 0; i < multiCallResult.length; i += 5) {
        const marketIndex = i / 5;
        const marketAddress = (marketAddresses as readonly string[])[marketIndex] as `0x${string}`;
        
        const question = multiCallResult[i]?.result as string;
        const isResolved = multiCallResult[i + 1]?.result as boolean;
        const outcome = multiCallResult[i + 2]?.result as boolean;
        const betOnYes = multiCallResult[i + 3]?.result as bigint;
        const betOnNo = multiCallResult[i + 4]?.result as bigint;

        if (betOnYes > 0n) {
          bets.push({
            marketAddress,
            question,
            isResolved,
            outcome,
            betSide: 'YES',
            betAmount: formatEther(betOnYes),
          });
        }
        if (betOnNo > 0n) {
          bets.push({
            marketAddress,
            question,
            isResolved,
            outcome,
            betSide: 'NO',
            betAmount: formatEther(betOnNo),
          });
        }
      }
      setUserBets(bets);
      setIsLoading(false);
    } else if (!marketAddresses) {
        setIsLoading(false);
    }
  }, [multiCallResult, marketAddresses]);

  const getBetStatus = (bet: UserBet) => {
    if (!bet.isResolved) {
      return (
        <span className="flex items-center text-yellow-400">
          <CircleHelp size={16} className="mr-2" />
          Active
        </span>
      );
    }
    const userWon = (bet.betSide === 'YES' && bet.outcome === true) || (bet.betSide === 'NO' && bet.outcome === false);
    if (userWon) {
      return (
        <span className="flex items-center text-green-400">
          <BadgeCheck size={16} className="mr-2" />
          Won
        </span>
      );
    }
    return (
      <span className="flex items-center text-red-400">
        <BadgeX size={16} className="mr-2" />
        Lost
      </span>
    );
  };

  if (isLoading) {
    return <div className="text-center py-10 text-lg">Loading your bets...</div>;
  }
  
  if (!isConnected) {
    return <div className="text-center py-10 text-lg">Please connect your wallet to see your bets.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-neon-green">
        My Bets
      </h1>
      
      {userBets.length > 0 ? (
        <div className="space-y-4">
          {userBets.map((bet) => (
            <Link href={`/chats?market=${bet.marketAddress}`} key={bet.marketAddress + bet.betSide}>
              <div className="bg-charcoal p-6 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-white">{bet.question}</p>
                  <p className="text-gray-300">
                    You bet <span className="font-bold text-neon-green">{bet.betAmount} ETH</span> on <span className="font-bold text-neon-green">{bet.betSide}</span>
                  </p>
                </div>
                <div className="text-right">
                  {getBetStatus(bet)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-16">
          <p className="text-2xl">You haven't placed any bets yet.</p>
          <p className="mt-2">Explore active markets and place your first bet!</p>
        </div>
      )}
    </div>
  );
}