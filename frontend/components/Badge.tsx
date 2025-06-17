"use client"

import { motion } from "framer-motion"

interface BadgeProps {
  text: string
  variant?: "green" | "purple" | "gold"
}

export default function Badge({ text, variant = "green" }: BadgeProps) {
  const variants = {
    green: "bg-[#39FF14] text-black",
    purple: "bg-[#BF40BF] text-white",
    gold: "bg-yellow-400 text-black",
  }

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      className={`text-xs px-2 py-1 rounded-full font-bold ${variants[variant]}`}
    >
      {text}
    </motion.span>
  )
}
