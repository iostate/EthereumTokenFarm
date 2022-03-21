March 16 2022

Creating a token farm.

Tokens that will exist:
DaiToken
DappToken

Users will get DappTokens for their DaiTokens.

The users will then be able to stake their DappTokens in the TokenFarm.

Dependencies: 
- Ganache 
- Truffle
- Node 12.18.3 (recommend using NVM for this)

Goal:
Transfer all DappTokens to TokenFarm.
Investor account will be given 100 DaiTokens. 

Key Takeaways:
- web3.utils is a huge library. 
  - web3.utils.toWei() && web3.utils.fromWei() both use 'ether' as default unit 
  (After deployment) 
Initialize your accounts variable using:
- `truffle console`
- `accounts = await web3.eth.getAccounts()`
- investorAccount = accounts[1]

Initialize a certain deployed token using:
- `mDai = await DaiToken.deployed()`

Get the balance of a certain token for an account using, e.g. the investor account:
- `mDai.balanceOf(accounts[1])` 
  
  
Testing the following (test/TokenFarm.test.js):
- Staking tokens from the Token Farm
- Unstaking tokens from the Token Farm
- Issuing tokens to all holders of the DAI Token
