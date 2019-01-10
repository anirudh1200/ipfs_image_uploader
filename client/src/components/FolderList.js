import React from 'react';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';

const formatDate = (input) => {
    input += "000";
    let date = new Date(parseInt(input));
    let inputTime = date.toTimeString();
    const t = inputTime.slice(0, 8);
    return date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear()+'  '+t;
}

const FolderList = (props) => {
  const { hashArray } = props;
  const { totalHashes } = props;
  const root = {
      width: '80%',
      margin: 'auto',
    }
  return (
    <List style={root}>
    {
        hashArray.map((hashItem, index) => {
            let date = formatDate(hashItem[3]);
            let num = totalHashes-index-1;
            return(
              <Link to='/display' key={num}>
                <ListItem  onClick={(e) => {
                  props.setHashValue(hashItem[0], hashItem[1], hashItem[2]);
                }}>
                  <Avatar>
                    <ImageIcon />
                  </Avatar>
                  <ListItemText primary={hashItem[1]} secondary={date} />
                </ListItem>
              </Link>
            )
        })
    }
    </List>
  );
}

export default FolderList;
