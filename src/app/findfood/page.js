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
import { Favorite, FavoriteBorder } from '@mui/icons-material';
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
    const [user, setUser] = useState([])
    const [showFilters, setShowFilters] = useState(false);
    const [filterValue, setFilterValue] = useState(''); 


    const initialFetch = async function() {
        fetchFoods();
        fetchFavorites();
        fetchLocation();
        fetchUser()
        setIsLoading(false);
    }
    
    const fetchUser =  async function () {
        fetch("/api/users", { method: "get" }).then((response) => response.ok && response.json()).then(
            user => {
                user && setUser(user);
        });
    };

    const fetchFoods = async function () {
        fetch("/api/foods", { method: "get" }).then((res) => res.ok && res.json()).then(
            foods => {
                foods && setFoods(foods);
        });
    };

    const fetchFavorites = async function () {
        fetch("/api/favorite", { method: "get" }).then((res) => res.ok && res.json()).then(
            favorites => {
                favorites && setFavorites(favorites);
        });
    };
    
    useEffect(() => {
        initialFetch();
    }, []);

    const fetchLocation = async function() {
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
                fetchFoods();
                setFavorites([...favorites, food])
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
        fetch("/api/foods" + '?' + searchString, { method: "get" }).then((res) => res.ok && res.json()).then(
            foods => {
                foods && setFoods(foods);
        })
    };

    function goToFood(food){
        if (food.type == "recipe") {    
            router.push(`/recipes/${food.id}`)
        }
        else if (foods.length == 0)
        {
            setFoods(globalFoods);
        }
        else{
            router.push(`/restaurants/${food.id}`)
        }
    }

    function resetSearch(){
        fetchFoods();
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

    const foodList = IsLoading ? loadingItems: foods.map((food) => {
        if (food.type == "restaurant"){
            const restaurantLongitudeAndLatitude = food.location.split(',')
            var distance = getDistanceFromLatLonInMiles(locallatitude, locallongitude, restaurantLongitudeAndLatitude[0], restaurantLongitudeAndLatitude[1]);
        }
        else{
            var distance = null;
        }
        if (status == 'authenticated'){
            
            return (
                <Box key={food.id} className="food-item">
                    <img src={food.photo} alt={food.name} style={{ width: '50px', height: '50px', marginRight: '10px' }}/>
            <ListItem
            secondaryAction={
                <IconButton edge="end" onClick={() => favoriteFood(food)} aria-label='Favorite Food'><FavoriteBorder/></IconButton>   
            }>  
                <ListItemButton onClick={() => (goToFood(food))}>
                    <ListItemText primary={food.name}/>
                    <ListItemText primary={food.priceRange}/>
                    <ListItemText primary={distance}/>
                </ListItemButton>
            </ListItem>
            </Box>
            );
        }
        else{
            return (
                <Box key={food.id} className="food-item">
                    <img src={food.photo} alt={food.name} style={{ width: '50px', height: '50px', marginRight: '10px' }}/>
                <ListItem>
                <ListItemButton onClick={() => (goToFood(food))}>
                    <ListItemText primary={food.name}/>
                    <ListItemText primary={food.priceRange}/>
                    <ListItemText primary={distance}/>
                </ListItemButton>
            </ListItem>;
            </Box>
            );
        }
    });
  
    
    const favoriteList = IsLoading ? loadingItems: favorites.map((food) => {
        if (food.type == "restaurant"){
            const restaurantLongitudeAndLatitude = food.location.split(',')
            var distance = getDistanceFromLatLonInMiles(locallatitude, locallongitude, restaurantLongitudeAndLatitude[0], restaurantLongitudeAndLatitude[1]);
        }
        else{
            var distance = null;
        }
        if (status == 'authenticated'){
            return( 
            <ListItem
            secondaryAction={
                <IconButton edge="end" onClick={() => unfavoriteFood(food)} aria-label='Unfavorite Food'><Favorite/></IconButton>   
            }>
                <ListItemButton onClick={() => (goToFood(food))}>
                    <ListItemText primary={food.name}/>
                    <ListItemText primary={food.priceRange}/>
                    <ListItemText primary={distance}/>
                </ListItemButton>
            </ListItem>);
        }
    });   

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
                </List>
            </Drawer>
        <Button onClick={resetSearch} style={{ color: '#7F8E76' }}>Reset Search</Button>
        <p>
        Current Location: Latitude: {locallatitude}, Longitude: {locallongitude}</p>
        <div className="search-bar-container">
        <TextField label="Search For Food" fullWidth variant="outlined" value={searchInput} onChange={searchChanged} className="search-bar"/> 
        <button onClick={searchFood} >SEARCH</button>
        </div>
        <TextField label="Latitude" fullWidth variant="outlined" value={customLat} onChange={updateCustomLat}/>
        <TextField label="Longitude" fullWidth variant="outlined" value={customLng} onChange={updateCustomLng}/>
        <button onClick={updateLocation}>Use Location</button>
        {status == "authenticated" && <button onClick={useAccountLocation}>Get Account Location</button>}
            <List sx={{ width: '100%', maxWidth: 2000 }}>
                {status == "authenticated" && <h1>Favorite List</h1>}
                { favoriteList }
                <h1>Meals</h1>
                { foodList }
                {!(IsLoading) && <ListItem key="food">
                </ListItem>}
            </List>
        </div>
    )
}