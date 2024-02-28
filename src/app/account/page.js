'use client';

import { useState, useEffect } from 'react'; // Import useState hook
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';


const localizer=momentLocalizer(moment);

export default function Home() {
  const { data: session, status }  = useSession();
  // State to store the budget value
  const [budget, setBudget] = useState('');
  const [budgetInput, setBudgetInput] = useState('')
  //State to store the busy blocks
  const [events,setEvents]=useState([]);
  // State to track if the button is clicked
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  // State of current user
  const [user, setUser] = useState([])
  const [location, setLocation] = useState('');
  const [locationInput, setLocationInput] = useState('')

useEffect(() => {
  fetch("/api/users", { method: "get" }).then((response) => response.ok && response.json()).then(
      user => {
          user && setUser(user);
          setBudget(user.budget)
          setLocation(user.location)
      }
  );
}, []);

  // Event handler for budget input change
  const BudgetInputChanged = (event) => {
    setBudgetInput(event.target.value);
  };

  // Event handler for location input change
  const LocationInputChanged = (event) => {
    setLocationInput(event.target.value);
  };

  //Event handler for creating busy blocks onto Calendar
  const busyBlock=({start, end})=>{
    const title='Busy Block';
    const newEvent={start, end, title};
    setEvents([...events, newEvent]);
  };
 
  // Event handler for adding budget
  const addBudget = () => {
    fetch(`/api/users/${session.user.id}}`, {method: 'put', body: JSON.stringify({budgetInput, locationInput: location})}).then((res) => {
      if(res.ok) {
        // Update isButtonClicked to true when the button is clicked
        setIsButtonClicked(true);
      }
  });
  };

    // Event handler for adding location
    const addLocation = () => {
      fetch(`/api/users/${session.user.id}}`, {method: 'put', body: JSON.stringify({budgetInput: budget, locationInput})}).then((res) => {
        if(res.ok) {
          // Update isButtonClicked to true when the button is clicked
          setIsButtonClicked(true);
        }
    });
    };

  function updateBudget() {
    if (budgetInput){
      setBudget(budgetInput);
      addBudget();
      setBudgetInput('');
    }
  }

  function updateLocation() {
    if (locationInput){
      setLocation(locationInput);
      addLocation();
      setLocationInput('');
    }
  }
  if (status == 'authenticated'){
    return (
      <>
        <h1>Account Page</h1>
        <h2>Budget</h2>
        <p>
          Enter a budget below. This will reset each week and adjust after each meal 
        </p>
        <div>
          {/* Display label and input field for entering budget */}
          <label>Enter Weekly Budget: </label>
          <input type="text" value={budgetInput} onChange={BudgetInputChanged}/>
          <br></br>
          {/* Button to trigger adding budget */}
          <button onClick={updateBudget}>Enter</button>
        </div>
        {/* Display the entered budget on the screen only if the button is clicked */}
        {<p>Weekly Budget: ${budget}</p>}
        <div>
          {/* Display label and input field for entering location */}
          <label>Enter Location: </label>
          <input type="text" value={locationInput} onChange={LocationInputChanged}/>
          <br></br>
          {/* Button to trigger adding location */}
          <button onClick={updateLocation}>Enter</button>
        </div>
        {/* Display the entered budget on the screen only if the button is clicked */}
        {location.length && <p>Location: {location}</p> || <p>Location: No Location Entered</p>}
        <div style={{height:500}}>
          <h2>Calendar</h2>
          <Calendar 
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={busyBlock}
          views={['month', 'week', 'day']}
          defaultView="week"
          scrollToTime={new Date(1990,1,1,1)}
          defaultDate={new Date()}
          />

        </div>
        <ul>
        </ul>
      </>
    );
  }
    else {
      redirect('/')
    }
}
