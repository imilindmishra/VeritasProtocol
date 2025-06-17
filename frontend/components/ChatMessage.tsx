"use client"

import { motion } from "framer-motion"
import Badge from "./Badge"

interface Message {
  id: number
  sender: string
  message: string
  timestamp: Date
  badge?: string
}

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "You"

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-xs lg:max-w-md ${isUser ? "order-2" : "order-1"}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[#39FF14] text-sm font-medium">{message.sender}</span>
          {message.badge && <Badge text={message.badge} />}
        </div>

        <div
          className={`p-3 rounded-lg ${
            isUser ? "bg-[#BF40BF] text-white" : "bg-[#2C2F3A] text-white border border-[#BF40BF]/30"
          }`}
        >
          <p className="text-sm">{message.message}</p>
        </div>

        <div className="text-xs text-[#D3D3D3] mt-1">{message.timestamp.toLocaleTimeString()}</div>
      </div>
    </motion.div>
  )
}
