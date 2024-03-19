
'use client';


import { useState, useEffect } from 'react'; // Import useState hook
import { Button } from '@mui/material';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './AccountPage.module.css';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Signup from '/src/app/Signup.js';



const localizer=momentLocalizer(moment);

export default function Account() {
  const router = useRouter()
  const [searchInput, setSearchInput] = useState('');
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
  const [locallatitude, setLocalLatitude] = useState(0);
  const [locallongitude, setLocalLongitude] = useState(0);
  const [error, setError] = useState(null);

  
  
  useEffect(() => {
    if (status == "authenticated")
    fetchLocation();
    fetch("/api/users", { method: "get" }).then((response) => response.ok && response.json()).then(
        user => {
            user && setUser(user);
            setBudget(user.budget)
            setLocation(user.location)
            user.busyblocks.map((block) => {
              const title='Busy Block';
              const newEvent={start: new Date(block.startTime), end: new Date(block.endTime), title};
              setEvents((prevEvents) => [...prevEvents, newEvent]);
            })
          }
      );
    }, []);


  const fetchLocation = () => {
    const successHandler = (position) => {
        setLocalLatitude(position.coords.latitude);
        setLocalLongitude(position.coords.longitude);
      };

      const errorHandler = (error) => {
        setError(error.message);
      };

      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
      } else {
        navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
      }
  }
  
  // Event handler for budget input change
  const BudgetInputChanged = (event) => {
    setBudgetInput(event.target.value);
  };

  // Event handler for location input change
  const LocationInputChanged = (event) => {
    setLocationInput(event.target.value);
  };


  
  //Event handler for creating busy blocks onto Calendar
  const busyBlock= async ({start, end})=>{
    const isOverlapping = events.some(event => (
      (start >= event.start && start < event.end) || 
      (end > event.start && end <= event.end) ||     
      (start <= event.start && end >= event.end)    
    ));
  
    if (isOverlapping) {
      alert('The selected time overlaps with an existing busy block.');
      return;
    }
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
    fetch(`/api/users/${session.user.id}`, {method: 'put', body: JSON.stringify({budgetInput, locationInput: location})}).then((res) => {
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
      const locationInputSplit = locationInput.split(",")  
      setLocation(locationInput);
      setLocalLatitude(locationInputSplit[0])
      setLocalLongitude(locationInputSplit[1])
      addLocation();
      setLocationInput('');
    }
  }

  function eventSelectHandler(event){
    if (confirm("Do you want to remove this busy block?\n")){
      setEvents(events.filter((busyBlock) => JSON.stringify(busyBlock) != JSON.stringify(event)))
      fetch("/api/schedule", {method: 'put', body: JSON.stringify({event})})
    }
    else{
      return 0;
    }
  }

  function useCurrentLocation() {
    fetchLocation();
    setLocationInput(locallatitude.toString() + ',' + locallongitude.toString())
  }
  const displayBudget = () => {
    if (budget && !isNaN(budget)) {
      return <h2>Weekly Budget: ${Number(budget).toFixed(2)}</h2>;
    } else if (isButtonClicked) {
      
      return <p>Please enter a valid budget.</p>;
    }
    return null; // Don't display anything before the user interacts with the budget input
  };
  
  // const userName=session.user.email.slice(0,atIndex);
  if (status === "authenticated") {
    
    const atIndex=session.user.email.indexOf('@');
    const userName = session.user.email.slice(0,atIndex);
    const imageUrl = "./image.png";
    return (
      <>
        
        <div className={styles.container}>
        <h1 className={styles.userName}>{userName}'s KeepMeFed</h1>
        
          
        
      </div>
        <div className={styles.pageContainer}>
          <h2>Budget</h2>
          
          <TextField
  label="Enter Budget - will reset each week & adjust after each meal"
  variant="outlined"
  value={budgetInput}
  onChange={BudgetInputChanged}
  sx={{
    width: '40%', // Adjust the width as needed, this will shorten the length
    boxShadow: '0px 3px 9px rgba(0, 0, 0, 0.5)', // This adds a shadow
    '& .MuiFilledInput-root': {
      backgroundColor: '#F7F5F0', // Use the same color as your design background for the input
      '&:before': {
        borderBottom: 'none', // Remove underline
      },
      '&:after': {
        borderBottom: 'none', // Remove underline on focus
      },
      '&:hover:before': {
        borderBottom: 'none', // Remove underline on hover
      }
    },
    '& .MuiInputLabel-filled': {
      transform: 'translate(12px, 20px) scale(1)', // Adjust the label position
    },
    '& .MuiInputLabel-filled.MuiInputLabel-shrink': {
      transform: 'translate(12px, 10px) scale(0.75)', // Adjust the label position on focus or when filled
    },
  }}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">

      </InputAdornment>
    ),
  }}
