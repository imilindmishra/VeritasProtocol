// File: scripts/verify.js
async function main() {
  const marketAddress = "0x11BC4A9C06A89b979Eb430a22D9fCC2F4288a355"; 
  const market = await ethers.getContractAt("BettingMarket", marketAddress);

  console.log("Question:", await market.question());
  console.log("Deadline:", (await market.deadline()).toString());
  console.log("Resolved:", await market.resolved());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
