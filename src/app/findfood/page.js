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
import { create } from 'domain';
import { useSession } from 'next-auth/react';



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
    const [error, setError] = useState(null);


    const initialFetch = async function() {
        fetchFoods();
        fetchFavorites();
        setIsLoading(false);
    }
      
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
        searchFood();
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

    const foodList = IsLoading ? loadingItems: foods.map((food) => {
        if (status == 'authenticated'){
            const distance = getDistanceFromLatLonInMiles(locallatitude, locallongitude, 35.26289912945568, -120.6774243085059);
            return <ListItem
            secondaryAction={
                <IconButton edge="end" onClick={() => favoriteFood(food)} aria-label='Favorite Food'><FavoriteBorder/></IconButton>   
            }>  
                <ListItemButton onClick={() => (goToFood(food))}>
                    <ListItemText primary={food.name}/>
                    <ListItemText primary={food.priceRange}/>
                    <ListItemText primary={distance}/>
                </ListItemButton>
            </ListItem>;
        }
        else{
            return <ListItem>
                <ListItemButton onClick={() => (goToFood(food))}>
                    <ListItemText primary={food.name}/>
                    <ListItemText primary={food.priceRange}/>
                    <ListItemText primary={distance}/>
                </ListItemButton>
            </ListItem>;
        }
    });
    
    const favoriteList = IsLoading ? loadingItems: favorites.map((food) => {
        const distance = getDistanceFromLatLonInMiles(locallatitude, locallongitude, 35.26289912945568, -120.6774243085059);
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

    return(
        <div>
            <p>
          Latitude: {locallatitude}, Longitude: {locallongitude}
        </p>
        <TextField label="Search For Food" fullWidth variant="outlined" value={searchInput} onChange={searchChanged}/> 
        <button onClick={searchFood}>Search</button>
        <button onClick={resetSearch}>Reset Search</button>
        <>
            <List sx={{ width: '100%', maxWidth: 1500 }}>
                {status == "authenticated" && <h1>Favorite List</h1>}
                { favoriteList }
                <h1>Meals</h1>
                { foodList }
                {!(IsLoading) && <ListItem key="food">
                </ListItem>}
            </List>
        </>
        </div>
    )
}
