'use client'
import { useState, useEffect, useCallback } from 'react';
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
import { CollectionsBookmarkOutlined, Favorite, FavoriteBorder } from '@mui/icons-material';
import { useSearchParams, useRouter } from 'next/navigation'
import { Drawer,   Button ,Box} from '@mui/material';
import { create } from 'domain';
import { useSession } from 'next-auth/react';

import './styles.css';



export default function findFoods() {
    const router = useRouter()
    const [searchInput, setSearchInput] = useState('');
    const [foods, setFoods] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [IsLoading, setIsLoading] = useState(true);
    const loadingItems = <CircularProgress/>;
    const searchParams = useSearchParams()
    const { data: session, status }  = useSession();
    const [locallatitude, setLocalLatitude] = useState(null);
    const [locallongitude, setLocalLongitude] = useState(null);
    const [customLat, setCustomLat] = useState('');
    const [customLng, setCustomLng] = useState('');
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [dailyBudget, setDailyBudget] = useState(0);
    const [limit, setLimit] = useState(0)
    const [showFilters, setShowFilters] = useState(false);
    const [filterValue, setFilterValue] = useState(''); 


    const initialFetch = async function() {
        const userResponse = await fetch("/api/users", { method: "get" })
        if (userResponse.ok){
            const user = await userResponse.json();
            setUser(user);
            const daily = Number(user.budget / 7).toFixed(2)
            setDailyBudget(daily)
            const limit = calculatePriceRange(daily)
            setLimit(limit)
            const foodResponse = await fetch("/api/foods?" + createQueryString('limit', limit), { method: "get" })
            if (foodResponse.ok){
                const foods = await foodResponse.json();
                setFoods(foods)
                const favoriteResponse = await fetch("/api/favorite", { method: "get" })
                if (favoriteResponse.ok){
                    const favorites = await favoriteResponse.json()
                    setFavorites(favorites);
                    fetchLocation();
                    setIsLoading(false);
                }
            }
        }
        else{
            fetchFoods().then((foods) => setFoods(foods));
            fetchLocation();
            setIsLoading(false);
        }
    }

    function calculatePriceRange(budget){
        if (budget >= 0 && budget <= 10){
            return 1;
        }
        else if (budget > 10 && budget <= 20){
            return 2;
        }
        else if (budget > 20){
            return 3;
        }
        else{
            return 0;
        }   
    }
    
    const fetchFoods = function () {
        return fetch("/api/foods?" + createQueryString('limit', limit), { method: "get" }).then((res) => res.ok && res.json())
    }
    const fetchFavorites = function () {
        fetch("/api/favorite", { method: "get" }).then((res) => res.ok && res.json()).then(
            favorites => {
                favorites && setFavorites(favorites);
        });
    };
    
    useEffect(() => {
        initialFetch();
    }, []);

    const fetchLocation = function() {
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
    function favoriteFood(food){
        fetch("/api/favorite", {method: 'put', body: JSON.stringify({food})}).then((res) => {
            if(res.ok) {
                fetchFoods().then((foods) => {
                    setFoods(foods)
                    setFavorites([...favorites, food]);
                });
                
            }
        });
    }

    function unfavoriteFood(food){
        fetch("/api/favorite/", {method: 'PATCH', body: JSON.stringify({food})}).then((res) => {
            if(res.ok) {
                setFoods([...foods, food])
                fetchFavorites()
            }
        });
    }

    const createQueryString = useCallback(
        (name, value) => {
          const params = new URLSearchParams(searchParams)
          params.set(name, value)
          return params.toString()
        },
        [searchParams]
      )

    function searchChanged(event){
        setSearchInput(event.target.value);
      }
    

    function searchFood() {
        const searchString = createQueryString('search', searchInput)
        fetch("/api/foods" + '?' + searchString + '&' + createQueryString('limit', limit) , { method: "get" }).then((res) => res.ok && res.json()).then(
            foods => {
                foods && setFoods(foods);
        })
    };

    function sortPriceAsc() {
        foods.sort((foodA, foodB) => foodA.priceRange - foodB.priceRange)
        setFoods([...foods])
    };

    function sortPriceDesc() {
        foods.sort((foodA, foodB) => foodB.priceRange - foodA.priceRange)
        setFoods([...foods])
    };

    function sortTimeAsc() {
        foods.sort((foodA, foodB) => foodA.cookTime - foodB.cookTime)
        setFoods([...foods])
    };

    function sortTimeDesc() {
        foods.sort((foodA, foodB) => foodB.cookTime - foodA.cookTime)
        setFoods([...foods])
    };

    function sortDistanceAsc() {
        foods.sort((foodA, foodB) => foodA.distance - foodB.distance)
        setFoods([...foods])
    };

    function sortDistanceDesc() {
        foods.sort((foodA, foodB) => foodB.distance - foodA.distance)
        setFoods([...foods])
    };


    function goToFood(food){
        if (food.type == "recipe") {    
            router.push(`/recipes/${food.id}`)
        }
        else{
            router.push(`/restaurants/${food.id}`)
        }
    }

    function resetSearch(){
        fetchFoods().then((foods) => setFoods(foods));
    }

    function updateCustomLat(event){
        setCustomLat(event.target.value);
    }

    function updateCustomLng(event){
        setCustomLng(event.target.value);
    }

    function updateLocation(){
        if (customLat && customLng){
            setLocalLatitude(customLat);
            setLocalLongitude(customLng);
        }
        else{
            fetchLocation();
        }
    };

    function useAccountLocation(){
        if (user.location != ''){
            const locationSplit = user.location.split(",")
            setCustomLat(locationSplit[0]);
            setCustomLng(locationSplit[1]);
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


    const foodList = () => {
        return foods.map((food) => {
        if (food.type == "restaurant"){
            const restaurantLongitudeAndLatitude = food.location.split(',')
            var distance = getDistanceFromLatLonInMiles(locallatitude, locallongitude, restaurantLongitudeAndLatitude[0], restaurantLongitudeAndLatitude[1]);
            var time = (distance / 18.6) * 60
            food.cookTime = time
            food.distance = distance
        }
        else{
            var distance = 0
            var time = food.cookTime
            food.distance = 0
        }
        if (status == 'authenticated'){         
            return (
            <ListItem>  
                <IconButton edge="end" onClick={() => favoriteFood(food)} aria-label='Favorite Food'><FavoriteBorder/></IconButton>
                <Box key={food.id} className="food-item">
                <ListItemButton onClick={() => (goToFood(food))}>
                    <ListItemText primary={
                        <div>
                        <h3>{food.name}</h3>
                        <p>Price Range: {'$'.repeat(food.priceRange)}</p>
                        <p>Distance: {Number(distance).toFixed(2)} miles</p>
                        <p>Time needed: {Number(30 + time).toFixed(2)} mins</p>
                        </div>
                    }/>
                  <img src={food.photo} alt={food.name} style={{ width: '75px', height: '75px', marginRight: '10px'}}/>
                </ListItemButton>
                </Box>
            </ListItem>
            );
        }
        else{
            return (
                <ListItem>
                <Box key={food.id} className="food-item">
                <ListItemButton onClick={() => (goToFood(food))}>
                    <ListItemText primary={
                        <div>
                        <h3>{food.name}</h3>
                        <p>Price Range: {'$'.repeat(food.priceRange)}</p>
                        <p>Distance: {Number(distance).toFixed(2)} miles</p>
                        <p>Time needed: {Number(30 + time).toFixed(2)} mins</p>
                        </div>
                    }/>
                    <img src={food.photo} alt={food.name} style={{ width: '75px', height: '75px', marginRight: '10px' }}/>
                </ListItemButton>
            </Box>
            </ListItem>
            );
        }
    });
}
    
    const favoriteList = IsLoading ? loadingItems: favorites.map((food) => {
        if (food.type == "restaurant"){
            const restaurantLongitudeAndLatitude = food.location.split(',')
            var distance = getDistanceFromLatLonInMiles(locallatitude, locallongitude, restaurantLongitudeAndLatitude[0], restaurantLongitudeAndLatitude[1]);
            var time = (distance / 18.6) * 60
            food.cookTime = time
            food.distance = distance
        }
        else{
            var distance = 0
            var time = food.cookTime
            food.distance = 0
        }
        if (status == 'authenticated'){
            return (
            <ListItem>
            <Box key={food.id} className="food-item">
            <IconButton edge="end" onClick={() => unfavoriteFood(food)} aria-label='Favorite Food'><Favorite/></IconButton>     
                <ListItemButton onClick={() => (goToFood(food))}>
                    <ListItemText primary={
                        <div>
                        <h3>{food.name}</h3>
                        <p>Price Range: {'$'.repeat(food.priceRange)}</p>
                        <p>Distance: {Number(distance).toFixed(2)} miles</p>
                        <p>Time needed: {Number(30 + time).toFixed(2)} mins</p>
                        </div>
                    }/>
                  <img src={food.photo} alt={food.name} style={{ width: '75px', height: '75px', marginRight: '10px'}}/>
                </ListItemButton>
                </Box>
            </ListItem>
            );
        }
    });   

    function displayBudget(){
        if (!IsLoading){
            return(
                <p>Daily Budget: {dailyBudget} </p>
            )
        }
        else{
            return(loadingItems)
        }
    }
   // 35.29563278166948, -120.67837015960859
   // 35.26289912945568, -120.6774243085059 : MCdonalds
   // 35.293915501012656, -120.6722660632114 : Panda Express

    return (
        <div className="food">
        <Button onClick={() => setShowFilters(!showFilters)}  style={{ color: '#7F8E76' }}>Show Filters</Button>
            <Drawer anchor="left" variant="temporary" open={showFilters} onClose={() => setShowFilters(false)}>
                <List>
                    <ListItem>
                        <TextField
                            label="Filter"
                            variant="outlined"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                        />
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" onClick={searchFood}>Apply Filters</Button>
                    </ListItem>
                    <ListItemButton onClick={() => (sortPriceAsc())}>
                        <ListItemText primary={<p>Sort by Price Ascending</p>}/>
                    </ListItemButton>
                    <ListItemButton onClick={() => (sortPriceDesc())}>
                        <ListItemText primary={<p>Sort by Price Descending</p>}/>
                    </ListItemButton>
                    <ListItemButton onClick={() => (sortTimeAsc())}>
                        <ListItemText primary={<p>Sort by Time Ascending</p>}/>
                    </ListItemButton>
                    <ListItemButton onClick={() => (sortTimeDesc())}>
                        <ListItemText primary={<p>Sort by Time Descending</p>}/>
                    </ListItemButton>
                    <ListItemButton onClick={() => (sortDistanceAsc())}>
                        <ListItemText primary={<p>Sort by Distance Ascending</p>}/>
                    </ListItemButton>
                    <ListItemButton onClick={() => (sortDistanceDesc())}>
                        <ListItemText primary={<p>Sort by Distance Descending</p>}/>
                    </ListItemButton>
                </List>
            </Drawer>
        <Button onClick={resetSearch} style={{ color: '#7F8E76' }}>Reset Search</Button>
        <p>
        {status == "authenticated" && displayBudget()}
        Current Location: Latitude: {locallatitude}, Longitude: {locallongitude}</p>
        <List sx={{ width: '50%', maxWidth: 1500 }}>
            {status == "authenticated" && <h2>Favorite List</h2>}
            {status == "authenticated" && favoriteList }
        </List>
        <div className="search-bar-container">
        <TextField label="Search For Food" fullWidth variant="outlined" value={searchInput} onChange={searchChanged} className="search-bar"/> 
        <button onClick={searchFood} >SEARCH</button>
        </div>
        <div className="search-bar-container">
        <TextField label="Latitude"  variant="outlined" value={customLat} onChange={updateCustomLat} className="search-bar"/>
        <TextField label="Longitude"  variant="outlined" value={customLng} onChange={updateCustomLng} className="search-bar"/>
        <button onClick={updateLocation}>Use Location</button>
        {status == "authenticated" && <button onClick={useAccountLocation}>Get Account Location</button>}
        </div>
            <List sx={{ width: '100%', maxWidth: 2000 }}>
                <h1>Meals</h1>
                { IsLoading ? loadingItems : foodList() }
            </List>
        </div>
    )
}