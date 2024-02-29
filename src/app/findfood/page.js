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
import { Favorite, Restaurant } from '@mui/icons-material';

export default function findFoods() {

    const [searchInput, setSearchInput] = useState('');
    const [foods, setFoods] = useState([]);
    const [globalFoods, setglobalFoods] = useState([]);
    const [recipeIsLoading, setRecipeIsLoading] = useState(true);
    const [restaurantIsLoading, setRestaurantIsLoading] = useState(true);
    const [IsLoading, setIsLoading] = useState(true);
    const loadingItems = <CircularProgress/>;

    const [locallatitude, setLocalLatitude] = useState(null);
    const [locallongitude, setLocalLongitude] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
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
  
  }, []);
      
    
      

    const handler = async function() {
        const response_recipes = await fetch('/api/recipes');
        const recipes = await response_recipes.json();
        setRecipeIsLoading(false);
        const response_restaurants = await fetch('/api/restaurants');
        const restaurants = await response_restaurants.json();
        setRestaurantIsLoading(false);
        setFoods(recipes.concat(restaurants));
        setglobalFoods(recipes.concat(restaurants));
    }
    
    useEffect(() => {
        handler();
    }, []);

    function doNothing(name){
        return 1;

    }

    function searchChanged(event){
        setSearchInput(event.target.value);
        searchFood();
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
        if (foods.length && searchInput.length){
            setFoods(foods.filter((food) => nameSearch(food.name, searchInput)));
        }
        else if (foods.length == 0)
        {
            setFoods(globalFoods);
        }
        else{
            handler();
        }
    }

    function deg2rad(deg) {
        return deg * (Math.PI/180);
      }
      
      function getDistanceFromLatLonInMiles(lat1, lon1, lat2, lon2) {
        const earthRadius = 3958.8; // Radius of the Earth in miles
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c; // Distance in miles
        return distance;
      }


   // 35.29563278166948, -120.67837015960859
   // 35.26289912945568, -120.6774243085059 : MCdonalds
   // 35.293915501012656, -120.6722660632114 : Panda Express

    const foodList = (restaurantIsLoading || recipeIsLoading) ? loadingItems: foods.map((food, index) => {
        if (restaurants.some(restaruant => restaruant.name === food.name)) {
            const distance = getDistanceFromLatLonInMiles(locallatitude, locallongitude, 35.26289912945568, -120.6774243085059);
            return <ListItem key={index} secondaryAction={
                <IconButton edge="end" onClick={() => doNothing(food.name)} aria-label='Do Nothing'><Favorite/></IconButton>   
            }>  
                <ListItemButton>
                    <ListItemText primary={food.name}/>
                    <ListItemText primary={food.priceRange}/>
                    <ListItemText primary={distance}/>
                </ListItemButton>
            </ListItem>;
        }
        else {
        return <ListItem key={index} secondaryAction={
            <IconButton edge="end" onClick={() => doNothing(food.name)} aria-label='Do Nothing'><Favorite/></IconButton>   
        }>  
            <ListItemButton>
                <ListItemText primary={food.name}/>
                <ListItemText primary={food.priceRange}/>
            </ListItemButton>
        </ListItem>;
        }
    });    

    return(
        <div>
            <p>
          Latitude: {locallatitude}, Longitude: {locallongitude}
        </p>
        <TextField label="Search For Food" fullWidth variant="outlined" value={searchInput} onChange={searchChanged}/> 
        <button onClick={searchFood}>Search</button>
        <div><h2>Meals</h2></div>
        <>
            <List sx={{ width: '100%', maxWidth: 1500 }}>
                { foodList }
                {!(recipeIsLoading && restaurantIsLoading) && <ListItem key="food">
                </ListItem>}
            </List>
        </>
        </div>
    )
}
