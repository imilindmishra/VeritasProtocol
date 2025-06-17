"use client"

import { motion } from "framer-motion"

interface Market {
  id: number
  question: string
  odds: { yes: number; no: number }
  volume: string
  endDate: string
}

interface MarketCardProps {
  market: Market
  isSelected: boolean
  onClick: () => void
}

export default function MarketCard({ market, isSelected, onClick }: MarketCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:translate-y-[-4px] ${
        isSelected
          ? "bg-[#BF40BF]/20 border-[#BF40BF] shadow-[0_0_8px_#BF40BF]"
          : "bg-[#2C2F3A] border-[#BF40BF]/30 hover:border-[#BF40BF] hover:shadow-[0_0_8px_#BF40BF]"
      }`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <h3 className="font-medium text-white mb-2 line-clamp-2">{market.question}</h3>

      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-2">
          <span className="text-xs bg-[#39FF14]/20 text-[#39FF14] px-2 py-1 rounded">Yes: {market.odds.yes}%</span>
          <span className="text-xs bg-[#BF40BF]/20 text-[#BF40BF] px-2 py-1 rounded">No: {market.odds.no}%</span>
        </div>
      </div>

      <div className="flex justify-between text-xs text-[#D3D3D3]">
        <span>Volume: {market.volume}</span>
        <span>Ends: {market.endDate}</span>
      </div>
    </motion.div>
  )
}
