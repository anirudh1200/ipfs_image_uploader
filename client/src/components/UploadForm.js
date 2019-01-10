import React, { Component } from 'react';
import { connect } from 'react-redux';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { encrypt } from '../utils/encryption';
import ipfs from '../utils/ipfs';

class FormDialog extends Component {
  state = {
    open: false,
    buffer: '',
    status: '',
    description: '',
    type: ''
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

  changeDescription = e => {
    this.setState({description: e.target.value});
  }

  // To convert selected file to Uint8Array format
  captureFile = e => {
      e.preventDefault();
      const file = e.target.files[0];
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
          this.setState({buffer: Buffer(reader.result)});
      };
  };

  // When the user clicks on submit it encrypts the file first then uploads to ipfs
  handleSubmit = async (type) => {
      this.setState({type});
      this.setState({ status: 'Uploading to ipfs' });
      let encrypted = encrypt(this.state.buffer, this.props.password, this.props.iv);
      this.uploadFile(encrypted);
  };

  //Upload encrypted docs to ipfs
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
          await contract.methods.addHash(result[0].hash, this.state.description, this.state.type).send({ from: account });
          // Stores the ipfs hash to state
          this.setState({ ipfsHash: await contract.methods.getHash(0).call() });
          this.setState({ status: 'Transaction Successful. Docs will be visible soon' });
          this.handleClose();
      });
  };

  render(){
    return (
      <div>
        <Button onClick={this.handleClickOpen} variant="contained" color="secondary" style={this.buttonStyle}>Open form dialog</Button>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Upload Document</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Select the document you want to upload
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              onChange={this.changeDescription}
            />
              <input type="file" onChange={this.captureFile} style={{paddingTop: "5px"}} />
            <DialogContentText>
              {this.state.status}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button variant="contained" color="default" onClick={() => this.handleSubmit('image')}>
              Upload Image
              <CloudUploadIcon />
            </Button>
            <Button variant="contained" color="default" onClick={() => this.handleSubmit('pdf')}>
              Upload Pdf
              <CloudUploadIcon />
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
