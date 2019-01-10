import React, { Component } from "react";
import { connect } from 'react-redux';
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import getWeb3 from "./utils/getWeb3";
import "./App.css";
import FolderList from './components/FolderList';
import UploadForm from './components/UploadForm';
import Typography from '@material-ui/core/Typography';
import ImageDialog from './components/Dialog';

class App extends Component {
  // Here the password needs to be a 32byte and iv needs to be 16byte only
  // Have currently kept a default generic password which is useless but rather
  // only for demonstration purposes which currently cannot be changed
  state = {
      totalHashes: 0,
      hashArray: []
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
      this.props.setInitials(web3, accounts[0], instance);
      await this.getAllHashValues();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  getAllHashValues = async () => {
      const { contract } = this.props;
      let totalHashes = await contract.methods.totalHashes().call();
      this.setState({ totalHashes });
      let hashArray = [];
      for(let i=this.state.totalHashes-1; i>=0; i--){
          let newHash = await contract.methods.getHash(i).call();
          hashArray.push(newHash);
      }
      this.setState({ hashArray });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Typography variant='h4' style={{ margin: '2%'}} >Uploaded Images</Typography>
          <FolderList hashArray={this.state.hashArray} totalHashes={this.state.totalHashes} setHashValue={this.props.setHashValue} />
          <UploadForm />
          <Switch>
            <Route path='/display' component={ImageDialog} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return{
    contract: state.contract
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    setInitials: (web3, account, contract) => dispatch({type: 'SET_ACCOUNT_CONTRACT', web3, account, contract}),
    setHashValue: (hashValue, hashDesc) => dispatch({type: 'CHANGE_SELECTED_HASH', hashValue, hashDesc})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
