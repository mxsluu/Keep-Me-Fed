'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import  backpic from '/public/img/pexels-ella-olsson-1640777.png';

export default function Home() {

    const [hist, setHist] = useState([]);

    const handler = async function() {
        const response_hist = await fetch('/api/users');
        const user = await response_hist.json();
        const his = user.history

        setHist({...hist, his});
    }

    useEffect(() => {
        handler();
    }, []);

    console.log(hist, hist.length);

    /*
    // Initial FETCH
    const initialFetch = async function() {
        const userResponse = await fetch("/api/users", { method: "get" })
        if (userResponse.ok){
            const user = await userResponse.json();
            // Get and set user as well as daily budget and schedule
            setUser(user);
            const hist = user.history
            setDailyBudget(daily)
            setSchedule(user.busyblocks)
        }
        else{
        }
    }
    */


}
