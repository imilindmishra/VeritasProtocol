"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import DonutChart from "../components/DonutChart"
import ChatMessage from "../components/ChatMessage"
import { Send, Menu, X } from "lucide-react"

const mockMessages = [
  {
    avatar: "V",
    username: "vbuterin.eth",
    message: "I think BTC will definitely hit 100K. The institutional adoption is accelerating.",
    timestamp: "2m ago",
  },
  {
    avatar: "S",
    username: "satoshi_fan",
    message: "Not so sure about that. The market is pretty volatile right now.",
    timestamp: "5m ago",
  },
  {
    avatar: "C",
    username: "crypto_whale",
    message: "Just placed a big bet on YES. LFG! 🚀",
    timestamp: "8m ago",
  },
  {
    avatar: "D",
    username: "defi_degen",
    message: "The technical analysis suggests we might see a correction first.",
    timestamp: "12m ago",
  },
  {
    avatar: "B",
    username: "btc_maxi",
    message: "Diamond hands! HODL until 100K! 💎🙌",
    timestamp: "15m ago",
  },
]

export default function ChatsPage() {
  const searchParams = useSearchParams()
  const marketId = searchParams.get("market") || "1"
  const [betAmount, setBetAmount] = useState("")
  const [chatMessage, setChatMessage] = useState("")
  const [isChatOpen, setIsChatOpen] = useState(false)

  const marketQuestion = "Will BTC hit $100K by Q4 2025?"
  const yesPercentage = 65
  const noPercentage = 35

  const handleBet = (side: "yes" | "no") => {
    if (!betAmount) return
    alert(`Placed ${betAmount} ETH bet on ${side.toUpperCase()}`)
    setBetAmount("")
  }

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return
    alert(`Message sent: ${chatMessage}`)
    setChatMessage("")
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
          {/* Market Question */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{marketQuestion}</h1>
            <p className="text-gray-400">Market ID: #{marketId}</p>
          </div>

          {/* Odds Visualization */}
          <div className="bg-charcoal rounded-xl p-8 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">Current Odds</h2>
            <DonutChart yesPercentage={yesPercentage} noPercentage={noPercentage} />
          </div>

          {/* Betting Interface */}
          <div className="bg-charcoal rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Place Your Bet</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Bet Amount (ETH)</label>
              <div className="relative">
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full px-4 py-3 bg-navy-dark border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-neon-green focus:outline-none"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">Ξ</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleBet("yes")}
                className="py-4 bg-neon-green text-navy-dark font-bold rounded-lg glow-button hover:bg-neon-green/90 text-lg"
              >
                Bet YES
              </button>
              <button
                onClick={() => handleBet("no")}
                className="py-4 bg-electric-purple text-white font-bold rounded-lg glow-button-purple hover:bg-electric-purple/90 text-lg"
              >
                Bet NO
              </button>
            </div>
          </div>

          {/* User's Current Bets */}
          <div className="bg-charcoal rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Your Position in this Market</h3>
            <div className="text-gray-300">
              <p>
                You bet <span className="text-neon-green font-semibold">0.5 ETH on YES</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">Potential return: 0.77 ETH</p>
            </div>
          </div>
        </div>

        {/* Right Column - Chat Sidebar */}
        <div className={`w-full lg:w-80 ${!isChatOpen ? "hidden lg:block" : ""}`}>
          <div className="bg-charcoal rounded-xl h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-600">
              <h3 className="text-lg font-semibold text-white">Market Chat</h3>
              <p className="text-sm text-gray-400">{mockMessages.length} participants</p>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-2">
              {mockMessages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  avatar={msg.avatar}
                  username={msg.username}
                  message={msg.message}
                  timestamp={msg.timestamp}
                />
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-600">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 bg-navy-dark border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-neon-green focus:outline-none text-sm"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="px-3 py-2 bg-neon-green text-navy-dark rounded-lg hover:bg-neon-green/90 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
