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

    // Fetch Token Address
    // Gets the token address from the DaiToken.json network property.. 1337
    const daiTokenData = DaiToken.networks[networkId];
    console.log(daiTokenData);
    if (daiTokenData) {
      // Check out web3.eth.Contract docs.. Load abi as param and token address
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address);

      // What is the token address?
      console.log(`DAI Token Address: ${daiTokenData.address}`);

      this.setState({ daiToken }); // set App's state daiToken
      // When querying, use call()
      // https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#methods-mymethod-call
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call();
      this.setState({ daiTokenBalance: daiTokenBalance.toString() });

      console.log(`DAI Token Balance for {this.state.account}: `);
      console.log(web3.utils.fromWei(this.state.daiTokenBalance));
    } else {
      window.alert("DaiToken contract not deployed to detected network.");
    }
  }

  // load web3
  // added localhost:7545 to metamask
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
        <Navbar account={this.state.account} />
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
