// File: frontend/app/chats/page.tsx
"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Send, Menu, X } from "lucide-react"
import { formatEther, parseEther } from 'viem'
import { useAccount, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

import DonutChart from "../components/DonutChart"
import ChatMessage from "../components/ChatMessage"
import { bettingMarketConfig } from "@/lib/contracts"

// Chat messages abhi bhi mock hain. Inko hum Farcaster se baadme integrate karenge.
const mockMessages = [
  // ... (tumhara mockMessages ka array yahan paste kar sakte ho)
]

export default function ChatsPage() {
  // --- Basic Hooks Setup ---
  const searchParams = useSearchParams()
  const marketId = searchParams.get("market") as `0x${string}` | undefined
  const { address: userAddress, isConnected } = useAccount()

  const [betAmount, setBetAmount] = useState("")
  const [chatMessage, setChatMessage] = useState("")
  const [isChatOpen, setIsChatOpen] = useState(false)

  // --- Contract Interaction Hooks ---
  const { data: contractData, isLoading: isReadingContract } = useReadContracts({
    contracts: [
      { ...bettingMarketConfig, address: marketId, functionName: 'question' },
      { ...bettingMarketConfig, address: marketId, functionName: 'totalBets', args: [true] },
      { ...bettingMarketConfig, address: marketId, functionName: 'totalBets', args: [false] },
      { ...bettingMarketConfig, address: marketId, functionName: 'bets', args: [userAddress!] },
    ],
    query: {
        // Yeh query tabhi run hogi jab marketId aur userAddress available ho
        enabled: !!marketId && !!userAddress, 
    }
  })
  
  const { data: hash, isPending, writeContract } = useWriteContract()

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })


  // --- Data Processing ---
  const [question, totalYes, totalNo, userBetOnYes] = contractData || []
  
  const totalYesBets = totalYes?.result ?? BigInt(0)
  const totalNoBets = totalNo?.result ?? BigInt(0)
  const totalVolume = totalYesBets + totalNoBets

  let yesPercentage = 50;
  let noPercentage = 50;

  if (totalVolume > BigInt(0)) {
    yesPercentage = Math.round(Number(totalYesBets * BigInt(100) / totalVolume))
    noPercentage = 100 - yesPercentage
  }

  // --- Event Handlers ---
  const handleBet = (choice: boolean) => {
    if (!betAmount || parseFloat(betAmount) <= 0) {
        alert("Please enter a valid bet amount.");
        return;
    }
    const betAmountInWei = parseEther(betAmount);
    
    writeContract({
        ...bettingMarketConfig,
        address: marketId!,
        functionName: 'placeBet',
        args: [choice],
        value: betAmountInWei,
    })
  }

  const handleSendMessage = () => {
    // Farcaster logic yahan aayega
    if (!chatMessage.trim()) return
    alert(`Message sent: ${chatMessage}`)
    setChatMessage("")
  }

  // --- UI Loading/Error States ---
  if (!marketId) {
    return <div className="text-center py-10">Market ID not found in URL.</div>
  }
  if (isReadingContract) {
    return <div className="text-center py-10">Loading market details...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile Chat Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-charcoal rounded-lg text-neon-green"
        >
          {isChatOpen ? <X size={20} /> : <Menu size={20} />}
          <span>{isChatOpen ? "Hide Chat" : "Show Chat"}</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Market Details */}
        <div className={`flex-1 ${isChatOpen ? "hidden lg:block" : ""}`}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{question?.result as string}</h1>
            <p className="text-gray-400 text-sm font-mono break-all">Market ID: {marketId}</p>
          </div>

          <div className="bg-charcoal rounded-xl p-8 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">Current Odds</h2>
            <DonutChart yesPercentage={yesPercentage} noPercentage={noPercentage} />
          </div>

          <div className="bg-charcoal rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Place Your Bet</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Bet Amount (ETH)</label>
              <div className="relative">
                <input
                  type="number" value={betAmount} onChange={(e) => setBetAmount(e.target.value)}
                  placeholder="0.0" disabled={isPending || isConfirming}
                  className="w-full px-4 py-3 bg-navy-dark border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-neon-green focus:outline-none disabled:opacity-50"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">Ξ</div>
              </div>
              {isPending && <div className="text-yellow-400 text-sm mt-2">Waiting for wallet confirmation...</div>}
              {isConfirming && <div className="text-blue-400 text-sm mt-2">Placing your bet on the blockchain...</div>}
              {hash && <div className="text-green-400 text-sm mt-2">Bet submitted! Tx: <a href={`https://sepolia-optimism.etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="underline">{hash.slice(0,10)}...</a></div>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => handleBet(true)} disabled={!isConnected || isPending || isConfirming}
                className="py-4 bg-neon-green text-navy-dark font-bold rounded-lg glow-button hover:bg-neon-green/90 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Bet YES
              </button>
              <button onClick={() => handleBet(false)} disabled={!isConnected || isPending || isConfirming}
                className="py-4 bg-electric-purple text-white font-bold rounded-lg glow-button-purple hover:bg-electric-purple/90 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Bet NO
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Chat Sidebar */}
        <div className={`w-full lg:w-80 ${!isChatOpen ? "hidden lg:block" : ""}`}>
           {/* Isme abhi koi change nahi, ye Farcaster ke time pe update hoga */}
        </div>
      </div>
    </div>
  )
}