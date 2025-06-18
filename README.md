# Veritas Protocol: Decentralized Social Betting Platform

![Veritas Protocol Banner](https://placehold.co/1200x400/1A2238/39FF14?text=Veritas+Protocol)

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white" alt="Solidity">
  <img src="https://img.shields.io/badge/Hardhat-222?style=for-the-badge&logo=hardhat&logoColor=white" alt="Hardhat">
  <img src="https://img.shields.io/badge/Farcaster-855DCD?style=for-the-badge&logo=farcaster&logoColor=white" alt="Farcaster">
  <img src="https://img.shields.io/badge/IPFS-65C2CB?style=for-the-badge&logo=ipfs&logoColor=white" alt="IPFS">
  <img src="https://img.shields.io/badge/Optimism-FF0420?style=for-the-badge&logo=optimism&logoColor=white" alt="Optimism">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
</p>

---

## 🚀 Overview

**Veritas Protocol** is a fully decentralized group chat and prediction market platform built on the Optimism Layer 2 network. It enables users to create and participate in prediction markets for any event, discuss outcomes in a live decentralized chat, and place bets using real cryptocurrency.

The platform leverages a robust, decentralized tech stack to ensure transparency, security, and user autonomy. Smart contracts handle all betting logic, Farcaster powers the decentralized chat, and IPFS stores market metadata, creating a truly Web3-native experience.

## ✨ Key Features

-   **Dynamic Market Creation:** Any user can create a new prediction market for any question with a specific deadline.
-   **IPFS Metadata Storage:** Market details like descriptions and rules are stored decentrally on IPFS via Pinata for immutability and censorship resistance.
-   **On-Chain Betting:** Place bets on binary (Yes/No) outcomes using ETH. All wagers and odds are managed transparently by smart contracts on the Optimism network.
-   **Live Decentralized Chat:** Every market has its own dedicated chat room powered by the Farcaster protocol, allowing for real-time discussion and debate.
-   **Admin & Payout UI:** Market creators can resolve the market's final outcome through the UI, and winning bettors can withdraw their earnings directly to their wallets.
-   **Dynamic 'My Bets' Page:** A personalized dashboard where users can track all their active and past bets across all markets.
-   **Modern, Gamified UI:** A responsive, dark-themed interface with neon accents, designed for a great user experience on both desktop and mobile.

## 🛠️ Tech Stack & Architecture

This project is a monorepo containing two main packages: `contracts` for the backend and `frontend` for the user interface.

### Backend (`/contracts`)

-   **Blockchain:** Optimism (Sepolia Testnet)
-   **Smart Contracts:** Solidity
-   **Development Environment:** Hardhat
-   **Core Libraries:** Ethers.js, OpenZeppelin Contracts

### Frontend (`/frontend`)

-   **Framework:** Next.js 14 (App Router)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **Wallet Integration:** `wagmi` & `viem`
-   **Decentralized Chat:** Farcaster (via Neynar SDK and API Routes)
-   **Decentralized Storage:** IPFS (via Pinata SDK and API Routes)
-   **State Management:** Zustand
-   **Deployment:** Vercel

### Architecture

-   **Factory Pattern:** A `MarketFactory.sol` contract is used to deploy new `BettingMarket.sol` instances, allowing for the creation of multiple, isolated markets.
-   **API Routes for Security:** All interactions with third-party services requiring secret keys (like Neynar and Pinata) are handled through secure Next.js API Routes, ensuring no secret keys are exposed on the client-side.
-   **Decentralized Identity & Chat:** Farcaster is used for social features. Instead of a complex, self-managed authentication system, the app uses the "Warpcast Intent" flow for posting messages, which is a simple and secure pattern.

## ⚙️ Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v20.x or higher recommended)
-   `pnpm` or `npm` as your package manager
-   A crypto wallet like [MetaMask](https://metamask.io/)
-   Test ETH on the [Optimism Sepolia network](https://faucet.quicknode.com/optimism/sepolia)

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name
```

### 2. Set Up the Backend (`/contracts`)

First, we need to compile and deploy the smart contracts.

```bash
# Navigate to the contracts directory
cd contracts

# Install dependencies
npm install

# Create the .env file
cp .env.example .env
```

Now, open the `.env` file and add your Infura API key and the private key of the wallet you'll use for deployment.

```dotenv
# contracts/.env
INFURA_API_KEY="YOUR_INFURA_API_KEY"
PRIVATE_KEY="YOUR_WALLET_PRIVATE_KEY"
```

Finally, deploy the `MarketFactory` contract:

```bash
npx hardhat run scripts/deploy.js --network optimismTestnet
```

**Save the deployed `MarketFactory` address printed in the console.** You will need it for the frontend setup.

### 3. Set Up the Frontend (`/frontend`)

Navigate to the frontend directory and set up the environment variables.

```bash
# Go back to the root and into the frontend directory
cd ../frontend

# Install dependencies
npm install

# Create the .env.local file
cp .env.local.example .env.local
```

Now, open `frontend/.env.local` and add all the required API keys.

```dotenv
# frontend/.env.local

# Get from [https://neynar.com/](https://neynar.com/)
NEYNAR_API_KEY="YOUR_NEYNAR_API_KEY"

# Get from [https://pinata.cloud/](https://pinata.cloud/)
PINATA_API_KEY="YOUR_PINATA_API_KEY"
PINATA_API_SECRET="YOUR_PINATA_API_SECRET"
```

Next, open `frontend/lib/contracts.ts` and paste the deployed `MarketFactory` address from the previous step.

```ts
// frontend/lib/contracts.ts
export const marketFactoryConfig = {
  address: 'YOUR_DEPLOYED_MARKET_FACTORY_ADDRESS_HERE',
  abi: marketFactoryABI,
} as const;
```

### 4. Run the Application

Now you are ready to run the app locally.

```bash
# From the /frontend directory
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application live!

## 🚀 Deployment

The frontend is configured for easy deployment on [Vercel](https://vercel.com/).

1.  Push your code to a GitHub repository.
2.  Import the repository on Vercel.
3.  Add the same environment variables (`NEYNAR_API_KEY`, `PINATA_API_KEY`, `PINATA_API_SECRET`) in the Vercel project settings.
4.  Click **Deploy**.

## 🔮 Future Enhancements

This project has a solid foundation, but there's always room to grow. Potential future features include:
-   **Arweave Integration:** Archive critical market data permanently on Arweave.
-   **Advanced Gamification:** Add leaderboards, achievement badges, and user profiles.
-   **Enhanced Odds Display:** Show historical odds charts.
-   **Multi-Outcome Markets:** Support markets with more than just two (Yes/No) outcomes.
-   **Oracle Integration:** Use a decentralized oracle like Chainlink or UMA for automated market resolution.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/your-repo-name/issues).

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
