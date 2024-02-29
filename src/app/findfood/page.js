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
        else{
            router.push(`/restaurants/${food.id}`)
        }
    }

    function resetSearch(){
        fetchFoods();
    }
    const foodList = IsLoading ? loadingItems: foods.map((food) => {
        if (status == 'authenticated'){
            return <ListItem
            secondaryAction={
                <IconButton edge="end" onClick={() => favoriteFood(food)} aria-label='Favorite Food'><FavoriteBorder/></IconButton>   
            }>  
                <ListItemButton onClick={() => (goToFood(food))}>
                    <ListItemText primary={food.name}/>
                    <ListItemText primary={food.priceRange}/>
                </ListItemButton>
            </ListItem>;
        }
        else{
            return <ListItem>
                <ListItemButton onClick={() => (goToFood(food))}>
                    <ListItemText primary={food.name}/>
                    <ListItemText primary={food.priceRange}/>
                </ListItemButton>
            </ListItem>;
        }
    });
    
    const favoriteList = IsLoading ? loadingItems: favorites.map((food) => {
        if (status == 'authenticated'){
            return( 
            <ListItem
            secondaryAction={
                <IconButton edge="end" onClick={() => unfavoriteFood(food)} aria-label='Unfavorite Food'><Favorite/></IconButton>   
            }>
                <ListItemButton onClick={() => (goToFood(food))}>
                    <ListItemText primary={food.name}/>
                    <ListItemText primary={food.priceRange}/>
                </ListItemButton>
            </ListItem>);
        }
    });   

    return(
        <div>
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
