'use client'
import Link from 'next/link';
import Image from 'next/image';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import Signup from './Signup'; // import the Signup component
import Login from './Login'; // import the Login component
import { useSession } from 'next-auth/react';
import  backpic from '/public/img/pexels-ella-olsson-1640777.png';
import { useState, useEffect } from 'react'; // Import useState hook

export default function Home() {
  // Define the style for the cards here to avoid repetition
  const cardStyle = {
    width: '400px', // Increase the width
    height: '250px', // Increase the height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // This will space out the content and actions
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    margin:'10px'
  };
  const containerStyle = {
    minHeight: '100vh', // Set minimum height to fill the viewport
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${backpic.src})`,
    backgroundSize: 'cover', 
    backgroundPosition: 'center',
    margin: 0
  };

  const { data: session, status }  = useSession();
  const [user, setUser] = useState([]);
  useEffect(() => {
    fetch("/api/users", { method: "get" }).then((response) => response.ok && response.json()).then(
        user => {
            user && setUser(user);
          }
      );
    }, [status]);

  if (status != 'authenticated'){
        return (
          <div style={containerStyle}>        
            <Card style={cardStyle}>
            <CardContent>
                <Typography variant="h5" component="div">
                Want a curated experience?
                </Typography>
                <Typography variant="body2">
                Sign up or log in now!
                </Typography>
            </CardContent>
            <CardActions>
                <Signup /> {/* Use the Signup component directly instead of Link */}
                <Login /> {/* Use the Login component directly instead of Link */}
            </CardActions>
            </Card>

            <Card style={cardStyle}>
            <CardContent>
                <Typography variant="h5" component="div">
                Just want to search for meals?
                </Typography>
                <Typography variant="body2">
                No problem! Start your search now
                </Typography>
            </CardContent>
            <CardActions>
                <Link href="/findfood" passHref>
                <Button size="small" variant="contained" style={{ color: 'white', backgroundColor: '#96A98B' }}>Find Food</Button>
                </Link>
            </CardActions>
            </Card>
        </div>
        ) 
  }
    else{
        return (
          <div style={containerStyle}>
              <Card style={cardStyle}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Welcome {user.username}!
                  </Typography>
                  <Typography variant="body2">
                    Check out your account.
                  </Typography>
                </CardContent>
                <CardActions>
                <Link href="/account" passHref>
                    <Button size="small" variant="contained" style={{ color: 'white', backgroundColor: '#96A98B' }}>Account</Button>
                  </Link>
                </CardActions>
              </Card>
        
              <Card style={cardStyle}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Hungry?
                  </Typography>
                  <Typography variant="body2">
                    Find meals here!
                  </Typography>
                </CardContent>
                <CardActions>
                  <Link href="/findfood" passHref>
                    <Button size="small" variant="contained" style={{ color: 'white', backgroundColor: '#96A98B' }}>Find Food</Button>
                  </Link>
                </CardActions>
              </Card>
            </div>
          )
    }
}