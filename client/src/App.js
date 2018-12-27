import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import ipfs from "./ipfs";

import "./App.css";

class App extends Component {
  state = { web3: null, account: null, contract: null, buffer: null, ipfsHash: '', status: '' };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // For debugging purposes
      console.log(accounts);

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log(networkId);
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, account: accounts[0], contract: instance });
      this.runExample();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { contract } = this.state;

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ ipfsHash: response });
  };

  handleSubmit = async e => {
      e.preventDefault();
      const { account, contract } = this.state;
      this.setState({ status: 'Uploading to ipfs' });
      //Upload image to ipfs
      ipfs.files.add(this.state.buffer, async (error, result) => {
          if(error){
              console.error(error);
              return;
          }
          this.setState({ status: 'Uploading to blockchain' });
          // Stores a given ipfsHash to contract
          await contract.methods.set(result[0].hash).send({ from: account });
          // Stores the ipfs hash to state
          this.setState({ ipfsHash: await contract.methods.get().call() });
          this.setState({ status: 'Transaction Successful' });
      });
  };

  captureFile = e => {
      e.preventDefault();
      const file = e.target.files[0];
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
          this.setState({buffer: Buffer(reader.result)});
      }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    var url;
    if(this.state.ipfsHash){
        url = `https://ipfs.io/ipfs/${this.state.ipfsHash}`;
    }
    return (
      <div className="App">
        <h1>Your Image</h1>
        <p>This image is stored on IPFS & the Ethereum Blockchain!</p>
        <img src={url} alt="Stored on IPFS & the Ethereum Blockchain"/>
        <h2>Upload Image</h2>
        <form onSubmit={this.handleSubmit}>
            <input type="file" onChange={this.captureFile} />
            <input type="submit" />
        </form>
        <h5>{this.state.status}</h5>
      </div>
    );
  }
}

export default App;
