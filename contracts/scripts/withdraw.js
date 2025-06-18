// scripts/withdraw.js
const { ethers } = require("hardhat");
const marketAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // <-- Apna address yahan daalo

async function main() {
  const market = await ethers.getContractAt("BettingMarket", marketAddress);
  const tx = await market.withdrawPayout();
  console.log("Withdrawing payout... Tx hash:", tx.hash);
  await tx.wait();
  console.log("Payout withdrawn!");
}
main().catch(console.error);
