"use client"

import { motion } from "framer-motion"
import Badge from "./Badge"

interface Bet {
  id: number
  question: string
  outcome: string
  wager: string
  status: "Active" | "Won" | "Lost"
  payout?: string
  date: string
}

interface BetTableProps {
  bets: Bet[]
}

export default function BetTable({ bets }: BetTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Won":
        return <Badge text="Won" variant="green" />
      case "Lost":
        return <Badge text="Lost" variant="purple" />
      case "Active":
        return <Badge text="Active" variant="gold" />
      default:
        return null
    }
  }

  return (
    <div className="bg-[#2C2F3A]/50 backdrop-blur-sm rounded-xl border border-[#BF40BF]/30 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1A2238]/50">
            <tr>
              <th className="text-left p-4 font-orbitron text-[#39FF14]">Market Question</th>
              <th className="text-left p-4 font-orbitron text-[#39FF14]">Outcome</th>
              <th className="text-left p-4 font-orbitron text-[#39FF14]">Wager</th>
              <th className="text-left p-4 font-orbitron text-[#39FF14]">Status</th>
              <th className="text-left p-4 font-orbitron text-[#39FF14]">Payout</th>
              <th className="text-left p-4 font-orbitron text-[#39FF14]">Date</th>
            </tr>
          </thead>
          <tbody>
            {bets.map((bet, index) => (
              <motion.tr
                key={bet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-t border-[#BF40BF]/20 hover:bg-[#39FF14]/10 transition-colors duration-200 animate-fade-in"
              >
                <td className="p-4 text-white max-w-xs">
                  <div className="truncate">{bet.question}</div>
                </td>
                <td className="p-4">
                  <span className={`font-bold ${bet.outcome === "Yes" ? "text-[#39FF14]" : "text-[#BF40BF]"}`}>
                    {bet.outcome}
                  </span>
                </td>
                <td className="p-4 text-white font-mono">{bet.wager}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(bet.status)}
                    {bet.status === "Active" && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="w-2 h-2 bg-[#BF40BF] rounded-full"
                      />
                    )}
                  </div>
                </td>
                <td className="p-4">
                  {bet.payout ? (
                    <span className="text-[#39FF14] font-mono font-bold">{bet.payout}</span>
                  ) : (
                    <span className="text-[#D3D3D3]">-</span>
                  )}
                </td>
                <td className="p-4 text-[#D3D3D3] text-sm">{bet.date}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {bets.map((bet, index) => (
          <motion.div
            key={bet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#1A2238]/50 rounded-lg p-4 border border-[#BF40BF]/30"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-white font-medium text-sm line-clamp-2 flex-1 mr-2">{bet.question}</h3>
              {getStatusBadge(bet.status)}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-[#D3D3D3]">Outcome:</span>
                <div className={`font-bold ${bet.outcome === "Yes" ? "text-[#39FF14]" : "text-[#BF40BF]"}`}>
                  {bet.outcome}
                </div>
              </div>
              <div>
                <span className="text-[#D3D3D3]">Wager:</span>
                <div className="text-white font-mono">{bet.wager}</div>
              </div>
              <div>
                <span className="text-[#D3D3D3]">Payout:</span>
                <div className="text-[#39FF14] font-mono font-bold">{bet.payout || "-"}</div>
              </div>
              <div>
                <span className="text-[#D3D3D3]">Date:</span>
                <div className="text-white">{bet.date}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
