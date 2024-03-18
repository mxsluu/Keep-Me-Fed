'use client'

import { usePathname } from 'next/navigation'
import { Box, Button } from '@mui/material';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function NavBar() {
  const pathname = usePathname();
  const { data: session, status }  = useSession();
  var links = [
    { path: '/', name: 'Home' }, 
    { path: '/findfood', name: 'Find Food' },
  ];
  if (status == 'authenticated'){
    links = [...links, { path: '/account', name: 'Account' }, { path: '/history', name: 'Meal History' }]
  }


  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
      { links.map(l => {
        const isActive = l.path === pathname;
        return (
          <Button component={Link}
                  href={l.path}
                  sx={{ my: 2, color: 'white', display: 'block', textDecoration: (isActive ? 'underline' : 'inherit') }}
                  key={l.path}
          >{l.name}</Button>
        )
      })}
    </Box>
  );
}
