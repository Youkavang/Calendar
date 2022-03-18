import React from 'react';
import {Avatar, List, ListItem, ListItemAvatar, ListItemText} from '@material-ui/core';

function Event({title, tags, date, startTime, endTime, location, name, description, url}) {
  return (
    <List className="event__list">
        <ListItem>
            <ListItemAvatar>
                <Avatar/>
            </ListItemAvatar>
            <ListItemText
              primary={name}
              secondary={title}
            />
        </ListItem>
        <ListItem>
            <ListItemText 
              primary={description}
              secondary={tags}
            />
        </ListItem>
        <ListItem>
            <ListItemText 
              primary={location}
              secondary={`${date}: ${startTime} - ${endTime}`}
            />
        </ListItem>
        <ListItem>
        <a href={url} rel="noreferrer">Click here for more details</a>
        </ListItem>
    </List>
    // <div>
    //   {title}
    //   <br/>
    //   {date}
    //   <br/>
    //   {startTime} - {endTime}
    //   <br/>
    //   {description}
    // </div>
  )
}

export default Event