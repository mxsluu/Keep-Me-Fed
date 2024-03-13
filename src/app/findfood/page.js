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
import { create } from 'domain';
import { useSession } from 'next-auth/react';
import DatePicker from 'react-datepicker';



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
    const [schedule, setSchedule] = useState([]);
    const [dailyBudget, setDailyBudget] = useState(0);
    const [limit, setLimit] = useState(0)

    const initialFetch = async function() {
        const userResponse = await fetch("/api/users", { method: "get" })
        if (userResponse.ok){
            const user = await userResponse.json();
            setUser(user);
            const daily = Number(user.budget / 7).toFixed(2)
            setDailyBudget(daily)
            const limit = calculatePriceRange(daily)
            setLimit(limit)
            setSchedule(user.busyblocks)
            const foodResponse = await fetch("/api/foods?" + createQueryString('limit', limit), { method: "get" })
            if (foodResponse.ok){
                const foods = await foodResponse.json();
                setFoods(foods)
                const favoriteResponse = await fetch("/api/favorite", { method: "get" })
                if (favoriteResponse.ok){
                    const favorites = await favoriteResponse.json()
                    setFavorites(favorites);
                }
            }
            fetchLocation();
            setIsLoading(false);
        }
        else{
            fetchFoods();
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
    
    const fetchFoods = async function () {
        await fetch("/api/foods?" + createQueryString('limit', limit), { method: "get" }).then((res) => res.ok && res.json()).then(
            foods => {
                foods && setFoods(foods);
        });
    };

    const fetchFavorites = async function () {
        await fetch("/api/favorite", { method: "get" }).then((res) => res.ok && res.json()).then(
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
    async function favoriteFood(food){
        await fetch("/api/favorite", {method: 'put', body: JSON.stringify({food})}).then((res) => {
            if(res.ok) {
                fetchFoods();
                setFavorites([...favorites, food])
            }
        });
    }

    async function unfavoriteFood(food){
        await fetch("/api/favorite/", {method: 'PATCH', body: JSON.stringify({food})}).then((res) => {
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
    

    async function searchFood() {
        const searchString = createQueryString('search', searchInput)
        await fetch("/api/foods" + '?' + searchString + '&' + createQueryString('limit', limit) , { method: "get" }).then((res) => res.ok && res.json()).then(
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
        const freeTime = scheduleFilter(schedule);
        console.log(freeTime);
        foods.filter(food => {
            return freeTime <= food.cookTime
        })
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
            return <ListItem
            secondaryAction={
                <IconButton edge="end" onClick={() => favoriteFood(food)} aria-label='Favorite Food'><FavoriteBorder/></IconButton>   
            }>  
                <ListItemButton onClick={() => (goToFood(food))}>
                    <ListItemText primary={food.name}/>
                    <ListItemText primary={'$'.repeat(food.priceRange)}/>
                    <ListItemText primary={distance}/>
                    <ListItemText primary={Number(30 + time).toFixed(2)}/>
                </ListItemButton>
            </ListItem>;
        }
        else{
            return <ListItem>
                <ListItemButton onClick={() => (goToFood(food))}>
                    <ListItemText primary={food.name}/>
                    <ListItemText primary={'$'.repeat(food.priceRange)}/>
                    <ListItemText primary={distance}/>
                    <ListItemText primary={Number(30 + time).toFixed(2)}/>
                </ListItemButton>
            </ListItem>;
        }
    });

    function scheduleFilter(schedule) {
        const currentdate = new Date();
        //Filter out all days of schedule until relevant day
        const tempSche = schedule.filter(busyblock => {
            const date1 = new Date(busyblock.startTime);
            return (date1.getMonth() === currentdate.getMonth() && date1.getDate() === currentdate.getDate() && date1.getFullYear() === currentdate.getFullYear()); 
    })

        tempSche.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        console.log(tempSche);

        //Loop until you get to next available busyblock
        let busyIndex = 0;
        while (busyIndex < tempSche.length)
        {
            const blockStartTime = new Date(tempSche[busyIndex].startTime);
            if (blockStartTime > currentdate)
            {
                break;
            }
            busyIndex++;
        }

        //Get the amount of time till next busyblock
        if (busyIndex == tempSche.length)
        {
            const endDay = new Date(new Date().setHours(23, 59, 59, 999));
            return (endDay - currentdate) / 60000;
        }
        else 
        {
            const nextBusyTime = new Date(tempSche[busyIndex].startTime);
            return (nextBusyTime - currentdate) / 60000;
        }
    };
    
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
            return( 
            <ListItem
            secondaryAction={
                <IconButton edge="end" onClick={() => unfavoriteFood(food)} aria-label='Unfavorite Food'><Favorite/></IconButton>   
            }>
                <ListItemButton onClick={() => (goToFood(food))}>
                    <ListItemText primary={food.name}/>
                    <ListItemText primary={'$'.repeat(food.priceRange)}/>
                    <ListItemText primary={distance}/>
                    <ListItemText primary={Number(30 + time).toFixed(2)}/>
                </ListItemButton>
            </ListItem>);
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
        <div>
        {status == "authenticated" && displayBudget()}
        {IsLoading ? loadingItems: <p>Current Location: Latitude: {locallatitude}, Longitude: {locallongitude}</p>}
        <TextField label="Search For Food" fullWidth variant="outlined" value={searchInput} onChange={searchChanged}/> 
        <button onClick={searchFood}>Search</button>
        <button onClick={resetSearch}>Reset Search</button>
        <button onClick={sortPriceAsc}>Sort by Price Ascending</button>
        <button onClick={sortPriceDesc}>Sort by Price Descending</button>
        <button onClick={sortTimeAsc}>Sort by Time Ascending</button>
        <button onClick={sortTimeDesc}>Sort by Time Descending</button> 
        <button onClick={sortDistanceAsc}>Sort by Distance Ascending</button>
        <button onClick={sortDistanceDesc}>Sort by Distance Descending</button>
        <TextField label="Latitude" fullWidth variant="outlined" value={customLat} onChange={updateCustomLat}/>
        <TextField label="Longitude" fullWidth variant="outlined" value={customLng} onChange={updateCustomLng}/>
        <button onClick={updateLocation}>Use Location</button>
        {status == "authenticated" && <button onClick={useAccountLocation}>Get Account Location</button>}
            <List sx={{ width: '100%', maxWidth: 1500 }}>
                {status == "authenticated" && <h1>Favorite List</h1>}
                {status == "authenticated" && favoriteList }
                <h1>Meals</h1>
                { foodList }
                {!(IsLoading) && <ListItem key="food">
                </ListItem>}
            </List>
        </div>
    )
}