"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { user } from "@/utils/mockData"

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnected(true)
      setIsConnecting(false)
    }, 2000)
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#1A2238] to-black relative overflow-hidden">
      {/* Background Particles - Desktop Only */}
      <div className="hidden md:block absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle animate-drift"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Gamified Trophy - Top Right */}
      <div className="absolute top-8 right-8">
        <div className="w-16 h-16 bg-gradient-to-br from-[#39FF14] to-[#BF40BF] rounded-full flex items-center justify-center animate-spin-slow">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center px-4 max-w-4xl mx-auto">
        {/* Tagline with Animation */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="font-orbitron text-4xl md:text-5xl text-white mb-6 font-bold"
        >
          Bet, Chat, Win! Join the Decentralized Prediction Game
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="font-inter text-lg text-[#D3D3D3] mb-8"
        >
          Predict, discuss, and earn in real-time with Ethereum
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          className="mb-8"
        >
          <div className="w-64 mx-auto mb-2">
            <div className="flex justify-between text-sm text-[#D3D3D3] mb-1">
              <span>Markets Joined</span>
              <span>{user.marketsJoined}/10</span>
            </div>
            <div className="w-full h-2 bg-[#2C2F3A] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(user.marketsJoined / 10) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                className="h-full bg-[#39FF14] rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Connect Wallet Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
        >
          {isConnected ? (
            <div className="inline-flex items-center gap-3 bg-[#2C2F3A] border-2 border-[#39FF14] text-[#39FF14] font-inter text-lg px-8 py-3 rounded-lg">
              <div className="w-3 h-3 bg-[#39FF14] rounded-full animate-pulse-custom"></div>
              <span>0x1234...5678</span>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="bg-[#2C2F3A] border-2 border-[#39FF14] text-[#39FF14] font-inter text-lg px-8 py-3 md:px-8 md:py-3 px-6 py-2 rounded-lg hover:scale-110 hover:shadow-[0_0_10px_#39FF14] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-[#39FF14] border-t-transparent rounded-full animate-spin"></div>
                  Connecting...
                </div>
              ) : (
                "Connect Wallet"
              )}
            </button>
          )}
        </motion.div>
      </div>
    </div>
  )
}
