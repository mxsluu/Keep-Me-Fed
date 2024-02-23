'use client'
import Link from 'next/link';
import Image from 'next/image';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import Signup from './Signup'; // import the Signup component
import { useSession } from 'next-auth/react';

export default function Home() {
  // Define the style for the cards here to avoid repetition
  const cardStyle = {
    width: '400px', // Increase the width
    height: '250px', // Increase the height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // This will space out the content and actions
    backgroundColor: '#ADD8E6', 
  };
  const { data: session, status }  = useSession();
  if (status != 'authenticated'){
        return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', padding: '2rem' }}>
            <Card style={cardStyle}>
            <CardContent>
                <Typography variant="h5" component="div">
                Want a curated experience?
                </Typography>
                <Typography variant="body2">
                Sign up now!
                </Typography>
            </CardContent>
            <CardActions>
                <Signup /> {/* Use the Signup component directly instead of Link */}
            </CardActions>
            </Card>

            <Card style={cardStyle}>
            <CardContent>
                <Typography variant="h5" component="div">
                Just want to search for meals?
                </Typography>
                <Typography variant="body2">
                No problem!
                </Typography>
            </CardContent>
            <CardActions>
                <Link href="/findfood" passHref>
                <Button size="small" variant="contained">Find Food</Button>
                </Link>
            </CardActions>
            </Card>
        </div>
        )
  }
    else{
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', padding: '2rem' }}>
              <Card style={cardStyle}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Welcome {session.user.email.slice(0, session.user.email.length - 10)}!
                  </Typography>
                  <Typography variant="body2">
                    Check out your account.
                  </Typography>
                </CardContent>
                <CardActions>
                <Link href="/account" passHref>
                    <Button size="small" variant="contained">Account</Button>
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
                    <Button size="small" variant="contained">Find Food</Button>
                  </Link>
                </CardActions>
              </Card>
            </div>
          )
    }
}





// export default function Home() {
//   return (
//     <>
//       <h1>Welcome to CSC 307</h1>
//       <p>
//         This application is a Next.js application. It already contains a way to login and sign-up as well as a rough ToDo list application as a way to demonstrate create and update of a todo. 
//       </p>
//       <h2>Documentation</h2>
//       <ul>
//         <li>NextJS: <a href="https://nextjs.org/docs">https://nextjs.org/docs</a></li>
//         <li>Material UI: <a href="https://mui.com/material-ui/getting-started/">https://mui.com/material-ui/getting-started/</a></li>
//         <li>Prisma: <a href="https://www.prisma.io/docs/getting-started">https://www.prisma.io/docs/getting-started</a></li>
//       </ul>
//       <h2></h2>
//     </>
//   )
// }
