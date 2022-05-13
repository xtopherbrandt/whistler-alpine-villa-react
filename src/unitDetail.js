import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment';
import { Button, Typography } from '@mui/material';
import React from 'react';

function UnitDetail( props ){
    if (props.unitStatus === 'Available' ){
      return (
        <ListItem key={props.key}>
            <ListItemText 
              primary={"Unit #" + props.unitNumber} 
              secondary={props.unitStatus}
            />
        </ListItem>
      );
    }
    else{
      return(
        <ListItem 
          key={props.key}
          secondaryAction={
            <IconButton edge="end" aria-label='cancel' onClick={() => { props.cancelCheckInHandler(props.cancelcheckInLink, props.setDirtyFlag );}}>
              <DeleteIcon/>
            </IconButton>
          }>
            <ListItemText 
              primary={"Unit #" + props.unitNumber}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline'}}
                    component="span"
                    variant="body2"
                    color="text.primary">
                      {props.unitStatus}
                    </Typography>
                    {" : " + moment(props.checkInDate).format('LL') + " - " + moment(props.checkOutDate).format('LL')}
                </React.Fragment>
              }
            />

        </ListItem>
      );
    }
  }

  export default UnitDetail;