import Link from "next/link"
import { Clock, TrendingUp } from "lucide-react"

interface MarketCardProps {
  id: string
  question: string
  volume: string
  endsIn: string
}

export default function MarketCard({ id, question, volume, endsIn }: MarketCardProps) {
  return (
    <div className="bg-charcoal rounded-xl p-6 card-glow">
      <h3 className="text-lg font-semibold mb-4 text-white leading-tight">{question}</h3>

      <div className="space-y-3 mb-6">
        <div className="flex items-center text-gray-300">
          <TrendingUp size={16} className="mr-2 text-neon-green" />
          <span className="text-sm">{volume}</span>
        </div>

        <div className="flex items-center text-gray-300">
          <Clock size={16} className="mr-2 text-electric-purple" />
          <span className="text-sm">{endsIn}</span>
        </div>
      </div>

      <Link href={`/chats?market=${id}`}>
        <button className="w-full py-3 bg-neon-green text-navy-dark font-semibold rounded-lg glow-button hover:bg-neon-green/90">
          View Market
        </button>
      </Link>
    </div>
  )
}
