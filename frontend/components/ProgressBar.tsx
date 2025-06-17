"use client"

import { motion } from "framer-motion"

interface ProgressBarProps {
  progress: number
  label?: string
  color?: "green" | "purple"
}

export default function ProgressBar({ progress, label, color = "green" }: ProgressBarProps) {
  const colorClasses = {
    green: "bg-[#39FF14]",
    purple: "bg-[#BF40BF]",
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        {label && <span className="text-sm text-[#D3D3D3]">{label}</span>}
        <span className="text-sm font-bold text-white">{progress}%</span>
      </div>
      <div className="w-full bg-[#1A2238] rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${colorClasses[color]} rounded-full relative`}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </motion.div>
      </div>
    </div>
  )
}
