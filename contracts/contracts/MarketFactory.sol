// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./BettingMarket.sol";

contract MarketFactory {
    address[] public deployedMarkets;

    event MarketCreated(
        address marketAddress,
        address owner,
        string question,
        uint256 deadline,
        string ipfsCID
    );

    function createMarket(
        string memory _question,
        uint256 _deadline,
        string memory _ipfsCID
    ) public {
        // Naya BettingMarket contract deploy karo
        BettingMarket newMarket = new BettingMarket(_question, _deadline, msg.sender, _ipfsCID);
        
        // Uske address ko array me store karo
        deployedMarkets.push(address(newMarket));

        // Event emit karo
        emit MarketCreated(address(newMarket), msg.sender, _question, _deadline, _ipfsCID);
    }

    function getDeployedMarkets() public view returns (address[] memory) {
        return deployedMarkets;
    }
}