// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BettingMarket {
    address public owner;
    string public question;
    string public ipfsCID; // IPFS Metadata ke liye
    uint256 public deadline;
    bool public resolved;
    bool public outcome;

    mapping(address => uint256) public betsOnYes;
    mapping(address => uint256) public betsOnNo;
    uint256 public totalBetsYes;
    uint256 public totalBetsNo;

    event BetPlaced(address indexed user, bool choice, uint256 amount);
    event MarketResolved(bool outcome);
    event PayoutWithdrawn(address indexed user, uint256 amount);

    // Constructor me ab '_owner' aur '_ipfsCID' bhi le rahe hain
    constructor(string memory _question, uint256 _deadline, address _owner, string memory _ipfsCID) {
        question = _question;
        deadline = _deadline;
        owner = _owner;
        ipfsCID = _ipfsCID;
        resolved = false;
    }

    function placeBet(bool _choice) external payable {
        require(!resolved, "Market already resolved");
        require(block.timestamp < deadline, "Market closed");
        require(msg.value > 0, "Bet amount must be > 0");

        if (_choice) { // Bet on YES
            betsOnYes[msg.sender] += msg.value;
            totalBetsYes += msg.value;
        } else { // Bet on NO
            betsOnNo[msg.sender] += msg.value;
            totalBetsNo += msg.value;
        }
        
        emit BetPlaced(msg.sender, _choice, msg.value);
    }

    function resolveMarket(bool _finalOutcome) external {
        require(msg.sender == owner, "Only owner can resolve");
        require(!resolved, "Market already resolved");
        require(block.timestamp >= deadline, "Market still open");
        
        resolved = true;
        outcome = _finalOutcome;
        emit MarketResolved(_finalOutcome);
    }

    function withdrawPayout() external {
        require(resolved, "Market not resolved");
        
        uint256 userBetAmount;
        bool userWon;

        if (outcome == true) { // YES won
            userBetAmount = betsOnYes[msg.sender];
            userWon = userBetAmount > 0;
        } else { // NO won
            userBetAmount = betsOnNo[msg.sender];
            userWon = userBetAmount > 0;
        }

        require(userWon, "You did not win or have no bets");

        uint256 totalWinningPool = outcome ? totalBetsYes : totalBetsNo;
        uint256 totalLosingPool = outcome ? totalBetsNo : totalBetsYes;
        
        require(totalWinningPool > 0, "No winning bets in the pool");

        uint256 payout = userBetAmount + (userBetAmount * totalLosingPool / totalWinningPool);
        
        if (outcome) {
            betsOnYes[msg.sender] = 0;
        } else {
            betsOnNo[msg.sender] = 0;
        }

        (bool success, ) = msg.sender.call{value: payout}("");
        require(success, "Payout failed");

        emit PayoutWithdrawn(msg.sender, payout);
    }
}