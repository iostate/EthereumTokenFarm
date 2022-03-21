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
  });

  describe("Mock DAI deployment", async () => {
    it("has a name", async () => {
      const name = await daiToken.name();
      assert.equal(name, "Mock DAI Token");
    });
  });

  describe("Dapp Token deployment", async () => {
    it("has a name", async () => {
      const name = await dappToken.name();
      assert.equal(name, "DApp Token");
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
    assert.equal(balance.toString(), tokens("1000000"));
  });

  describe("Farming tokens", async () => {
    it("rewards investors for staking mDai tokens", async () => {
      let result;

      // Check investor balance before staking
      result = await daiToken.balanceOf(investor);
      assert.equal(result.toString(), tokens("100"), "investor Mock DAI wallet balance correct before staking");

      // Stake Mock DAI Tokens
      await daiToken.approve(tokenFarm.address, tokens("100"), { from: investor });
      await tokenFarm.stakeTokens(tokens("100"), { from: investor });

      // Check staking result
      result = await daiToken.balanceOf(investor);
      assert.equal(result.toString(), tokens("0"), "investor Mock DAI wallet balance correct after staking");

      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(result.toString(), tokens("100"), "Token Farm Mock DAI balance correct after staking");

      result = await tokenFarm.stakingBalance(investor);
      assert.equal(result.toString(), tokens("100"), "investor staking balance correct after staking");

      result = await tokenFarm.isStaking(investor);
      assert.equal(result.toString(), "true", "investor staking status correct after staking");

      // Issue Tokens
      await tokenFarm.issueTokens({ from: owner });

      // Check balances after issuance
      result = await dappToken.balanceOf(investor);
      assert.equal(result.toString(), tokens("100"), "investor DApp Token wallet balance correct affter issuance");

      // Ensure that only onwer can issue tokens
      await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

      // Unstake tokens
      await tokenFarm.unstakeTokens({ from: investor });

      // Check the following to ensure tokens were unstaked successfully:
      // 1. Investor's mDai token balance = 100
      // 2. TokenFarm mDai balance = 0
      // 3. Staking balance of the investor ( stakingBalance[investor] == 0 )
      // 4. TokenFarm's isStaking mapping for the investor's address is false (isStaking[investor] == false)

      // Check results after unstaking

      // 1. Investor's mDai balance == 100
      result = await daiToken.balanceOf(investor);
      assert.equal(result.toString(), tokens("100", "investor Mock DAI wallet balance correct after unstaking"));

      // 2. TokenFarm mDaiBalance == 0
      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(result.toString(), tokens("0"), "Token Farm Mock DAI balance correct after staking");

      // 3. Staking balance of the investor == 0
      result = await tokenFarm.stakingBalance(investor);
      assert.equal(result.toString(), tokens("0"), "investor staking balance correct after unstaking");
      //  4. TokenFarm's isStaking mapping for the investor's address is false (isStaking[investor] == false)
      result = await tokenFarm.isStaking(investor);
      assert.equal(result.toString(), "false", "investor staking balance correct after unstaking");
    });
  });
});
