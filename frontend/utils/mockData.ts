// File: utils/mockData.ts
export const mockMarkets = [
  {
    id: 1,
    question: "Will BTC hit $100K by Q4 2025?",
    odds: { yes: 60, no: 40 },
    volume: "2.4 ETH",
    endDate: "Dec 31",
  },
  {
    id: 2,
    question: "Will ETH surpass $5K?",
    odds: { yes: 45, no: 55 },
    volume: "1.8 ETH",
    endDate: "Mar 31",
  },
  {
    id: 3,
    question: "Will Tesla stock reach $300 this year?",
    odds: { yes: 35, no: 65 },
    volume: "3.2 ETH",
    endDate: "Jan 31",
  },
  {
    id: 4,
    question: "Will AI replace 50% of jobs by 2030?",
    odds: { yes: 25, no: 75 },
    volume: "0.9 ETH",
    endDate: "Sep 15",
  },
];

export const mockChats = [
  { id: 1, marketId: 1, sender: "User1", message: "I bet Yes!", badge: "Top Bettor" },
  { id: 2, marketId: 1, sender: "User2", message: "No way, too risky!", badge: "Newbie" },
  { id: 3, marketId: 1, sender: "CryptoKing", message: "BTC to the moon! 🚀", badge: "Diamond Hands" },
  { id: 4, marketId: 2, sender: "EthMaxi", message: "ETH will flip BTC first", badge: "Analyst" },
  { id: 5, marketId: 2, sender: "Trader123", message: "Looking at the charts...", badge: "Technical" },
];

export const mockBets = [
  { id: 1, question: "Will BTC hit $100K?", outcome: "Yes", wager: "1 ETH", status: "Active" },
  { id: 2, question: "Will ETH surpass $5K?", outcome: "No", wager: "0.5 ETH", status: "Won" },
  { id: 3, question: "Will Tesla stock reach $300?", outcome: "Yes", wager: "0.3 ETH", status: "Lost" },
  { id: 4, question: "Will AI replace 50% of jobs?", outcome: "No", wager: "0.8 ETH", status: "Active" },
];

export const user = { marketsJoined: 3, totalWinnings: "2.5 ETH" };