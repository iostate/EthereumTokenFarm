/**
 * Tested via TokenFarm.test.js
 */
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(callback) {
  let tokenFarm = await TokenFarm.deployed();
  await tokenFarm.issueTokens(); // loop over all stakers and issue tokens

  // Code goes here..
  console.log("Tokens issued!");

  callback();
};
