'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';
import Image from 'next/image'
import { redirect } from 'next/navigation';
import './styles.css';



export default function Recipe({ params }){
    const [recipe, setRecipe] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eaten, setEaten] = useState(false)
    const [costInput, setCostInput] = useState('')
    const [successOutput, setSuccessOutput] = useState('')
    const [success, setSuccess] = useState(false)
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


    function recordRecipe(){
        setEaten(true)
        return 0;
    }
    
    useEffect(() => {
        fetchRecipe();
    }, []);

    function updateCostInput(event){
        setCostInput(event.target.value);
    }

    // Async function that makes a PUT request to history API that updates the list of user's meal history
    const addBudget = () => {
        fetch(`/api/users/${session.user.id}}`, {method: 'put', body: JSON.stringify({budgetInput, locationInput: location})}).then((res) => {
          if(res.ok) {
            // Update isButtonClicked to true when the button is clicked
            setIsButtonClicked(true);
          }
      });
      };

    function adjustBudget(){
        if (0 <= parseFloat(costInput) && (!success)){
            setCostInput(Number(costInput).toFixed(2));
            setSuccessOutput('Budget Changed')
            setSuccess(true)
            fetch(`/api/adjustBudget/${session.user.id}}`, {method: 'put', body: JSON.stringify({cost: costInput})}).then((response) => response.ok && response.json())
            foodEaten();
            
        }
        else if (parseFloat(costInput) <= 0){
            setSuccessOutput('Cost cannot be negative')

        }
        else{
            setSuccessOutput('Error in changing budget or budget change already recorded')  
        }
    }

    const foodEaten= async ()=>{
    try{
        const response=await fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({date: new Date()})
        });
        if(!response.ok){
          throw new Error('Failed to create new Eaten History');
        } 
      }catch (error){
          console.error('Error creating eating history: ',error);
        }
    };

    function priceRangeCalculator(priceRange){
        if (priceRange == 1){
            return (
                <div><h3>Price Range: $0 - $10 </h3></div>
            )
        }
        else if (priceRange == 2){
            return (
                <div><h3>Price Range: $11 - $20 </h3></div>
            )
        }
        else{         
            return (
                    <div><h3>Price Range: $21+ </h3></div>
            )
        }
    }

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
                <div className='recipe-details'>   
                <Link href="./../findfood" style={{ textDecoration: 'none', border: '1px solid black', padding: '5px 20px', borderRadius: '5px', color: 'black' }}>Back</Link>
                <br></br>
                <div className='recipe-info'>
                <Image
                    src= {recipe.photo}
                    width={500}
                    height={500}
                />
                <div className='details'>
                <div><h1>{recipe.name}</h1></div>
                <div><h3>{recipe.genre}</h3></div>
                <div><h3>{recipe.cookTime} minutes to prepare and cook</h3></div>
                {priceRangeCalculator(recipe.priceRange)}
                <text>Did you make and eat this?</text>
                <button onClick={recordRecipe}>Yes</button>
                
                {eaten && <p>How much did you spend on ingredients?</p>}
                {eaten && <input type='number' step='0.01' value={costInput} onChange={updateCostInput}/>}
                {eaten && <button onClick={adjustBudget}>Adjust Budget</button>}
                {eaten && successOutput}
                </div>
                </div>
                <div className='list-details'>
                <div className='ingredients'>
                <div><h3> Ingredients </h3></div>
                <div>{ ingredientsList }</div>
                </div>
                <div className='instructions'>
                <div><h3> Instructions </h3></div>
                <div className='steps'>{ instructions }</div>
                </div>
                </div>
                <br></br>
                
            </div>
            )
        }
        else{
            return(
                <div className='recipe-details'>
                <Link href="./../findfood" style={{ textDecoration: 'none', border: '1px solid black', padding: '5px 20px', borderRadius: '5px', color: 'black' }}>Back</Link>
                <br></br>
                <div className='recipe-info'>
                <Image
                    src= {recipe.photo}
                    width={500}
                    height={500}
                />
                <div className='details'>
                <div><h1>{recipe.name}</h1></div>
                <div><h3>{recipe.genre}</h3></div>
                <div><h3>{recipe.cookTime} minutes to prepare and cook</h3></div>
                {priceRangeCalculator(recipe.priceRange)}
                </div>
                </div>
                <div className='list-details'>
                <div className='ingredients'>
                <div><h3> Ingredients </h3></div>
                <div>{ ingredientsList }</div>
                </div>
                <div className='instructions'>
                <div><h3> Instructions </h3></div>
                <div className='steps'>{ instructions }</div>
                </div>
                </div>
                <br></br>
        
            </div>
            )
        }
    }
}