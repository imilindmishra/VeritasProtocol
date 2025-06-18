// frontend/lib/contracts.ts
import { bettingMarketABI } from './BettingMarket.abi';
// MarketFactory ka ABI bhi import karna padega
import { marketFactoryABI } from './MarketFactort.abi';

// Isko BettingMarket.sol se rename karke BettingMarketInterface kar dete hain
export const bettingMarketInterface = {
  abi: bettingMarketABI,
};

// Naya MarketFactory config object
export const marketFactoryConfig = {
  address: '0x017497F473e6D81CFf99C23957402b7Cc6De80F9', // <-- APNA FACTORY ADDRESS YAHAN PASTE KARO
  abi: marketFactoryABI,
} as const;