/>
<Button onClick={updateBudget} variant="contained" sx={{
    ml: 1, // margin-left to add space between the TextField and the Button
    bgcolor: '#D4DECD', // replace with the exact color you need
    color: '#575856',
    '&:hover': {
      bgcolor: 'teal', // darker shade for hover, replace with exact color
    },
    boxShadow: '0px 3px 9px rgba(0, 0, 0, 0.5)', // Remove box shadow effect
    textTransform: 'none', // Prevents uppercase transformation
    fontSize: '1rem', // Adjust font size to match your design
    height: '56px', // Match the TextField height, adjust as needed
    borderRadius: '4px', // Match the TextField border-radius, adjust as needed
  }}>
  Enter Budget
</Button>

          {displayBudget()}
          <TextField
  label="Enter Location - (latitude, longitude)"
  variant="outlined"
  value={locationInput}
  onChange={LocationInputChanged}
  sx={{
    width: '40%', // Adjust the width as needed, this will shorten the length
    boxShadow: '0px 3px 9px rgba(0, 0, 0, 0.5)', // This adds a shadow
    '& .MuiFilledInput-root': {
      backgroundColor: '#F7F5F0', // Use the same color as your design background for the input
      '&:before': {
        borderBottom: 'none', // Remove underline
      },
      '&:after': {
        borderBottom: 'none', // Remove underline on focus
      },
      '&:hover:before': {
        borderBottom: 'none', // Remove underline on hover
      }
    },
    '& .MuiInputLabel-filled': {
      transform: 'translate(12px, 20px) scale(1)', // Adjust the label position
    },
    '& .MuiInputLabel-filled.MuiInputLabel-shrink': {
      transform: 'translate(12px, 10px) scale(0.75)', // Adjust the label position on focus or when filled
    },
  }}
/>
<div>
  <Button onClick={updateLocation} variant="contained"  sx={{
    ml: 1, // margin-left to add space between the TextField and the Button
    bgcolor: '#D4DECD', // replace with the exact color you need
    color: '#575856',
    '&:hover': {
      bgcolor: 'teal', // darker shade for hover, replace with exact color
    },
    boxShadow: '0px 3px 9px rgba(0, 0, 0, 0.5)', // Remove box shadow effect
    textTransform: 'none', // Prevents uppercase transformation
    fontSize: '1rem', // Adjust font size to match your design
    height: '56px', // Match the TextField height, adjust as needed
    borderRadius: '4px', // Match the TextField border-radius, adjust as needed
  }}>
    Update Location
  </Button>
  <Button onClick={useCurrentLocation} variant="contained" sx={{
    ml: 1, // margin-left to add space between the TextField and the Button
    bgcolor: '#D4DECD', // replace with the exact color you need
    color: '#575856',
    '&:hover': {
      bgcolor: 'teal', // darker shade for hover, replace with exact color
    },
    boxShadow: '0px 3px 9px rgba(0, 0, 0, 0.5)', // Remove box shadow effect
    textTransform: 'none', // Prevents uppercase transformation
    fontSize: '1rem', // Adjust font size to match your design
    height: '56px', // Match the TextField height, adjust as needed
    borderRadius: '4px', // Match the TextField border-radius, adjust as needed
  }}>
    Get Current Location
  </Button>
</div>

          <div className={styles.calendarContainer} style={{ height: '500pt' }}>
            <h2>Calendar</h2>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              selectable
              onSelectSlot={busyBlock}
              views={['month', 'week', 'day']}
              defaultView={'week'}
              defaultDate={moment().toDate()}
              onSelectEvent={event => eventSelectHandler(event)}
            />
          </div>
        </div>
      </>
    );
  } else {
    router.push('/');
  }
}
