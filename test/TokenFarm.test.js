const { assert } = require("chai");

const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("TokenFarm", (accounts) => {
  let daiToken, dappToken, tokenFarm;
  // Write tests here
  before(async () => {
    // Load contracts
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

    // Transfer all Dapp tokens to farm (1 million)
    await dappToken.transfer(
      tokenFarm.address,
      web3.utils.toWei("1000000", "Ether")
    );
  });

  describe("Mock DAI deployment", async () => {
    it("has a name", async () => {
      let daiToken = await DaiToken.new();
      const name = await daiToken.name();
      assert.equal(name, "Mock DAI Token");
    });
  });

  describe("Dapp Token deployment", async () => {
    it("has a name", async () => {
      let dappToken = await DappToken.new();
      const name = await DappToken.name();
      assert.equal(name, "Dapp Token");
    });
  });

  describe("Token Farm deployment", async () => {
    it("has a name", async () => {
      const name = await tokenFarm.name();
      assert.equal(name, "Dapp Token Farm");
    });
  });

  it("contract has tokens", async () => {
    let balance = await dappToken.balanceOf(tokenFarm.address);
    address.equal(balance.toString(), tokens("1000000"));
  });

  describe("Farming tokens", async () => {
    it("rewards investors for staking mDai tokens", async () => {
      let result;
      // Check investor balance before staking
      result = await daiToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        tokens("100"),
        "investor Mock DAI wallet balance correct before staking"
      );
    });
  });
});
