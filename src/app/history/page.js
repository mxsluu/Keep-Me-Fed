'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import  backpic from '/public/img/pexels-ella-olsson-1640777.png';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import {Box} from '@mui/material';
import List from '@mui/material/List';
import './styles.css';
import { useRouter } from 'next/navigation'


export default function Home() {
    const router = useRouter()
    const [hist, setHist] = useState([]);
    const [foods, setFoods] = useState([]);
    const { data: session, status }  = useSession();


    const handler = async function() {
        if (status == "authenticated"){
            const response_hist = await fetch('/api/history');
            const his = await response_hist.json();
            setHist({...hist, his});
            his.map((eaten) => {
                if (eaten.recipe != null || eaten.restaurant != null){
                    if (eaten.recipe != null){
                        const food = eaten.recipe
                        food["date"] = eaten.date;
                        food["type"] = "recipe";
                        food["price"] = eaten.price
                        setFoods((prevFoods) => [food, ...prevFoods])
                    }
                    else{
                        const food = eaten.restaurant
                        food["date"] = eaten.date;
                        food["type"] = "restaurant";
                        food["price"] = eaten.price;
                        setFoods((prevFoods) => [food, ...prevFoods])   
                    }
                }
            });
        }
    }
    function goToFood(food){
        if (food.type == "recipe") {    
            router.push(`/recipes/${food.id}`)
        }
        else{
            router.push(`/restaurants/${food.id}`)
        }
    }
<<<<<<< HEAD
        const foodList = () => {
            return foods.map((food) => {
            // If user, then display favorite button     
            return (
            <ListItem>  
                <Box key={food.id} className="food-item">
                <ListItemButton onClick={() => (goToFood(food))}>
                    <ListItemText primary={
                        <div>
                        <h3>{food.name}</h3>
                        <b>Date Eaten: </b> {(new Date(food.date)).toLocaleDateString()} 
                        <h4>Price: ${food.price.toFixed(2)} </h4>
                        </div>
                    }/>
                    <img src={food.photo} alt={food.name} style={{ width: '200px', height: '200px', marginRight: '10px'}}/>
                </ListItemButton>
                </Box>
            </ListItem>
            );
            })

=======
    const foodList = () => {
        return foods.map((food) => {
        // If user, then display favorite button     
        return (
        <ListItem className="food-item">  
            <Box key={food.id} >
            <ListItemButton onClick={() => (goToFood(food))}>
                <ListItemText primary={
                    <div>
                    <h3>{food.name}</h3>
                    <h4>Date Eaten: </h4><p>{(new Date(food.date)).toLocaleDateString()}</p>
                    </div>
                }/>
                <img src={food.photo} alt={food.name} style={{ width: '150px', height: '150px', marginRight: '10px'}}/>
            </ListItemButton>
            </Box>
        </ListItem>
        );
        })
>>>>>>> origin/history-ui
    }
    useEffect(() => {
        handler();
    }, []);
    if (status == "authenticated")
        return (
            <div className="food">
                <List sx={{ width: '100%', maxWidth: 2000 }}>
                    <h1>History</h1>
                    {foodList() }
                </List>
            </div>
        )
    else{
        router.push('/')
    }
}
