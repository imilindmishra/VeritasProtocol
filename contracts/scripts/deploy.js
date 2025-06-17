// File: scripts/deploy.js
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const BettingMarket = await ethers.getContractFactory("BettingMarket");
  const question = "Will BTC hit $100K by Q4 2025?";
  const deadline = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
  const market = await BettingMarket.deploy(question, deadline);
  await market.waitForDeployment(); // Wait for deployment

  const address = await market.getAddress(); // Get contract address
  console.log("BettingMarket deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
