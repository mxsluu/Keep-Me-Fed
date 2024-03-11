import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";

export async function GET(request) {
  const loggedInData = await checkLoggedIn();
  // GET URL SEARCH PARAMS
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search');
  const budgetFilter = searchParams.get('budgetFilter')
  const timeFilter = searchParams.get('timeFilter')
  const longitude = parseFloat(searchParams.get('longitude'))
  const latitude = parseFloat(searchParams.get('latitude'))
  const sortType = searchParams.get('sortType')
  const sortOrder = searchParams.get('sortOrder')
  // CHECK IF USER
  if (loggedInData.loggedIn){
    const user = await prisma.user.findUnique({
      where:{
        id: loggedInData.user.id
      },
      include: {
        busyblocks: true
      }
    })
    // If budgetFilter is on, then calculate the upper limit for meal options 
    if (budgetFilter == 'true'){
      var limit = calculatePriceRange(Number(user.budget /7).toFixed(2))
      }
    else{
      var limit = 3
    }
    // If timeFilter is on, then calculate free time
    if (timeFilter == 'true'){
      var freeTime = calculateFreeTime(user.busyblocks)
    }
  }
  // Check if user or non-user to determine if filters will be used or not
  if (loggedInData.loggedIn){
    // Replace URL encoding of spaces with null for slightly better searching
    if (search != null){
      search.replace('%20')
    }
    // Search through recipes with limit (if no budget filter limit is 3 (max))
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
  // Search through restaurants with limit (if no budget filter limit is 3 (max))
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
    // Initialize foods list and add additonal attributes to foods (distance and cookTime)
    // Recipes have a distance of 0 (assumed to already have the ingredients) and cookTime is already hard-coded
    // Restaurants need calculation for distance and "cookTime" (reality is travel time for now + 30mins to eat)
    var foods = [...recipes.map(r => ({...r, type: 'recipe', distance: 0})), 
    ...restaurants.map(r => ({...r, type: 'restaurant', 
    distance: getDistanceFromLatLonInMiles(latitude, longitude, parseFloat(r.location.split(',')[0]), parseFloat(r.location.split(',')[1])), 
    cookTime: calculateTime(getDistanceFromLatLonInMiles(latitude, longitude, parseFloat(r.location.split(',')[0]), parseFloat(r.location.split(',')[1])))}))]
    // Call Sort Foods(). Will return 0 and do nothing is sorting is not asked for
    sortFoods(sortType, sortOrder, foods)
    // Check if timeFilter is on, if it is then will filter out foods that can be cooked within the free time of the user
    if (timeFilter == "true"){
      foods = foods.filter((food) =>  food.cookTime <= freeTime)
    }
    return NextResponse.json(foods)
  }
  else {
    // Do the same as for users but don't call any filter functions
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

// Use ranges to calculate limits for foods
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

// Helper function to calculate distance between 2 coordinates
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

// Sort foods by sort type and sort options (a = "ascending", else = "descending")
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
      // if we are in a busy block, then we have no free time and will return 0
      if (currentdate >= blockStartTime && currentdate <= blockEndTime){
        return 0;
      }
      // if block start time is later in the day than the current day, then exit loop
      if (blockStartTime > currentdate)
      {
          break;
      }
      // index through if we haven't found the next free block yet
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
      return (nextBusyTime - currentdate) / 60000;
  }
};
