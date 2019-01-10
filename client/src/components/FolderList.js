import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

const formatDate = (input) => {
    input += "000";
    let date = new Date(parseInt(input));
    let inputTime = date.toTimeString();
    const t = inputTime.slice(0, 8);
    return date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear()+'  '+t;
}

const FolderList = (props) => {
  const { classes } = props;
  const { hashArray } = props;
  const {totalHashes} = props;
  return (
    <List className={classes.root}>
    {
        hashArray.map((hashItem, index) => {
            console.log(hashItem);
            let date = formatDate(hashItem[2]);
            return(
                <ListItem key={totalHashes - index -1}>
                  <Avatar>
                    <ImageIcon />
                  </Avatar>
                  <ListItemText primary={hashItem[1]} secondary={date} />
                </ListItem>
            )
        })
    }
    </List>
  );
}

FolderList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FolderList);
