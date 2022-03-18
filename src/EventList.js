import React from 'react';
import Event from './Event';

function EventList({events}) {
  return (
    <div>
        {events.map(event =>(
          <Event 
            name={event.name}
            title={event.title} 
            topic={event.topic}
            tags={event.tags}
            date={event.date} 
            startTime={event.startingTime}
            endTime={event.endingTime}
            location={event.location}
            description={event.description}
            url={event.website}
            key={event.id}  
          />
        ))}
      </div>
  )
}

export default EventList