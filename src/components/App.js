/**
 * Front-end for our Token Farm.
 *
 * Token Farm will issue Dapp Tokens to all accounts that stake DAI Tokens.
 * For every 1 DAI Token staked to Token Farm, 1 Dapp Token will be issued.
 *
 * The front-end is from the investor's perspective.
 */

import React, { Component } from "react";
import Navbar from "./Navbar";
import DaiToken from "../abis/DaiToken.json";
import Web3 from "web3";

class App extends Component {
  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    this.setState({ account: accounts[0] });
    console.log(this.state.account);
    const networkId = await web3.eth.net.getId();
    console.log(networkId);

    // Accessing (DaiToken.json). Particularly the networks property.
    const daiTokenData = DaiToken.networks[networkId];
    console.log(daiTokenData);
    if (daiTokenData) {
      // Constructor parameters:
      // web3.eth.Contract(tokenAbi, tokenAddress)
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address);

      console.log(`DAI Token Address: ${daiTokenData.address}`);
      // set App's state daiToken
      this.setState({ daiToken });
      // https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#methods-mymethod-call
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call();
      this.setState({ daiTokenBalance: daiTokenBalance.toString() });

      console.log(`DAI Token Balance for {this.state.account} converted fromWei: `);
      console.log(web3.utils.fromWei(this.state.daiTokenBalance));
    } else {
      window.alert("DaiToken contract not deployed to detected network.");
    }
  }

  // Connect app to MetaMask with Web3
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-ethereum browser detected. Consider using MetaMask!");
    }
  }

  constructor(props) {
    super(props);
    // Contain all app data in the state
    this.state = {
      account: "0x0",
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: "0",
      dappTokenBalance: "0",
      stakingBalance: "0",
      loading: true,
    };
  }

  render() {
    return (
      <div>
        {/* Displays account address & Dai Token Balance */}
        <Navbar account={this.state.account} daiTokenBalance={this.state.daiTokenBalance} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: "600px" }}>
              <div className="content mr-auto ml-auto">
                <a href="http://www.dappuniversity.com/bootcamp" target="_blank" rel="noopener noreferrer"></a>

                <h1>Hello, World!</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
