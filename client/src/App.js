import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import ipfs from "./ipfs";
import { encrypt, decrypt } from './encryption';
import "./App.css";

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

    this.fetchData();
  };

  // Fetch data from url 'ipfs.io/ipfs/{ipfsHash}'
  // This first converts the recieved data into Uint8Array
  // then decrypts it to get original image
  fetchData = () => {
      fetch(`https://ipfs.io/ipfs/${this.state.ipfsHash}`)
          .then(res => {
              res.arrayBuffer()
                  .then(buffer => {
                      buffer = new Uint8Array(buffer);
                      let decrypted = decrypt(buffer, this.state.password, this.state.iv);
                      this.setState({ image: decrypted });
                  })
          });
  }

  // To convert selected file to Uint8Array format
  captureFile = e => {
      e.preventDefault();
      const file = e.target.files[0];
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
          this.setState({buffer: Buffer(reader.result)});
      }
  };

  // When the user clicks on submit it encrypts the file first then uploads to ipfs
  handleSubmit = async e => {
      e.preventDefault();
      this.setState({ status: 'Uploading to ipfs' });
      let encrypted = encrypt(this.state.buffer, this.state.password, this.state.iv);
      this.uploadFile(encrypted);
  };

  //Upload encrypted image to ipfs
  uploadFile = (encryptedData) => {
      const { account, contract } = this.state;
      ipfs.add(encryptedData, async (error, result) => {
          if(error){
              console.error(error);
              return;
          }
          this.setState({ status: 'Uploading to blockchain' });
          //For debugging
          console.log(result[0].hash);
          // Stores a given ipfsHash to contract
          await contract.methods.set(result[0].hash).send({ from: account });
          // Stores the ipfs hash to state
          this.setState({ ipfsHash: await contract.methods.get().call() });
          this.setState({ status: 'Transaction Successful. Image will be visible soon' });
          this.fetchData();
      });
  };

  render() {
    var image;
    if(this.state.image){
        image = 'data:image/jpeg;base64,' + this.state.image.toString('base64');
    }
    return (
      <div className="App">
        <h1>Your Image</h1>
        <p>This image is stored on IPFS & the Ethereum Blockchain!</p>
        <img src={image} alt="Stored on IPFS & the Ethereum Blockchain"/>
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
