interface ChatMessageProps {
  avatar: string
  username: string
  message: string
  timestamp?: string
}

export default function ChatMessage({ avatar, username, message, timestamp }: ChatMessageProps) {
  return (
    <div className="flex space-x-3 p-3 hover:bg-navy-dark/50 rounded-lg transition-colors">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-neon-green to-electric-purple rounded-full flex items-center justify-center text-sm font-bold text-navy-dark">
          {avatar}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-neon-green">{username}</span>
          {timestamp && <span className="text-xs text-gray-500">{timestamp}</span>}
        </div>
        <p className="text-sm text-gray-300 mt-1 break-words">{message}</p>
      </div>
    </div>
  )
}
