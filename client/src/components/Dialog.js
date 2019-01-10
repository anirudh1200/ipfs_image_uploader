import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { decrypt } from '../utils/encryption';

class ImageDialog extends Component {
  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  componentDidMount = () => {
    this.setState({ open: true });
    console.log(this.props);
    this.fetchData();
  };

  // Fetch data from url 'ipfs.io/ipfs/{ipfsHash}'
  // This first converts the recieved data into Uint8Array
  // then decrypts it to get original image
  fetchData = () => {
      fetch(`https://ipfs.io/ipfs/${this.props.hashValue}`)
          .then(res => {
              res.arrayBuffer()
                  .then(buffer => {
                      buffer = new Uint8Array(buffer);
                      let decrypted = decrypt(buffer, this.props.password, this.props.iv);
                      this.setState({ image: decrypted });
                  })
          });
  }

  render(){
    console.log(this.props);
    let image;
    if(this.state.image){
      image = <img src={'data:image/jpeg;base64,' + this.state.image.toString('base64')} alt='Error in fetching' />
    }
    if(this.props){
      return (
        <div>
          <Dialog
            open={this.state.open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Image</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {this.props.hashDesc}
              </DialogContentText>
              {image}
            </DialogContent>
            <DialogActions>
              <Link to='/'>
                <Button variant="outlined" color="primary" onClick={this.handleClose}>
                  Close
                </Button>
              </Link>
            </DialogActions>
          </Dialog>
        </div>
      );
    } else {
        return(
          <div>
            Loading
          </div>
        )
    }
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return{
    hashValue : state.selectedHash,
    hashDesc: state.selectedHashValue,
    password: state.password,
    iv: state.iv
  }
}

export default connect(mapStateToProps)(ImageDialog);
