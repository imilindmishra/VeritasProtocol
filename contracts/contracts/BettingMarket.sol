// File: contracts/BettingMarket.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract BettingMarket {
    address public owner;
    string public question;
    uint256 public deadline;
    bool public resolved;
    mapping(address => uint256) public bets;
    mapping(bool => uint256) public totalBets;
    bool public outcome;

    event BetPlaced(address indexed user, bool choice, uint256 amount);
    event MarketResolved(bool outcome);

    constructor(string memory _question, uint256 _deadline) {
        owner = msg.sender;
        question = _question;
        deadline = _deadline;
        resolved = false;
    }

    function placeBet(bool _choice) external payable {
        require(!resolved, "Market already resolved");
        require(block.timestamp < deadline, "Market closed");
        require(msg.value > 0, "Bet amount must be greater than 0");
        bets[msg.sender] += msg.value;
        totalBets[_choice] += msg.value;
        emit BetPlaced(msg.sender, _choice, msg.value);
    }

    function resolveMarket(bool _outcome) external {
        require(msg.sender == owner, "Only owner can resolve");
        require(block.timestamp >= deadline, "Market still open");
        require(!resolved, "Already resolved");
        resolved = true;
        outcome = _outcome;
        emit MarketResolved(_outcome);
    }

    function withdrawPayout() external {
        require(resolved, "Market not resolved");
        require(bets[msg.sender] > 0, "No bet placed");
        require(totalBets[outcome] > 0, "No winning bets");
        uint256 userBet = bets[msg.sender];
        uint256 payout = (userBet * totalBets[!outcome]) / totalBets[outcome];
        bets[msg.sender] = 0;
        payable(msg.sender).transfer(payout);
    }
}
