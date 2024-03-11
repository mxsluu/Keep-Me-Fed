'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';
import Image from 'next/image'


export default function Restaurant({ params }){
    const [restaurant, setRestaurant] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eaten, setEaten] = useState(false)
    const [costInput, setCostInput] = useState('')
    const [successOutput, setSuccessOutput] = useState('')
    const [success, setSuccess] = useState(false)
    const { data: session, status }  = useSession();
    const loadingItems = <CircularProgress/>;

    const fetchRestaurant = async function () {
        fetch("/api/restaurants" + "?" + 'id=' + params.id, { method: "get" }).then((res) => res.ok && res.json()).then(
            restaurant => {
                restaurant && setRestaurant(restaurant);
                setLoading(false)
        });
    };
    
    useEffect(() => {
        fetchRestaurant();
    }, []);

    function recordRestaurant(){
        setEaten(true)
        return 0;
    }

    function updateCostInput(event){
        setCostInput(event.target.value);
    }


    function adjustBudget(){
        if (0 <= parseFloat(costInput) && (!success)){
            setCostInput(Number(costInput).toFixed(2));
            setSuccessOutput('Budget Changed')
            setSuccess(true)
            fetch(`/api/adjustBudget/${session.user.id}}`, {method: 'put', body: JSON.stringify({cost: costInput})}).then((response) => response.ok && response.json())
        }
        else if (parseFloat(costInput) <= 0){
            setSuccessOutput('Cost cannot be negative')

        }
        else{
            setSuccessOutput('Error in changing budget or budget change already recorded')  
        }
    }

    if (loading){
        return <div> {loadingItems} </div>
    }
    else{
        if (status == "authenticated"){
            return(
            <div>
                <Link href="./../findfood">Back</Link>
                <br></br>
                <div><h1>{restaurant.name}</h1></div>
                <div><h3>{restaurant.genre}</h3></div>
                <div><h3>{restaurant.location}</h3></div>
                <div><h3>{restaurant.priceRange}</h3></div>
                <text>Did you eat at this restaurant?</text>
                <button onClick={recordRestaurant}>Yes</button>
                {eaten && <p>How much did you spend at this restaurant?</p>}
                {eaten && <input type='number' step='0.01' value={costInput} onChange={updateCostInput}/>}
                {eaten && <button onClick={adjustBudget}>Adjust Budget</button>}
                {eaten && successOutput}
                <br></br>
                <Link href={restaurant.websiteLink}>Vist their Website!</Link>
                <br></br>
                <Image
                    src= {restaurant.photo}
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
                <div><h1>{restaurant.name}</h1></div>
                <div><h3>{restaurant.genre}</h3></div>
                <div><h3>{restaurant.location}</h3></div>
                <div><h3>{restaurant.priceRange}</h3></div>
                <Link href={restaurant.websiteLink}>Vist their Website!</Link>
                <br></br>
                <Image
                    src= {restaurant.photo}
                    width={350}
                    height={350}
                />
            </div>
            )
        }
    }
}