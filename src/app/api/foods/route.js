import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";

export async function GET(request) {
  const loggedInData = await checkLoggedIn();
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search');
    const budgetFilter = searchParams.get('budgetFilter')
    const longitude = parseFloat(searchParams.get('longitude'))
    const latitude = parseFloat(searchParams.get('latitude'))
    const sortType = searchParams.get('sortType')
    const sortOrder = searchParams.get('sortOrder')
    if (budgetFilter == 'true' && loggedInData.loggedIn){
      const user = await prisma.user.findUnique({
        where:{
          id: loggedInData.user.id
        }
      })
      var limit = calculatePriceRange(Number(user.budget /7).toFixed(2))
    }
    else{
      var limit = 3
    }
    if (loggedInData.loggedIn){
      if (search != null){
        search.replace('%20')
      }
      const recipes = await prisma.recipe.findMany({
        where: {
          AND: [
              {
              name: {
                contains: search,
                mode: 'insensitive'
              },
            },
            {
              userID: {
                none: {
                  id: loggedInData.user.id
                }
              }
            },
            {
              priceRange:{
                lte: limit
              }
            }
          ]
        }
      });
      const restaurants = await prisma.restaurant.findMany({
        where: {
          AND: [
              {
              name: {
                contains: search,
                mode: 'insensitive'
              },
            },
            {
              userID: {
                none: {
                  id: loggedInData.user.id
                }
              }
            },
            {
              priceRange:{
                lte: limit
              }
            }
          ]
        }
      });
      var foods = [...recipes.map(r => ({...r, type: 'recipe', distance: 0})), 
      ...restaurants.map(r => ({...r, type: 'restaurant', 
      distance: getDistanceFromLatLonInMiles(latitude, longitude, parseFloat(r.location.split(',')[0]), parseFloat(r.location.split(',')[1])), 
      cookTime: calculateTime(getDistanceFromLatLonInMiles(latitude, longitude, parseFloat(r.location.split(',')[0]), parseFloat(r.location.split(',')[1])))}))]
      sortFoods(sortType, sortOrder, foods)
      return NextResponse.json(foods)
    }
    else {
      if (search != null){
        search.replace('%20')
      }
        const recipes = await prisma.recipe.findMany({
          where: {
                name: {
                  contains: search,
                  mode: 'insensitive'
                },
              },
            });
        const restaurants = await prisma.restaurant.findMany({
          where: {
                name: {
                  contains: search,
                  mode: 'insensitive'
                },
              },
            });
            var foods = [...recipes.map(r => ({...r, type: 'recipe', distance: 0})), 
            ...restaurants.map(r => ({...r, type: 'restaurant', 
            distance: getDistanceFromLatLonInMiles(latitude, longitude, parseFloat(r.location.split(',')[0]), parseFloat(r.location.split(',')[1])), 
            cookTime: calculateTime(getDistanceFromLatLonInMiles(latitude, longitude, parseFloat(r.location.split(',')[0]), parseFloat(r.location.split(',')[1])))}))]
            sortFoods(sortType, sortOrder, foods)
            return NextResponse.json(foods)  
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
function sortFoods(sortType, sortOrder, foods){
  if (sortType == "price") {
    if (sortOrder == "a"){
      foods.sort((foodA, foodB) => foodA.priceRange - foodB.priceRange)
    }
    else{
      foods.sort((foodA, foodB) => foodB.priceRange - foodA.priceRange)
    }
  }
  else if (sortType == "time"){
    if (sortOrder == "a"){
      foods.sort((foodA, foodB) => foodA.cookTime - foodB.cookTime)
    }
    else{
      foods.sort((foodA, foodB) => foodB.cookTime - foodA.cookTime)
    }
  }
  else if (sortType == "distance"){
    if (sortOrder == "a"){
      foods.sort((foodA, foodB) => foodA.distance - foodB.distance)
    }
    else{
      foods.sort((foodA, foodB) => foodB.distance - foodA.distance)
    }
  }
  else{
    return 0;
  }
}