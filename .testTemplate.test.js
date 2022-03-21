A general test in JavaScript looks like this: 
const { assert } = require("chai");

const DappToken = artifacts.require("DappToken");
require("chai")
  .use(require("chai-as-promised"))
  .should();
// Helper function 
function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("TokenFarm", ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm;
  // Write tests here
  before(async () => {
    // Load contracts
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);
    
    
    // Transfer all Dapp tokens to farm (1 million)
    await dappToken.transfer(tokenFarm.address, tokens("1000000"));
    // Send tokens to investor
    await daiToken.transfer(investor, tokens("100"), { from: owner });
    
    describe("Mock DAI deployment", async () => {
    it("has a name", async () => {
      const name = await daiToken.name();
      assert.equal(name, "Mock DAI Token");
    });
  });
  });
}); 