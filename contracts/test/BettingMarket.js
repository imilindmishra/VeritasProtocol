// File: test/BettingMarket.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BettingMarket", function () {
  let BettingMarket, market, owner, user1, user2;
  const question = "Will BTC hit $100K?";
  const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

  beforeEach(async function () {
    BettingMarket = await ethers.getContractFactory("BettingMarket");
    [owner, user1, user2] = await ethers.getSigners();
    market = await BettingMarket.deploy(question, deadline);
  });

  it("should allow bet placement", async function () {
    await market
      .connect(user1)
      .placeBet(true, { value: ethers.parseEther("1") });
    expect(await market.bets(user1.address)).to.equal(ethers.parseEther("1"));
    expect(await market.totalBets(true)).to.equal(ethers.parseEther("1"));
  });

  it("should prevent bets after deadline", async function () {
    await ethers.provider.send("evm_increaseTime", [3601]); // Fast forward past deadline
    await expect(
      market.connect(user1).placeBet(true, { value: ethers.parseEther("1") })
    ).to.be.revertedWith("Market closed");
  });
});
