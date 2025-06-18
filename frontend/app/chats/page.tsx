"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Menu, X, RefreshCw, Award, CheckCircle } from "lucide-react";
import { formatEther, parseEther } from "viem";
import {
  useAccount,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import DonutChart from "../components/DonutChart";
import ChatMessage from "../components/ChatMessage";
import { bettingMarketInterface } from "@/lib/contracts";

export default function ChatsPage() {
  const searchParams = useSearchParams();
  const rawMarketId = searchParams.get("market");
  const marketId = (rawMarketId?.startsWith("0x") ? rawMarketId : undefined) as
    | `0x${string}`
    | undefined;

  if (!marketId) {
    return <div className="text-center py-10">Market ID not found in URL.</div>;
  }

  const safeMarketId = marketId as `0x${string}`;
  const { address: userAddress, isConnected } = useAccount();

  const [betAmount, setBetAmount] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [parentUrl, setParentUrl] = useState("");
  const [casts, setCasts] = useState<any[]>([]);
  const [isChatLoading, setChatLoading] = useState(true);
  const [hasWithdrawn, setHasWithdrawn] = useState(false);

  const fetchCasts = useCallback(async () => {
    if (!parentUrl) return;
    setChatLoading(true);
    try {
      const response = await fetch(`/api/casts?url=${encodeURIComponent(parentUrl)}`);
      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }
      const data = await response.json();
      setCasts(data);
    } catch (error) {
      console.error("Failed to fetch casts:", error);
      setCasts([]);
    } finally {
      setChatLoading(false);
    }
  }, [parentUrl]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setParentUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    if (parentUrl) {
      fetchCasts();
    }
  }, [parentUrl, fetchCasts]);

  const { data: contractData, isLoading: isReadingContract, refetch: refetchContractData } = useReadContracts({
    contracts: [
      { address: safeMarketId, abi: bettingMarketInterface.abi, functionName: "question" },
      { address: safeMarketId, abi: bettingMarketInterface.abi, functionName: "totalBetsYes" },
      { address: safeMarketId, abi: bettingMarketInterface.abi, functionName: "totalBetsNo" },
      { address: safeMarketId, abi: bettingMarketInterface.abi, functionName: "betsOnYes", args: userAddress ? [userAddress] : undefined },
      { address: safeMarketId, abi: bettingMarketInterface.abi, functionName: "betsOnNo", args: userAddress ? [userAddress] : undefined },
      { address: safeMarketId, abi: bettingMarketInterface.abi, functionName: "owner" },
      { address: safeMarketId, abi: bettingMarketInterface.abi, functionName: "resolved" },
      { address: safeMarketId, abi: bettingMarketInterface.abi, functionName: "deadline" },
      { address: safeMarketId, abi: bettingMarketInterface.abi, functionName: "outcome" },
    ],
    query: { enabled: true },
  });

  const { data: betHash, isPending: isBetting, writeContract: placeBetContract } = useWriteContract();
  const { data: resolveHash, isPending: isResolving, writeContract: resolveMarketContract } = useWriteContract();
  const { data: withdrawHash, isPending: isWithdrawing, writeContract: withdrawPayoutContract } = useWriteContract();

  const { isLoading: isConfirmingBet, isSuccess: isBetConfirmed } = useWaitForTransactionReceipt({ hash: betHash });
  const { isLoading: isConfirmingResolve, isSuccess: isResolveConfirmed } = useWaitForTransactionReceipt({ hash: resolveHash });
  const { isLoading: isConfirmingWithdraw, isSuccess: isWithdrawConfirmed } = useWaitForTransactionReceipt({ hash: withdrawHash });

  useEffect(() => {
    if (isBetConfirmed) {
      alert("Bet placed!");
      refetchContractData();
    }
  }, [isBetConfirmed, refetchContractData]);

  useEffect(() => {
    if (isResolveConfirmed) {
      alert("Market Resolved!");
      refetchContractData();
    }
  }, [isResolveConfirmed, refetchContractData]);

  useEffect(() => {
    if (isWithdrawConfirmed) {
      alert("Payout Withdrawn!");
      setHasWithdrawn(true);
      refetchContractData();
    }
  }, [isWithdrawConfirmed, refetchContractData]);

  const [question, totalYes, totalNo, userBetOnYes, userBetOnNo, owner, isResolved, deadline, finalOutcome] =
    contractData || [];

  const isOwner = userAddress?.toLowerCase() === owner?.result?.toLowerCase();
  const deadlinePassed = deadline?.result ? new Date() > new Date(Number(deadline.result) * 1000) : false;

  const totalYesBets = totalYes?.result ?? 0n;
  const totalNoBets = totalNo?.result ?? 0n;
  const totalVolume = totalYesBets + totalNoBets;

  const userBetYesAmount = userBetOnYes?.result ?? 0n;
  const userBetNoAmount = userBetOnNo?.result ?? 0n;
  const totalUserBet = userBetYesAmount + userBetNoAmount;

  const didUserWin = isResolved?.result && (
    (finalOutcome?.result === true && userBetYesAmount > 0n) ||
    (finalOutcome?.result === false && userBetNoAmount > 0n)
  );

  let yesPercentage = 50;
  let noPercentage = 50;
  if (totalVolume > 0n) {
    yesPercentage = Math.round(Number(totalYesBets * 100n / totalVolume));
    noPercentage = 100 - yesPercentage;
  }

  const handleBet = (choice: boolean) => {
    if (!betAmount || parseFloat(betAmount) <= 0) {
      alert("Please enter a valid bet amount.");
      return;
    }
    placeBetContract({
      address: safeMarketId,
      abi: bettingMarketInterface.abi,
      functionName: "placeBet",
      args: [choice],
      value: parseEther(betAmount),
    });
  };

  const handleResolve = (resolveOutcome: boolean) => {
    resolveMarketContract({
      address: safeMarketId,
      abi: bettingMarketInterface.abi,
      functionName: "resolveMarket",
      args: [resolveOutcome],
    });
  };

  const handleWithdraw = () => {
    withdrawPayoutContract({
      address: safeMarketId,
      abi: bettingMarketInterface.abi,
      functionName: "withdrawPayout",
    });
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const warpcastIntent = `https://warpcast.com/~/compose?text=${encodeURIComponent(chatMessage)}&embeds[]=${encodeURIComponent(parentUrl)}`;
    window.open(warpcastIntent, "_blank");
    setChatMessage("");
  };

  if (isReadingContract) return <div className="text-center py-10">Loading market details...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white container mx-auto px-4 py-8">
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="flex items-center justify-center w-full px-4 py-3 bg-gray-800 rounded-lg text-green-400 hover:bg-gray-700 transition-colors"
        >
          {isChatOpen ? <X size={20} /> : <Menu size={20} />}
          <span className="ml-2">{isChatOpen ? "Hide Chat" : "Show Chat"}</span>
        </button>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`flex-1 ${isChatOpen ? "" : "hidden lg:block"}`}>
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{question?.result as string}</h1>
            <p className="text-gray-400 text-sm md:text-base font-mono break-all">Market ID: {safeMarketId}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4 text-center">Current Odds</h2>
            <DonutChart yesPercentage={yesPercentage} noPercentage={noPercentage} />
          </div>

          <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-6">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Place Your Bet</h3>
            {isResolved?.result ? (
              <div className="text-center text-gray-400 p-4 border border-dashed border-gray-600 rounded-lg">
                This market has been resolved. Betting is closed.
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm md:text-base font-medium text-gray-300 mb-2">Bet Amount (ETH)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      placeholder="0.0"
                      disabled={isBetting || isConfirmingBet}
                      className="w-full px-3 py-2 md:px-4 md:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-green-400 focus:outline-none disabled:opacity-50"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">Ξ</div>
                  </div>
                  <div className="h-5 mt-2 text-sm md:text-base">
                    {isBetting && <p className="text-yellow-400">Waiting for wallet confirmation...</p>}
                    {isConfirmingBet && <p className="text-blue-400">Placing bet on blockchain...</p>}
                    {isBetConfirmed && betHash && (
                      <p className="text-green-400">
                        Bet confirmed!{" "}
                        <a
                          href={`https://sepolia-optimism.etherscan.io/tx/${betHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {betHash.slice(0, 10)}...
                        </a>
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleBet(true)}
                    disabled={!isConnected || isBetting || isConfirmingBet}
                    className="w-full py-2 md:py-3 bg-green-400 text-gray-900 font-bold rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Bet YES
                  </button>
                  <button
                    onClick={() => handleBet(false)}
                    disabled={!isConnected || isBetting || isConfirmingBet}
                    className="w-full py-2 md:py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Bet NO
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-6">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Your Position in this Market</h3>
            <div className="text-gray-300">
              {totalUserBet > 0n ? (
                <p>
                  You have bet a total of{" "}
                  <span className="text-green-400 font-semibold">{formatEther(totalUserBet)} ETH</span>.
                </p>
              ) : (
                <p>You haven't placed any bets in this market yet.</p>
              )}
            </div>
          </div>

          {isOwner && !isResolved?.result && deadlinePassed && (
            <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-6 border border-yellow-400">
              <h3 className="text-lg md:text-xl font-semibold text-yellow-400 mb-4 flex items-center">
                <Award className="mr-2" /> Owner Admin Panel
              </h3>
              <p className="text-sm md:text-base text-gray-400 mb-4">The deadline has passed. Please resolve the market.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleResolve(true)}
                  disabled={isResolving || isConfirmingResolve}
                  className="w-full py-2 md:py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  Resolve as YES
                </button>
                <button
                  onClick={() => handleResolve(false)}
                  disabled={isResolving || isConfirmingResolve}
                  className="w-full py-2 md:py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  Resolve as NO
                </button>
              </div>
              <div className="h-5 mt-2 text-sm md:text-base text-center">
                {isResolving && <p className="text-yellow-400">Waiting for confirmation...</p>}
                {isConfirmingResolve && <p className="text-blue-400">Resolving market...</p>}
                {isResolveConfirmed && <p className="text-green-400">Market resolved successfully!</p>}
              </div>
            </div>
          )}

          {didUserWin && !hasWithdrawn && (
            <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-6 border border-green-400">
              <h3 className="text-lg md:text-xl font-semibold text-green-400 mb-4 flex items-center">
                <CheckCircle className="mr-2" /> Congratulations, You Won!
              </h3>
              <p className="text-sm md:text-base text-gray-400 mb-4">The market has been resolved in your favor. You can now withdraw your winnings.</p>
              <button
                onClick={handleWithdraw}
                disabled={isWithdrawing || isConfirmingWithdraw}
                className="w-full py-2 md:py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {isWithdrawing ? "Waiting for confirmation..." : isConfirmingWithdraw ? "Withdrawing..." : "Withdraw Payout"}
              </button>
              {isWithdrawConfirmed && <p className="text-center mt-2 text-green-400">Withdrawal Successful!</p>}
            </div>
          )}
        </div>
        <div className={`w-full lg:w-96 ${!isChatOpen ? "hidden lg:block" : ""}`}>
          <div className="bg-gray-800 rounded-lg h-[500px] md:h-[600px] lg:h-[700px] flex flex-col">
            <div className="p-3 md:p-4 border-b border-gray-600 flex justify-between items-center">
              <h3 className="text-lg md:text-xl font-semibold text-white">Market Chat</h3>
              <button
                onClick={fetchCasts}
                className="text-gray-400 hover:text-white"
                title="Refresh Chat"
              >
                <RefreshCw size={16} className={isChatLoading ? "animate-spin" : ""} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 md:p-3">
              {isChatLoading && <p className="p-2 md:p-3 text-center text-gray-400">Loading chat...</p>}
              {!isChatLoading && casts.length === 0 && <p className="p-2 md:p-3 text-center text-gray-400">Be the first one to chat!</p>}
              {casts.map((cast) => (
                <ChatMessage key={cast.hash} cast={cast} />
              ))}
            </div>
            <div className="p-3 md:p-4 border-t border-gray-600">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-2 md:px-3 py-1 md:py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="px-2 md:px-3 py-1 md:py-2 bg-green-400 text-gray-900 rounded-lg hover:bg-green-500 transition-colors"
                  title="Post on Warpcast"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-2 text-center">This will open Warpcast to post your message.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}