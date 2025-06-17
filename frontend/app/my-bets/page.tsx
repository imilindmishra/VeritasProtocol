"use client"

import { motion } from "framer-motion"
import { mockBets, user } from "@/utils/mockData"

export default function MyBetsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A2238] to-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-orbitron text-3xl text-[#39FF14] mb-6 text-center font-bold"
        >
          My Bets
        </motion.h1>

        {/* Gamified Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-64 mx-auto mb-2">
            <div className="flex justify-between text-sm text-[#D3D3D3] mb-1">
              <span>Total Winnings</span>
              <span>{user.totalWinnings}</span>
            </div>
            <div className="w-full h-2 bg-[#2C2F3A] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                className="h-full bg-[#39FF14] rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-3/4 mx-auto bg-[#2C2F3A] border-[#BF40BF] border rounded-lg p-4"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#BF40BF]">
                  <th className="text-left text-white font-inter text-base p-3">Market Question</th>
                  <th className="text-left text-white font-inter text-base p-3">Outcome</th>
                  <th className="text-left text-white font-inter text-base p-3">Wager</th>
                  <th className="text-left text-white font-inter text-base p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockBets.map((bet, index) => (
                  <motion.tr
                    key={bet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-[#1A2238] border-b border-[#BF40BF] hover:bg-[#39FF14]/10 transition-colors duration-200 animate-fade-in"
                  >
                    <td className="text-white font-inter text-base p-3">{bet.question}</td>
                    <td className="text-white font-inter text-base p-3">{bet.outcome}</td>
                    <td className="text-white font-inter text-base p-3">{bet.wager}</td>
                    <td className="text-white font-inter text-base p-3">
                      <div className="flex items-center gap-2">
                        {bet.status === "Active" && (
                          <div className="w-3 h-3 bg-[#39FF14] rounded-full animate-pulse-custom"></div>
                        )}
                        {bet.status === "Won" && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="bg-[#39FF14] text-[#1A2238] px-2 py-1 rounded-full text-xs font-bold"
                          >
                            Won
                          </motion.span>
                        )}
                        <span>{bet.status}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {mockBets.map((bet, index) => (
            <motion.div
              key={bet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-[#1A2238] border-[#BF40BF] border p-4 rounded-lg animate-fade-in"
            >
              <h3 className="text-white font-inter text-lg mb-2">{bet.question}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-[#D3D3D3]">Outcome:</span>
                  <div className="text-white">{bet.outcome}</div>
                </div>
                <div>
                  <span className="text-[#D3D3D3]">Wager:</span>
                  <div className="text-white">{bet.wager}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-[#D3D3D3]">Status:</span>
                  <div className="flex items-center gap-2 mt-1">
                    {bet.status === "Active" && (
                      <div className="w-3 h-3 bg-[#39FF14] rounded-full animate-pulse-custom"></div>
                    )}
                    {bet.status === "Won" && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-[#39FF14] text-[#1A2238] px-2 py-1 rounded-full text-xs font-bold"
                      >
                        Won
                      </motion.span>
                    )}
                    <span className="text-white">{bet.status}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
