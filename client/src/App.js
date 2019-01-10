import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import ipfs from "./ipfs";
import { encrypt, decrypt } from './encryption';
import "./App.css";
import FolderList from './components/FolderList';

class App extends Component {
  // Here the password needs to be a 32byte and iv needs to be 16byte only
  // Have currently kept a default generic password which is useless but rather
  // only for demonstration purposes which currently cannot be changed
  state = { web3: null,
      account: null,
      contract: null,
      buffer: null,
      ipfsHash: '',
      status: '',
      image: '',
      totalHashes: 0,
      hashArray: [],
      password: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      iv: 'aaaaaaaaaaaaaaaa'
  };

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
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, account: accounts[0], contract: instance });
      let totalHashes = await this.state.contract.methods.totalHashes().call();
      this.setState({ totalHashes });
      this.getAllHashValues();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  getAllHashValues = async () => {
      let hashArray = [];
      for(let i=this.state.totalHashes-1; i>=0; i--){
          let newHash = await this.state.contract.methods.getHash(i).call();
          hashArray.push(newHash);
      }
      this.setState({ hashArray });
  }

  render() {
    return (
      <div className="App">
        <h1>Your Images</h1>
        <FolderList hashArray={this.state.hashArray} totalHashes={this.state.totalHashes} />
      </div>
    );
  }
}

export default App;
