'use client'
import { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteForever from '@mui/icons-material/DeleteForever';
import AddBox from '@mui/icons-material/AddBox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { recipes } from '../../../prisma/recipes';
import { restaurants } from '../../../prisma/restaurants';
import { Favorite } from '@mui/icons-material';

export default function findFoods() {

    const [searchInput, setSearchInput] = useState('');
    const [foods, setFoods] = useState([]);
    const [userLat, setUserLat] = useState('');
    const [userLng, setUserLng] = useState('');
    const [recipeIsLoading, setRecipeIsLoading] = useState(true);
    const [restaurantIsLoading, setRestaurantIsLoading] = useState(true);
    const [IsLoading, setIsLoading] = useState(true);
    const loadingItems = <CircularProgress/>;

    const handler = async function() {
        const response_recipes = await fetch('/api/recipes');
        const recipes = await response_recipes.json();
        setRecipeIsLoading(false);
        const response_restaurants = await fetch('/api/restaurants');
        const restaurants = await response_restaurants.json();
        setRestaurantIsLoading(false);
        setFoods(recipes.concat(restaurants));
    }
    
    useEffect(() => {
        handler();
    }, []);

    function doNothing(name){
        return 1;

    }

    function searchChanged(event){
        if (event.target.value)
            setSearchInput(event.target.value);
        else{
            handler();
            setSearchInput('')
        }
        searchFood()
      }

    function nameSearch(name, searchInput){
        var found = false;
        const inputNoSpaceAndLowerCase = (searchInput.replace(/\s+/g, '')).toLowerCase();
        const splitInputLowerCase = searchInput.toLowerCase().split(' ')
        const noSpaceAndLowerCase = (name.replace(/\s+/g, '')).toLowerCase();
        splitInputLowerCase.forEach((word) => {
            if (noSpaceAndLowerCase.includes(word)){
                found = true;
            }
        })
        return noSpaceAndLowerCase.includes(inputNoSpaceAndLowerCase) || found
    }
    function searchFood() {
        setFoods(foods.filter((food) => nameSearch(food.name, searchInput)));
    }

    function calculateDistance(lat1, lon1, lat2, lon2){
        // func to calc dist between 2 coords
    }

    function updateLat(event){
        setUserLat(event.target.value);
    }

    function updateLng(event){
        setUserLng(event.target.value);
    }
    const foodList = (restaurantIsLoading || recipeIsLoading) ? loadingItems : foods.map((food, index) => {
        let distance = calculateDistance(userLat, userLng, food.latitude, food.longitude);
        return (
            <ListItem key={index} secondaryAction={
                <IconButton edge="end" onClick={() => { /* your existing onClick function */ }} aria-label='Do Nothing'>
                    <Favorite />
                </IconButton>   
            }>  
                <ListItemButton>
                    <ListItemText primary={food.name} />
                    <ListItemText primary={food.priceRange} />
                    <ListItemText secondary={`Distance: ${distance} km`} />
                </ListItemButton>
            </ListItem>
        );
    });    

    return (
        <div>
            <TextField label="Latitude" fullWidth variant="outlined" value={userLat} onChange={updateLat}/> 
            <TextField label="Longitude" fullWidth variant="outlined" value={userLng} onChange={updateLng}/>
            <TextField label="Search For Food" fullWidth variant="outlined" value={searchInput} onChange={searchChanged}/> 
            <div><h2>Meals</h2></div>
            <List sx={{ width: '100%', maxWidth: 1500 }}>
                { foodList }
            </List>
        </div>
    )
}