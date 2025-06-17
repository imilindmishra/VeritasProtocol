import MarketCard from "./components/MarketCard"

const mockMarkets = [
  {
    id: "1",
    question: "Will BTC hit $100K by Q4 2025?",
    volume: "Volume: 15.3 ETH",
    endsIn: "Closes in: 21 days",
  },
  {
    id: "2",
    question: "Will Ethereum 2.0 staking rewards exceed 8% APY this year?",
    volume: "Volume: 8.7 ETH",
    endsIn: "Closes in: 45 days",
  },
  {
    id: "3",
    question: "Will a new AI model surpass GPT-4 by end of 2024?",
    volume: "Volume: 22.1 ETH",
    endsIn: "Closes in: 12 days",
  },
  {
    id: "4",
    question: "Will Tesla stock price exceed $300 by March 2024?",
    volume: "Volume: 11.9 ETH",
    endsIn: "Closes in: 67 days",
  },
  {
    id: "5",
    question: "Will the next iPhone feature a foldable display?",
    volume: "Volume: 6.4 ETH",
    endsIn: "Closes in: 89 days",
  },
  {
    id: "6",
    question: "Will SpaceX successfully land humans on Mars by 2030?",
    volume: "Volume: 31.2 ETH",
    endsIn: "Closes in: 156 days",
  },
]

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Active Markets</h1>
        <p className="text-gray-400">Discover and bet on the future</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMarkets.map((market) => (
          <MarketCard
            key={market.id}
            id={market.id}
            question={market.question}
            volume={market.volume}
            endsIn={market.endsIn}
          />
        ))}
      </div>
    </div>
  )
}
