'use client';

import { useState } from 'react'; // Import useState hook
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Link from 'next/link';
import Image from 'next/image';
import CustomToolbar from './toolbar';

const localizer=momentLocalizer(moment);

export default function Home() {
  // State to store the budget value
  const [budget, setBudget] = useState('');
  //State to store the busy blocks
  const [events,setEvents]=useState([]);
  // State to track if the button is clicked
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  // Event handler for budget input change
  const BudgetChanged = (event) => {
    setBudget(event.target.value);
  };
  //Event handler for creating busy blocks onto Calendar
  const busyBlock= async ({start, end})=>{
    const title='Busy Block';
    const newEvent={start, end, title};
    setEvents((prevEvents) => [...prevEvents, newEvent]);

    try{
      const response=await fetch('/api/schedule', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({startTime: start, endTime: end}),
      });
      if(!response.ok){
        throw new Error('Failed to create busy block');
      } 
    }catch (error){
        console.error('Error creating busy block: ',error);
      }
  };
 
  // Event handler for adding budget
  const addBudget = () => {
    // Update isButtonClicked to true when the button is clicked
    setIsButtonClicked(true);
  };

  return (
    <>
      <h1>Account Page</h1>
      <h2>Budget</h2>
      <p>
        Enter a budget below. This will reset each week and adjust after each meal 
      </p>
      <div>
        {/* Display label and input field for entering budget */}
        <label>Budget: </label>
        <input type="text" value={budget} onChange={BudgetChanged}/>
        <br></br>
        {/* Button to trigger adding budget */}
        <button onClick={addBudget}>Enter</button>
      </div>
      {/* Display the entered budget on the screen only if the button is clicked */}
      {isButtonClicked && <p>Budget entered: ${budget}</p>}
      <div style={{height:1000}}>
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
    </>
  );
}
