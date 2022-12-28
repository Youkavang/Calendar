import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './Home';
import Calendar from './Calendar';
import './Website.css';

function Website () {
    const [show, handleShow] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        handleShow(true);
      } else handleShow(false);
    });
    return () => {
      window.removeEventListener("scroll");
    };
  }, []);
    return(
        <Router>
            <nav className='nav-bar'>
                <Link to='/' className='link'>Home</Link>
                <Link to='/Calendar' className='link'>Calendar</Link>
                <Link to='/EventList' className='link'>EventList</Link>
                <Link to='/About' className='link'>About</Link>
                <Link to='/Contact' className='link'>Contact</Link>
            </nav>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/Calendar' element={<Calendar/>}/>
                {/* <Route path='/EventList' element={<EventList/>}/> */}
                {/* <Route path='/' element={<Contact/>}/>
                <Route path='*' element={<Error/>}/> */}
            </Routes>
        </Router>

    )
}

export default Website;