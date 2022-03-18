import React, { useState, useEffect } from 'react';
import { onSnapshot, collection, doc, setDoc, addDoc, query, where, orderBy } from 'firebase/firestore';
import { Button, FormControl, Input, InputLabel } from '@material-ui/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Event from './Event';
import db from './firebase';
import Modal from "react-modal";
import './App.css';



function App() {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [topic, setTopic] = useState("");
  const [dateInput, setDateInput] = useState("");
  // might need these later to solve infinite repeat for events
  // const [startRecur, setStartRecur] = useState("");
  // const [endRecur, setEndRecur] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [start24Hr, setStart24Hr] = useState("")
  const [end24Hr, setEnd24hr] = useState("")
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState([]);
  const [descriptionInput, setDescriptionInput] = useState ("");
  const [eventModal, setEventModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [eventTitle, setEventTitle] = useState(null);
  const [eventTopic, setEventTopic] = useState(null);
  const [eventTags, setEventTags] = useState(null);
  const [eventDesc, setEventDesc] = useState(null);
  const [isNameToggled, setIsNameToggled] = useState(false);
  const [isTopicToggled, setIsTopicToggled] = useState(false);
  const [search, setSearch] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  


  //when app loads listen to database and refresh when added/removed
  // useEffect(
  //   () =>{
  //       onSnapshot(collection(db, "events"), (snapshot) =>
  //       setEvents(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
  //   },[]);

    useEffect(
      () =>{
      //Will organize by name of who made the event in ascending order when a button is toggled
      if(isNameToggled){
      const eventRef = collection(db, "events");
      const q = query(eventRef, orderBy("name", "asc"))
      onSnapshot(q, (querySnapshot) =>
      setEvents(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
    } 
      //Will organize by topic names in ascending order when a button is toggled. 
      else if(isTopicToggled){
      const eventRef = collection(db, "events");
      const q = query(eventRef, orderBy("topic", "asc"))
      onSnapshot(q, (querySnapshot) =>
      setEvents(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
    } 
      //Default display of events
      else{
      onSnapshot(collection(db, "events"), (snapshot) =>
      setEvents(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
    }
      }, [isNameToggled, isTopicToggled])

      //Attempt to try and do a search query that will display only specific events based on the search
      // useEffect(
      //   () =>{
      //   const eventRef = collection(db, "events");
      //   const q = query(eventRef, where("topic", '==', {search}));
      //   onSnapshot(q, (querySnapshot) =>
      //   setEvents(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
      //   }, [isSearched])

  
  const handleSearch = (e) => {
    setSearch(e.target.value)
  }
  
  const handleName = (e) => {
    setName(e.target.value)
  }

  const handleTitle = (e) =>{
    setTitleInput(e.target.value)
  }

  const handleTopic = (e) =>{
    setTopic(e.target.value)
  }

  const handleDate = (e) =>{
    setDateInput(e.target.value);
  }

  const handleStartTime = (e) =>{
    setStartTime(e.target.value);
  }

  const handleEndTime = (e) =>{
    setEndTime(e.target.value);
  }

  const handleLocation = (e) => {
    setLocation(e.target.value);
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
    setEventModal(false)
  }

  const handleNameToggled = () => {
    setIsNameToggled(!isNameToggled)
    if(isTopicToggled === true){
      setIsTopicToggled(false)
    }
  }

  const handleTopicToggled = () => {
    setIsTopicToggled(!isTopicToggled)
    if(isNameToggled === true){
      setIsNameToggled(false)
    }
  }

  const handleSearched = () => {
    setIsSearched(!isSearched)
  }

  const handleEventClick = ({ event }) => {
    setInfoModal(true)
    setEventTitle(event._def.title);
    setEventTopic(event._def.extendedProps.topic);
    setEventTags(event._def.extendedProps.tags);
    setEventDesc(event._def.extendedProps.description);

    
  }

  const handelInfoCancel = () =>{
    setInfoModal(!infoModal)
  }
  
  const convertTime12to24 = (time12h) => {
      const [time, modifier] = time12h.split(' ');
    
      let [hours, minutes] = time.split(':');
    
      if (hours === '12') {
        hours = '00';
      }
    
      if (modifier === 'PM' || modifier === 'pm') {
        hours = parseInt(hours, 10) + 12;
      } 
    
      return `${hours}:${minutes}`;
    }

  const addEvent = (e) =>{
    e.preventDefault();  

     // Function to convert from 12hr to 24hr as FullCalendar uses 24hr time
    

    setStart24Hr(convertTime12to24(startTime))
    setEnd24hr(convertTime12to24(endTime))
    console.log(start24Hr);
    console.log(end24Hr);
    
    //Adds a document to databse and specifies the id of said document
    //Either the topic or tag must include tech in order to be submitted
    if((topic.toLowerCase().includes('tech') 
    || tags.toLowerCase().includes('tech'))){
      const newEvent = doc(db, 'events', `${titleInput}`);
    setDoc(newEvent, 
        {
          name: name,
          title: titleInput,
          topic: topic,
          tags: tags,
          date: dateInput,
          startTime: start24Hr,
          endTime: end24Hr,
          twelveHourStart: startTime, 
          twelveHourEnd: endTime,
          location: location,
          description: descriptionInput,
          //Infinite repeat might have something to do with this property
          //Check fullcalendar documentation
          // daysOfWeek:[],
        })

        setEvents([...events, 
      {
        name: name,
        title: titleInput, 
        topic: topic,
        tags: tags,
        date: dateInput, 
        description: descriptionInput,
        startTime: startTime,
        endTime: endTime,
        location: location
      }]);

    setName('');
    setTitleInput('');
    setTopic('');
    setTags('');
    setDateInput('');
    setStartTime('');
    setEndTime('');
    setLocation('');
    setDescriptionInput('');
    setEventModal(false)
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
      <h1>Event List</h1>
      <input 
        type="text"
        placeholder='Enter a topic'
        value={search}
        onChange={handleSearch}
      />
      <button type='submit' onClick={handleSearched}>submit</button>
      <br/> 
      <button onClick={handleTopicToggled}>Topic</button>
      <button onClick={handleNameToggled}>Organizer Name</button>
      <button onClick={openEventModal}>Add Event</button>
      <Modal
        isOpen={eventModal}
        shouldCloseOnEsc={true}
      >
      <button onClick={closeEventModal}>close</button>
      <form>
        <FormControl>
          <InputLabel>Event organizer...</InputLabel>
          <Input onChange={handleName} value={name}></Input>
          <FormControl>
            <InputLabel>Event title...</InputLabel>
            <Input onChange={handleTitle} value={titleInput}></Input>
          </FormControl>
          <FormControl>
            <InputLabel>Event topic...</InputLabel>
            <Input onChange={handleTopic} value={topic}></Input>
          </FormControl>
          <FormControl>
            <InputLabel>Event tags...</InputLabel>
            <Input onChange={handleTags} value={tags}></Input>
          </FormControl>
          <FormControl>
            <InputLabel>Event date...</InputLabel>
            <Input onChange={handleDate} value={dateInput}></Input>
          </FormControl>
          <FormControl>
            <InputLabel>Starting time...</InputLabel>
            <Input onChange={handleStartTime} value={startTime}></Input>
          </FormControl>
          <FormControl>
            <InputLabel>Ending time...</InputLabel>
            <Input onChange={handleEndTime} value={endTime}></Input>
          </FormControl>
          <FormControl>
            <InputLabel>Event location...</InputLabel>
            <Input onChange={handleLocation} value={location}></Input>
          </FormControl>
          <FormControl>
            <InputLabel>Event description...</InputLabel>
            <Input onChange={handleDescription} value={descriptionInput}></Input>
          </FormControl>
          *Please fill in all boxes
          <br/>
          *If the form does not complete that means at least one of your criteria does not meet our requirments
          <Button 
            variant="contained" type="submit" onClick={addEvent}>Add Event</Button>
        </FormControl>
      </form>
    </Modal>

      <div>
        {events.map(event =>(
          <Event 
            name={event.name}
            title={event.title} 
            topic={event.topic}
            tags={event.tags}
            date={event.date} 
            startTime={event.twelveHourStart}
            endTime={event.twelveHourEnd}
            location={event.location}
            description={event.description}
            key={event.id}  
          />
        ))}
      </div>
      <div className='calendar'>
        <FullCalendar
          plugins={[ dayGridPlugin]}
          headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
        }}
        events={events}
        eventClick={handleEventClick}
        fixedWeekCount={false}
        />
      </div>
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
          <label>{`Event Topic: ${eventTopic}`}</label>
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

export default App;
 