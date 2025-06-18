async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying MarketFactory with the account:", deployer.address);

  const MarketFactory = await ethers.getContractFactory("MarketFactory");
  const factory = await MarketFactory.deploy();

  await factory.waitForDeployment();

  const address = await factory.getAddress();
  console.log("MarketFactory deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
