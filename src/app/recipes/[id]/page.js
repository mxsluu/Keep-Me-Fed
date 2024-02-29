'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';
import Image from 'next/image'
import { redirect } from 'next/navigation';


export default function Recipe({ params }){
    const [recipe, setRecipe] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const { data: session, status }  = useSession();
    const loadingItems = <CircularProgress/>;

    const fetchRecipe = async function () {
        fetch("/api/recipes" + "?" + 'id=' + params.id, { method: "get" }).then((res) => res.ok && res.json()).then(
            recipe => {
                recipe && setRecipe(recipe);
                setIngredients(recipe.ingredients)
                setLoading(false)
        });
    };

    
    
    useEffect(() => {
        fetchRecipe();
    }, []);


    const ingredientsList = loading ? loadingItems: ingredients.map((ingredient) => {
            return(
                <ul>
                    <li> 
                        <h4>Name: {ingredient.name}</h4>
                        <p>Price: ${ingredient.price}</p>
                        <p>Establishment: {ingredient.locationName}</p>
                        <p>Location: {ingredient.location}</p>
                    </li>                  
                </ul>
            )
    });

    const instructions = loading ? loadingItems: recipe.instructions.map((step) => {
        return(
            <h4>{step}</h4>
        )
    });

    if (loading){
        return <div> {loadingItems} </div>
    }
    else{
        if (status == "authenticated"){
            return(
                <div>
                <Link href="./../findfood">Back</Link>
                <br></br>
                <div><h1>{recipe.name}</h1></div>
                <div><h3>{recipe.genre}</h3></div>
                <div><h3>{recipe.cookTime} minutes to prepare and cook</h3></div>
                <div><h3>{recipe.priceRange}</h3></div>
                <div><h3> Ingredients </h3></div>
                <div>{ ingredientsList }</div>
                <div><h3> Instructions </h3></div>
                <div>{ instructions }</div>
                <br></br>
                <Image
                    src= {recipe.photo}
                    width={350}
                    height={350}
                />
            </div>
            )
        }
        else{
            return(
                <div>
                <Link href="./../findfood">Back</Link>
                <br></br>
                <div><h1>{recipe.name}</h1></div>
                <div><h3>{recipe.genre}</h3></div>
                <div><h3>{recipe.cookTime} minutes to prepare and cook</h3></div>
                <div><h3>{recipe.priceRange}</h3></div>
                <div><h3> Ingredients </h3></div>
                <div>{ ingredientsList }</div>
                <div><h3> Instructions </h3></div>
                <div>{ instructions }</div>
                <br></br>
                <Image
                    src= {recipe.photo}
                    width={350}
                    height={350}
                />
            </div>
            )
        }
    }
}