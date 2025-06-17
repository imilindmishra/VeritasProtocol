import { Trophy, Target, TrendingUp } from "lucide-react"

const userBets = [
  {
    id: "1",
    question: "Will BTC hit $100K by Q4 2025?",
    bet: "0.5 ETH on YES",
    status: "Active",
    statusColor: "bg-yellow-500",
  },
  {
    id: "2",
    question: "Will Ethereum 2.0 staking rewards exceed 8% APY this year?",
    bet: "0.2 ETH on NO",
    status: "Won",
    statusColor: "bg-neon-green",
  },
  {
    id: "3",
    question: "Will a new AI model surpass GPT-4 by end of 2024?",
    bet: "1.0 ETH on YES",
    status: "Active",
    statusColor: "bg-yellow-500",
  },
  {
    id: "4",
    question: "Will Tesla stock price exceed $300 by March 2024?",
    bet: "0.3 ETH on NO",
    status: "Lost",
    statusColor: "bg-red-500",
  },
]

export default function MyBetsPage() {
  const totalBets = userBets.length
  const activeBets = userBets.filter((bet) => bet.status === "Active").length
  const wonBets = userBets.filter((bet) => bet.status === "Won").length
  const winRate = totalBets > 0 ? Math.round((wonBets / totalBets) * 100) : 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* User Profile Summary */}
      <div className="bg-charcoal rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">My Betting Profile</h1>
            <p className="text-gray-400 font-mono">0x1234...abcd</p>
          </div>

          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <div className="bg-gradient-to-r from-neon-green to-electric-purple p-2 rounded-lg">
              <Trophy className="text-navy-dark" size={20} />
            </div>
            <span className="text-neon-green font-semibold">Top 10% Bettor</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-green">{totalBets}</div>
            <div className="text-sm text-gray-400">Total Bets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-electric-purple">{activeBets}</div>
            <div className="text-sm text-gray-400">Active Bets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{winRate}%</div>
            <div className="text-sm text-gray-400">Win Rate</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300 flex items-center">
              <Target size={16} className="mr-2 text-neon-green" />
              Markets Joined: {totalBets}/20
            </span>
            <span className="text-sm text-gray-400">{Math.round((totalBets / 20) * 100)}%</span>
          </div>
          <div className="w-full bg-navy-dark rounded-full h-3">
            <div
              className="bg-gradient-to-r from-neon-green to-electric-purple h-3 rounded-full transition-all duration-500"
              style={{ width: `${(totalBets / 20) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Bets List */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="text-neon-green" size={24} />
          <h2 className="text-xl font-semibold text-white">My Bets</h2>
        </div>

        {userBets.map((bet) => (
          <div key={bet.id} className="bg-charcoal rounded-xl p-6 card-glow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1 mb-4 md:mb-0">
                <h3 className="text-lg font-semibold text-white mb-2">{bet.question}</h3>
                <p className="text-gray-300">
                  <span className="font-semibold text-neon-green">{bet.bet}</span>
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${bet.statusColor}`}>
                  {bet.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {userBets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Target size={48} className="mx-auto mb-4" />
            <p className="text-lg">No bets placed yet</p>
            <p className="text-sm">Start betting on markets to see your positions here</p>
          </div>
        </div>
      )}
    </div>
  )
}
