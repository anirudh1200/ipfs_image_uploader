import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class FormDialog extends Component {
  state = {
    open: false,
    buffer: ''
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
      }
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
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Upload
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }


}

export default FormDialog;
