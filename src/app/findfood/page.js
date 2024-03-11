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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';


import './styles.css';

export default function findFoods() {
    const router = useRouter()
    const [searchInput, setSearchInput] = useState('');
    const [resetSearchButton, setResetSearchButton] = useState(false);
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
    const [budgetFilter, setBudgetFilter] = useState(true)
    const [timeFilter, setTimeFilter] = useState(true)
    const [sortOption, setSortOption] = useState('')
    const [sortQuery, setSortQuery] = useState({sortType: null, sortOrder: null}) 
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState(false);
    const [schedule, setSchedule] = useState([]);
    
   // Initial visit to site will call initialFetch and will not run on subsequent rerenders 
    useEffect(() => {
        initialFetch()
    }, []);

    // Only update food list if filters, favorites or location changes
    // Also update food if reset search button is clicked
    useEffect(() => {
        if (locallatitude != null && locallongitude != null){
            updateFoods()
        }
    }, [filters, favorites, locallatitude, locallongitude, resetSearchButton]);

    // Only fetch favorites (to recalculate distances) if location changes
    // Observe user changes in order to fetchfavorites only if favorite list is loaded
    useEffect(() => {
        if (locallatitude != null && locallongitude != null && user != null){
            fetchFavorites();
        }
    }, [locallatitude, locallongitude, user]);
    
    
    // Initial FETCH
    const initialFetch = async function() {
        fetchLocation()
        const userResponse = await fetch("/api/users", { method: "get" })
        if (userResponse.ok){
            const user = await userResponse.json();
            // Get and set user as well as daily budget and schedule
            setUser(user);
            const daily = Number(user.budget / 7).toFixed(2)
            setDailyBudget(daily)
            setSchedule(user.busyblocks)
        }
        else{
            // If not a user then just update foods
            updateFoods();
        }
    }
    
    // Function that will make a GET request to foods API with search params
    const fetchFoods = function () {
        const searchString = createQueryString('search', searchInput)
        const budgetFilterString = createQueryString('budgetFilter', budgetFilter)
        const timeFilterString = createQueryString('timeFilter', timeFilter)
        const longitude = createQueryString('longitude', locallongitude)
        const latitude = createQueryString('latitude', locallatitude)
        const sortType = createQueryString('sortType', sortQuery.sortType)
        const sortOrder = createQueryString('sortOrder', sortQuery.sortOrder)
        return fetch("/api/foods?" + "&" + searchString + "&" + budgetFilterString + "&" + timeFilterString + "&" + longitude + "&" + latitude
                + "&" + sortType + "&" + sortOrder, { method: "get" })
    }

    // Async function that updates the list of foods and set loading to false
    async function updateFoods() {
        const foodsResponse = await fetchFoods()
        if (foodsResponse.ok){
            const foods = await foodsResponse.json();
            setFoods(foods)
            setIsLoading(false);
        }
    };

    // Function that will make a GET request to favorites API with search param of user location (calculates distances for favorites)
    // Updates the list of favorites
    const fetchFavorites = function () {
        const longitude = createQueryString('longitude', locallongitude)
        const latitude = createQueryString('latitude', locallatitude)
        fetch("/api/favorite?" + longitude + "&" + latitude , { method: "get" }).then((res) => res.ok && res.json()).then(
            favorites => {
                setFavorites(favorites);
        });
    };


    // Function to get current location
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

    // Async function that makes a PUT request to favorites API that updates the list of favorites tied to user
    // Updates the list of favorites
    async function favoriteFood(food){
        const favoriteReponse = await fetch("/api/favorite", {method: 'put', body: JSON.stringify({food, option: "favorite"})})
        if (favoriteReponse.ok){
            fetchFavorites();
        }
    }

    // Async function that makes a PUT request to favorites API that updates the list of favorites tied to user
    // Updates the list of favorites
    async function unFavoriteFood(food){
        const unFavoriteReponse = await fetch("/api/favorite/", {method: 'put', body: JSON.stringify({food, option: "unfavorite"})})
        if (unFavoriteReponse.ok){
            fetchFavorites();
        }
    }

    // Handler for favorite button
    function favoriteFoodHandler(food) {
        favoriteFood(food);
    };

    // Handler for unfavorite button
    function unFavoriteFoodHandler(food) {
        unFavoriteFood(food);
    };

    // Helper function for creating search params strings
    const createQueryString = useCallback(
        (name, value) => {
          const params = new URLSearchParams(searchParams)
          params.set(name, value)
          return params.toString()
        },
        [searchParams]
      )

    // Observe changes in search text box and update search value
    function searchChanged(event){
        setSearchInput(event.target.value);
      }
    
    // Update food list of search food button is clicked
    function searchFoodHandler() {
        updateFoods();
    };

    // When a sort selection is made, set the search params values for fetching foods
    function sortHandler(event){
        setSortOption(event.target.value)
        switch (event.target.value){
            case 0:
                setSortQuery({sortType: 'price', sortOrder: 'a'})
                break
            case 1:
                setSortQuery({sortType: 'price', sortOrder: 'd'})
                break
            case 2:
                setSortQuery({sortType: 'time', sortOrder: 'a'})
                break
            case 3:
                setSortQuery({sortType: 'time', sortOrder: 'd'})
                break
            case 4:
                setSortQuery({sortType: 'distance', sortOrder: 'a'})
                break
            case 5:
                setSortQuery({sortType: 'distance', sortOrder: 'd'})
                break     
        }
    }

    // If budget filter is clicked, then handle event
    const toggleBudgetFilter = (event) => {
        setBudgetFilter(event.target.checked)
    };

    // If time filter is clicked, then handle event
    const toggleTimeFilter = (event) => {
        setTimeFilter(event.target.checked)
    };

    // Master handler for all filters (will rerender the page if this is set)
    const filterHandler = () => {
        setFilters(!filters)
    }

    // Handler for when a food is clicked (redirects to unique page for restaurants and recipes)
    function goToFood(food){
        if (food.type == "recipe") {    
            router.push(`/recipes/${food.id}`)
        }
        else{
            router.push(`/restaurants/${food.id}`)
        }
    }

    // Handler for when a reset search button is clicked
    function resetSearchHandler(){
        setResetSearchButton(!resetSearchButton)
        setSearchInput('')
        setShowFilters(false)
        setSortQuery({sortType: null, sortOrder: null})
    }

    // Updaters for coordinates and location
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

    // Handler for click on "Use Account Location" button
    function useAccountLocation(){
        if (user.location != ''){
            const locationSplit = user.location.split(",")
            setCustomLat(locationSplit[0]);
            setCustomLng(locationSplit[1]);
        }
    }

    // Generates the food list 
    const foodList = () => {
        return foods.map((food) => {
        // If user, then display favorite button
        if (status == 'authenticated'){         
            return (
            <ListItem>  
                <Box key={food.id} className="food-item">
                <IconButton edge="end" onClick={() => favoriteFoodHandler(food)} aria-label='Favorite Food'><FavoriteBorder/></IconButton>
                <ListItemButton onClick={() => (goToFood(food))}>
                    <ListItemText primary={
                        <div>
                        <h3>{food.name}</h3>
                        <p>Price Range: {'$'.repeat(food.priceRange)}</p>
                        <p>Distance: {Number(food.distance).toFixed(2)} miles</p>
                        <p>Time needed: {Number(food.cookTime + 30).toFixed(2)} mins</p>
                        </div>
                    }/>
                  <img src={food.photo} alt={food.name} style={{ width: '200px', height: '200px', marginRight: '10px'}}/>
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
                        <p>Distance: {Number(food.distance).toFixed(2)} miles</p>
                        <p>Time needed: {Number(food.cookTime + 30).toFixed(2)} mins</p>
                        </div>
                    }/>
                    <img src={food.photo} alt={food.name} style={{ width: '200px', height: '200px', marginRight: '10px' }}/>
                </ListItemButton>
            </Box>
            </ListItem>
            );}
        });
    }

    const favoriteList = () => {
        return favorites.map((food) => {
            // If user, then display unfavorite button
            if (status == 'authenticated'){
                return (
                <ListItem>
                <Box key={food.id} className="food-item">
                <IconButton edge="end" onClick={() => unFavoriteFoodHandler(food)} aria-label='Favorite Food'><Favorite/></IconButton>     
                    <ListItemButton onClick={() => (goToFood(food))}>
                        <ListItemText primary={
                            <div>
                            <h3>{food.name}</h3>
                            <p>Price Range: {'$'.repeat(food.priceRange)}</p>
                            <p>Distance: {Number(food.distance).toFixed(2)} miles</p>
                            <p>Time needed: {Number(food.cookTime + 30).toFixed(2)} mins</p>
                            </div>
                        }/>
                    <img src={food.photo} alt={food.name} style={{ width: '200px', height: '200px', marginRight: '10px' }}/>
                    </ListItemButton>
                    </Box>
                </ListItem>
                );
            }
        });
    }   

    // Helper function for displaying budget
    function displayBudget(){
        if (!IsLoading){
            return(
                <p>Daily Budget: ${dailyBudget} </p>
            )
        }
        else{
            return(loadingItems)
        }
    }

    // Helper function for displaying free time in hours and minutes
    function displayFreeTime(){
        if (!IsLoading){
            const freeTime = calculateFreeTime(schedule)
            const hours = Math.floor(freeTime/60)
            const minutes = Number(freeTime % 60).toFixed(0)
            return(
                <p>Free Time: {hours} hours {minutes} minutes </p>
            )
            }
        else{
            return(loadingItems)
        }
    }

    // Returns the free time of a user
    function calculateFreeTime(schedule) {
        const currentdate = new Date();
        //Filter out all days of schedule until relevant day
        const tempSche = schedule.filter(busyblock => {
            const date1 = new Date(busyblock.startTime);
            return (date1.getMonth() === currentdate.getMonth() && date1.getDate() === currentdate.getDate() && date1.getFullYear() === currentdate.getFullYear()); 
    })
    
        tempSche.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        //Loop until you get to next available busyblock
        let busyIndex = 0;
        while (busyIndex < tempSche.length)
        {
            const blockStartTime = new Date(tempSche[busyIndex].startTime);
            const blockEndTime = new Date(tempSche[busyIndex].endTime);
            if (currentdate >= blockStartTime && currentdate <= blockEndTime){
                return 0;
            }
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
            return Number((nextBusyTime - currentdate) / 60000).toFixed(2);
        }
      };

    return (
        <div className="food">
        <Button onClick={() => setShowFilters(!showFilters)}  style={{ color: '#7F8E76' }}>Show Filters</Button>
            <Drawer anchor="left" variant="temporary" open={showFilters} onClose={() => setShowFilters(false)}>
                <List>
                    <ListItem>
                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                        <InputLabel id="demo-simple-select-autowidth-label">Sort by</InputLabel>
                        <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={sortOption}
                        onChange={sortHandler}
                        autoWidth
                        label="Sort by"
                        >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={0}>Price Ascending </MenuItem>
                        <MenuItem value={1}>Price Descending</MenuItem>
                        <MenuItem value={2}>Time Ascending</MenuItem>
                        <MenuItem value={3}>Time Descending </MenuItem>
                        <MenuItem value={4}>Distance Ascending</MenuItem>
                        <MenuItem value={5}>Distance Descending</MenuItem>
                        </Select>
                    </FormControl>
                    </ListItem>
                    <ListItem>
                        {status == "authenticated" &&
                        <FormGroup>
                            <FormControlLabel 
                                control={<Switch
                                        checked={budgetFilter}
                                        onChange={toggleBudgetFilter}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                />}
                                label="Budget Filter"
                            />
                        </FormGroup>
                        }
                    </ListItem>
                    <ListItem>
                        {status == "authenticated" &&
                        <FormGroup>
                            <FormControlLabel 
                                control={<Switch
                                        checked={timeFilter}
                                        onChange={toggleTimeFilter}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                />}
                                label="Time Filter"
                            />
                        </FormGroup>
                        }
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" style={{ backgroundColor: '#7F8E76',display: 'flex', justifyContent: 'center' , marginLeft:'35px'}} onClick={filterHandler}>Apply Filters</Button>
                    </ListItem>
                </List>
            </Drawer>
        <Button onClick={resetSearchHandler} style={{ color: '#7F8E76' }}>Reset Search</Button>

        {status == "authenticated" && displayBudget()}
        {status == "authenticated" && displayFreeTime()}
        {IsLoading ? loadingItems : <p>Current Location: Latitude: {locallatitude}, Longitude: {locallongitude}</p>}
        <List sx={{ width: '50%', maxWidth: 1500 }}>
            {IsLoading ? loadingItems : status == "authenticated" && <h2>Favorites</h2>}
            {status == "authenticated" && favoriteList() }
        </List>
        <div className="search-bar-container">
        <TextField label="Search For Food" fullWidth variant="outlined" value={searchInput} onChange={searchChanged} className="search-bar"/> 
        <button onClick={searchFoodHandler} >SEARCH</button>
        </div>
        <div className="search-bar-container">
        <TextField label="Latitude"  variant="outlined" value={customLat} onChange={updateCustomLat} className="search-bar"/>
        <TextField label="Longitude"  variant="outlined" value={customLng} onChange={updateCustomLng} className="search-bar"/>
        {status == "authenticated" && <button onClick={useAccountLocation}>Get Account Location</button>}
        <button onClick={updateLocation}>Use Location</button>
        </div>
            <List sx={{ width: '100%', maxWidth: 2000 }}>
                <h1>Meals</h1>
                { IsLoading ? loadingItems : foodList() }
            </List>
        </div>
    )
}