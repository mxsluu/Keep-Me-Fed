import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";

export async function GET(request) {
  const loggedInData = await checkLoggedIn();
  const searchParams = request.nextUrl.searchParams
  const longitude = parseFloat(searchParams.get('longitude'))
  const latitude = parseFloat(searchParams.get('latitude'))
  if (loggedInData.loggedIn) {
    const user = await prisma.user.findUnique({
      where: {
        id: loggedInData.user?.id
      },
      include: {
        favoriteRecipes: true,
        favoriteRestaurants: true,
      }
    });
    const recipes = user.favoriteRecipes;
    const restaurants = user.favoriteRestaurants;
    return NextResponse.json([...recipes.map(r => ({...r, type: 'recipe', distance: 0})), 
      ...restaurants.map(r => ({...r, type: 'restaurant', 
      distance: getDistanceFromLatLonInMiles(latitude, longitude, parseFloat(r.location.split(',')[0]), parseFloat(r.location.split(',')[1])), 
      cookTime: calculateTime(getDistanceFromLatLonInMiles(latitude, longitude, parseFloat(r.location.split(',')[0]), parseFloat(r.location.split(',')[1])))}))]);
  }
  return NextResponse.json({error: 'not signed in'}, {status: 403});
}

export async function PUT(request) {
   const loggedInData = await checkLoggedIn();
   if (loggedInData.loggedIn && loggedInData.user.id) {
    const { food } = await request.json();
    try {
      if (food.type == "recipe"){
        const user = await prisma.user.update({
          where: {
            id: loggedInData.user.id,
          },
          data: {
            favoriteRecipes:{
              connect: {
                id: food.id,
              },
            },
          },
          include: {
            favoriteRecipes: true,
          },
        });
      return NextResponse.json(user);
      }
      else{
        const user = await prisma.user.update({
          where: {
            id: loggedInData.user.id
          },
          data: {
            favoriteRestaurants:{
              connect: {
                id: food.id,
              },
            },
          },
          include: {
            favoriteRestaurants: true,
          },
        });
        return NextResponse.json(user);
      }
   } 
   catch {
      return NextResponse.json({error: 'record not found'}, {status: 401});
    }
  }

   return NextResponse.json({error: 'not signed in'}, {status: 403});
}


export async function PATCH(request) {
  const loggedInData = await checkLoggedIn();
  if (loggedInData.loggedIn && loggedInData.user.id) {
    const { food } = await request.json();
    try {
      if (food.type == "recipe"){
        const user = await prisma.user.update({
          where: {
            id: loggedInData.user.id,
          },
          data: {
            favoriteRecipes:{
              disconnect: {
                id: food.id,
              },
            },
          },
          include: {
            favoriteRecipes: true,
          },
        });
      return NextResponse.json(user);
      }
      else{
        const user = await prisma.user.update({
          where: {
            id: loggedInData.user.id
          },
          data: {
            favoriteRestaurants:{
              disconnect: {
                id: food.id,
              },
            },
          },
          include: {
            favoriteRestaurants: true,
          },
        });
        return NextResponse.json(user);
      }
   } 
   catch {
      return NextResponse.json({error: 'record not found'}, {status: 401});
    }
  }

   return NextResponse.json({error: 'not signed in'}, {status: 403});
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

function calculateTime(distance){
  return (distance / 18.6) * 60
}