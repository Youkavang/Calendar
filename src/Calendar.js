import React, { useState, useEffect } from 'react';
import { onSnapshot, collection, doc, setDoc, addDoc, query, where, orderBy } from 'firebase/firestore';
import { Button, FormControl, Input, InputLabel } from '@material-ui/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import EventList from './EventList';
import db from './firebase';
import Modal from "react-modal";
import './Calendar.css';




function Calendar() {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [start24Hr, setStart24Hr] = useState("")
  const [end24Hr, setEnd24hr] = useState("")
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState([]);
  const [descriptionInput, setDescriptionInput] = useState ("");
  const [url, setUrl] = useState("");
  const [eventModal, setEventModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [eventTitle, setEventTitle] = useState(null);
  const [eventTags, setEventTags] = useState(null);
  const [eventDesc, setEventDesc] = useState(null);
  const [isNameToggled, setIsNameToggled] = useState(false);
  const [isTagsToggled, setIsTagsToggled] = useState(false);
  const [isStartToggled, setIsStartToggled] = useState(false);
  const milwaukeeZipcodes = ['53022', '53154', '53202', '53203', '53204', '53205', '53206', '53207',
  '53208', '53209', '53210', '53211', '53212', '53213', ,'53214', '53215', '53216', '53217', '53218',
  '53219', '53220', '53221', '53222', '53223', '53224', '53225', '53226', '53227', '53228', '53233', '53235'];
  let start; 
  let end;
  let isInMilwaukee;


  //when app loads listen to database and refresh when added/removed
  // useEffect(
  //   () =>{
  //       onSnapshot(collection(db, "events"), (snapshot) =>
  //       setEvents(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
  //   },[]);
    useEffect(
      () =>{
          onSnapshot(collection(db, "events"), (snapshot) =>
          setEvents(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        )
        console.log(events)
      },
        []
    );
    // useEffect(
    //   () =>{
    //   //Will organize by name of who made the event in ascending order when a button is toggled
    //   if(isNameToggled){
    //   const eventRef = collection(db, "events");
    //   const q = query(eventRef, orderBy("name", "asc"))
    //   onSnapshot(q, (querySnapshot) =>
    //   setEvents(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
    // } 
    //   //Will organize by topic names in ascending order when a button is toggled. 
    //   else if(isTagsToggled){
    //   const eventRef = collection(db, "events");
    //   const q = query(eventRef, orderBy("tags", "asc"))
    //   onSnapshot(q, (querySnapshot) =>
    //   setEvents(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
  
    //   //Will organize by start times. 
    //   }else if(isStartToggled){
    //     const eventRef = collection(db, "events");
    //     const q = query(eventRef, orderBy("start", "asc"))
    //     onSnapshot(q, (querySnapshot) =>
    //     setEvents(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
        
    //   //Default display of events
    //   }else{
    //   onSnapshot(collection(db, "events"), (snapshot) =>
    //   setEvents(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
    // }
    //   }, [isNameToggled, isTagsToggled, isStartToggled])
  
  const handleName = (e) => {
    setName(e.target.value)
  }

  const handleTitle = (e) =>{
    setTitleInput(e.target.value)
  }

  const handleStartDate = (e) =>{
    setStartDate(e.target.value);
  }

  const handleEndDate = (e) =>{
    setEndDate(e.target.value);
  }
  
  const handleStartTime = (e) =>{
    start = (e.target.value);
    setStartTime(start);
    setStart24Hr((convertTime12to24(startTime)));
  }
 
  const handleEndTime = (e) =>{
    end = (e.target.value);
    setEndTime(end);
    setEnd24hr((convertTime12to24(endTime)));
  }

  const handleLocation = (e) => {
    setLocation(e.target.value);
  }

  const handleUrl = (e) => {
    setUrl(e.target.value);
  }

  const handleTags =(e) =>{
    setTags(e.target.value);
  }

  const handleDescription = (e) =>{
    setDescriptionInput(e.target.value);
  } 

  const openEventModal = () => {
    setEventModal(true);
  }

  const closeEventModal = () =>{
    setName('');
    setTitleInput('');
    setTags('');
    // setDateInput('');
    setStartTime('');
    setEndTime('');
    setLocation('');
    setDescriptionInput('');
    setUrl('');
    setEventModal(false)
  }

  const handleNameToggled = () => {
    setIsNameToggled(!isNameToggled)
    if(isTagsToggled === true){
      setIsTagsToggled(false)
    }else if(isStartToggled === true){
      setIsStartToggled(false);
    }
  }

  const handleTagsToggled = () => {
    setIsTagsToggled(!isTagsToggled)
    if(isNameToggled === true){
      setIsNameToggled(false)
    }else if(isStartToggled === true){
      setIsStartToggled(false);
    }
  }

  const handleStartToggled = () =>{
    setIsStartToggled(!isStartToggled)
    if(isNameToggled === true){
      setIsNameToggled(false)
    }else if(isTagsToggled === true){
      setIsTagsToggled(false);
    }
  }

  const handleEventClick = ({ event }) => {
    setInfoModal(true)
    setEventTitle(event._def.title);
    setEventTags(event._def.extendedProps.tags);
    setEventDesc(event._def.extendedProps.description);

    
  }

  const handelInfoCancel = () =>{
    setInfoModal(!infoModal)
  }

  // Function to convert from 12hr to 24hr as FullCalendar uses 24hr time
  const convertTime12to24 = (time12h) => {
      const [time, modifier] = time12h.split(' ');
    
      let [hours, minutes] = time.split(':');
    
      if (hours === '12') {
        hours = '00';
      }
    
      if (modifier === 'P' || modifier === 'p') {
        hours = parseInt(hours, 10) + 12;
        return `${hours}:${minutes}`;
      } else {
        if(hours < 10){
          return `0${hours}:${minutes}`
        } else{
          return `${hours}:${minutes}`
        };
      }
      
    }

  const addEvent = (e) =>{
    e.preventDefault();  
    milwaukeeZipcodes.forEach(zipcode =>{
      if(location.includes(zipcode)){
        isInMilwaukee = true;
        return isInMilwaukee;
      };
    })
    //Adds a document to databse and specifies the id of said document
    //Either the title or tag must include tech in order to be submitted
    if((name.toLowerCase().includes('tech') 
    || titleInput.toLowerCase().includes('tech') 
    || tags.toLowerCase().includes('tech')
    || descriptionInput.toLowerCase().includes('tech'))
    && isInMilwaukee){
      const newEvent = doc(db, 'events', `${titleInput}`);
    setDoc(newEvent, 
        {
          name: name,
          title: titleInput,
          tags: tags,
          date: startDate,
          start: `${startDate}T${start24Hr}`,
          end: `${endDate}T${end24Hr}`,
          startingTime: startTime,
          endingTime: endTime,
          location: location,
          description: descriptionInput,
          website: url
        })

        setEvents([...events, 
      {
        name: name,
        title: titleInput, 
        tags: tags,
        date: startDate, 
        description: descriptionInput,
        startTime: startTime,
        endTime: endTime,
        location: location,
        url: url
      }]);
    console.log(startTime);
    console.log(endTime);
    setName('');
    setTitleInput('');
    setTags('');
    setStartDate('');
    setEndDate('');
    setStartTime('');
    setEndTime('');
    setLocation('');
    setDescriptionInput('');
    setUrl('');
    setEventModal(false)
  } else if(!isInMilwaukee) {
    alert("The event you are trying to add is not a in the Milwaukee area!")
  } else {
    alert('This is not a tech event!')
  }
    
    //Adds a document to database without needing to specify id of document and want firestore to automatically do it for you
    // const addDoc = addDoc(collection(db, 'events'),{
    //   name: name,
    //   title: titleInput,
    //   date: dateInput,
    //   startTime: startTime,
    //   endTime: endTime,
    //   location: location,
    //   description: descriptionInput,

    //   wanted to add this timestamp so events could be sorted by newest and oldest but it seems to bug the form
    //   timeStamp: firebase.firestore.FieldValue.serverTimestamp()});

    
  }

  return (
    <div className="App">
        <div className='calendar'>
        <FullCalendar
        customButtons={{
            addEventButton: {
                text: 'Add Event',
                click: function() {
                    setEventModal(true);
                }
            },
        }}
          plugins={[ dayGridPlugin, googleCalendarPlugin ]}
          headerToolbar={{
          left: 'prev,next today addEventButton',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
        }}
        events={events}
        eventClick={handleEventClick}
        fixedWeekCount={false}
        
        />
      </div>
      <div className='event-list'>
        <h1>Event List</h1>
        <br/>
        <Button variant="outlined" onClick={handleNameToggled}>Organizer Name</Button>
        <Button variant="outlined" onClick={handleTagsToggled}>Tag</Button>
        <Button variant="outlined" onClick={handleStartToggled}>Starting Time</Button>
        
        <div>
          <EventList 
          events={events}
          />
        </div>
      </div>
      <Modal
        isOpen={eventModal}
        shouldCloseOnEsc={true}
      >
      <Button 
          variant="contained"
          color="error"
          onClick={closeEventModal}>
            X
      </Button>
      <form>
        <FormControl>
          <InputLabel required='true'>Event organizer...</InputLabel>
          <Input onChange={handleName} value={name}></Input>
          <FormControl>
            <InputLabel required='true'>Event title...</InputLabel>
            <Input onChange={handleTitle} value={titleInput}></Input>
          </FormControl>
          <FormControl>
            <InputLabel required='true'>Event tags...</InputLabel>
            <Input onChange={handleTags} value={tags}></Input>
          </FormControl>
          <FormControl>
            <InputLabel required='true'>{`(start date) yyyy-mm-dd format...`}</InputLabel>
            <Input onChange={handleStartDate} value={startDate}></Input>
          </FormControl>
          <FormControl>
            <InputLabel>{`(end date) yyyy-mm-dd format...`}</InputLabel>
            <Input onChange={handleEndDate} value={endDate}></Input>
          </FormControl>
          <FormControl required='true'>
            <InputLabel>Starting time...</InputLabel>
            <Input onChange={handleStartTime} value={startTime}></Input>
          </FormControl>
          <FormControl>
            <InputLabel>Ending time...</InputLabel>
            <Input onChange={handleEndTime} value={endTime}></Input>
          </FormControl>
          <FormControl>
            <InputLabel required='true'>Event location...</InputLabel>
            <Input onChange={handleLocation} value={location}></Input>
          </FormControl>
          <FormControl>
            <InputLabel>Event description...</InputLabel>
            <Input onChange={handleDescription} value={descriptionInput}></Input>
          </FormControl>
          <FormControl>
            <InputLabel>Event url...</InputLabel>
            <Input onChange={handleUrl} value={url}></Input>
          </FormControl>
          *If the form does not complete that means at least one of your criteria does not meet our requirments
          <Button 
            variant="contained" type="submit" onClick={addEvent}>Add Event</Button>
        </FormControl>  
      </form>
    </Modal>
     
      <Modal
        isOpen={infoModal}
        appElement={document.getElementById('root')}
        className="infoModal"
        overlayClassName='infoOverlay'
      >
        <div className="label-t-d">
          <label>{`Event Title: ${eventTitle}`}</label>
        </div>
        <div className="label-t-d">
          <label>{`Event Tags: ${eventTags}`}</label>
        </div>
        <div className="label-t-d"> 
          <label>{`Event Description: ${eventDesc ? eventDesc : "this event has no summary"}`}</label>
        </div>
        <div className="event-close-btn" >
        <button onClick={handelInfoCancel}>
          Close
        </button>
        </div>
       
      </Modal>
      
    </div>
  );
}

export default Calendar;
 