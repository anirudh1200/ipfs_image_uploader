import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { encrypt, decrypt } from '../utils/encryption';
import ipfs from '../utils/ipfs';

class FormDialog extends Component {
  state = {
    open: false,
    buffer: '',
    status: ''
  };

  buttonStyle = {
    position: 'fixed',
    bottom: '50px',
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  // To convert selected file to Uint8Array format
  captureFile = e => {
      e.preventDefault();
      const file = e.target.files[0];
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
          this.setState({buffer: Buffer(reader.result)}, () => {
            console.log(this.state.buffer);
          });
      };
  };

  // When the user clicks on submit it encrypts the file first then uploads to ipfs
  handleSubmit = async e => {
      e.preventDefault();
      this.setState({ status: 'Uploading to ipfs' });
      let encrypted = encrypt(this.state.buffer, this.props.password, this.props.iv);
      console.log(encrypted);
      this.uploadFile(encrypted);
  };

  //Upload encrypted image to ipfs
  uploadFile = (encryptedData) => {
      const { account, contract } = this.props;
      ipfs.add(encryptedData, async (error, result) => {
          if(error){
              console.error(error);
              return;
          }
          this.setState({ status: 'Uploading to blockchain' });
          //For debugging
          console.log(result[0].hash);
          // Stores a given ipfsHash to contract
          await contract.methods.addHash(result[0].hash, "Description").send({ from: account });
          // Stores the ipfs hash to state
          this.setState({ ipfsHash: await contract.methods.getHash(0).call() });
          this.setState({ status: 'Transaction Successful. Image will be visible soon' });
          this.handleClose();
      });
  };

  render(){
    return (
      <div>
        <Button onClick={this.handleClickOpen} variant="contained" color="secondary" style={this.buttonStyle}>Open form dialog</Button>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Upload Image</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Select the image you want to upload
            </DialogContentText>
              <input type="file" onChange={this.captureFile} style={{paddingTop: "5px"}} />
            <DialogContentText>
              {this.state.status}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Upload
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return{
    contract: state.contract,
    account: state.account,
    password: state.password,
    iv: state.iv
  }
}

export default connect(mapStateToProps)(FormDialog);
