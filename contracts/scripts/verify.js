// File: scripts/verify.js
async function main() {
  const marketAddress = "0x0c47D57113F74D4dd4c46ED35D932FFBdF804C36"; // Replace with actual address
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
