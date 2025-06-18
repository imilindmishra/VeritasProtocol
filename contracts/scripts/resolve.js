// scripts/resolve.js
const { ethers } = require("hardhat");
const marketAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // <-- Apna address yahan daalo

async function main() {
  const market = await ethers.getContractAt("BettingMarket", marketAddress);
  // 'true' ka matlab hai YES jeeta, 'false' ka matlab hai NO jeeta
  const tx = await market.resolveMarket(true);
  console.log("Resolving market... Tx hash:", tx.hash);
  await tx.wait();
  console.log("Market resolved!");
}
main().catch(console.error);
