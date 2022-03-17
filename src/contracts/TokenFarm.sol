pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    // All code goes here...
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    // Array of addresses that have staked
    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;

    // pass in addresses
    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
    }

    // 1. Stakes Tokens (Deposit)
    function stakeTokens(uint256 _amount) public {
        // ERC20 token function
        // Transfer Mock Dai tokens to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        // Use stakingBalance mapping to do this
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
        // Add users to stakers array *only* if they haven't staked already
        // Use an if statement here - Otherwise it would be
        // possible for people to be added multiple times to the array
        // Could use a modifier here instead of an if statement

        // If the user has *not* staked, then add them to the stakers array
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update staking status
        hasStaked[msg.sender] = true;
    }
    // 2. Unstaking Tokens (Withdraw)

    // 3. Issuing Tokens
}
