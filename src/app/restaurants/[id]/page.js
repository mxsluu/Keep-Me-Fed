'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';
import Image from 'next/image'
import './styles.css';


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
            <div className='restaurant-details'>
                <Link href="./../findfood" style={{ textDecoration: 'none', border: '1px solid black', padding: '5px 20px', borderRadius: '5px', color: 'black' }}>Back</Link>
                <br></br>
                <div className='res-details'>
                <Image
                    src= {restaurant.photo}
                    width={600}
                    height={600}
                />
                <div className='details'>
                <div><h1>{restaurant.name}</h1></div>
                <div><h3>{restaurant.genre}</h3></div>
                <div><h3>Coordinates: {restaurant.location}</h3></div>
                <div><h3>Price Range: {restaurant.priceRange}</h3></div>
                <text>Did you eat at this restaurant?</text>
                <button onClick={recordRestaurant}>Yes</button>
                {eaten && <p>How much did you spend at this restaurant?</p>}
                {eaten && <input type='number' step='0.01' value={costInput} onChange={updateCostInput}/>}
                {eaten && <button onClick={adjustBudget}>Adjust Budget</button>}
                {eaten && successOutput}
                <br></br>
                <Link href={restaurant.websiteLink}
                style={{ 
                    display: 'block',
                    textAlign: 'center',
                    textDecoration: 'none', 
                    border: 'none',
                    backgroundColor: 'white',
                    padding: '5px 20px', 
                    borderRadius: '5px', 
                    color: 'black',
                    marginTop:'20px',
                    width: 'fit-content',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'
                }}>Vist their Website!</Link>
                <br></br>
                </div>
                </div>
            </div>
            )
        }
        else{
            return(
                <div className='restaurant-details'>
                <Link href="./../findfood" style={{ textDecoration: 'none', border: '1px solid black', padding: '5px 20px', borderRadius: '5px', color: 'black' }}>Back</Link>
                <br></br>
                <div className='res-details'>
                <Image
                    src= {restaurant.photo}
                    width={600}
                    height={600}
                />
                 <div className='details'>
                <div><h1>{restaurant.name}</h1></div>
                <div><h3>{restaurant.genre}</h3></div>
                <div><h3>Coordinates: {restaurant.location}</h3></div>
                <div><h3>Price Range: {restaurant.priceRange}</h3></div>
                <Link href={restaurant.websiteLink}
                style={{ 
                    display: 'block',
                    textAlign: 'center',
                    textDecoration: 'none', 
                    border: 'none',
                    backgroundColor: 'white',
                    padding: '5px 20px', 
                    borderRadius: '5px', 
                    color: 'black',
                    marginTop:'20px',
                    width: 'fit-content',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'
                }}>Vist their Website!</Link>
                <br></br>
                </div>
                </div>
                
            </div>
            )
        }
    }
}