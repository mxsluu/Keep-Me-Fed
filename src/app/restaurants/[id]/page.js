'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';
import Image from 'next/image'


export default function Restaurant({ params }){
    const [restaurant, setRestaurant] = useState([]);
    const [loading, setLoading] = useState(true);
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