import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";

export async function POST(request) {
    const loggedInData = await checkLoggedIn();
    console.log("GOESTHROUGH");
    const data = await request.json();
    try {
      const newEaten = await prisma.eaten.create({
        data: { 
         date: data.date,
         user: loggedInData.user,
         userId: loggedInData.user?.id,
        }
      });

      const updatedUser = await prisma.user.update({
        where: {
            id: loggedInData.user?.id
        },
        data: {
            //from user-schema
            history: {
                connect: {
                    //connect new Eaten entry with user
                    id: newEaten.id
                }
            }
        }
      })
      return NextResponse.json(updatedUser, {status: 200});
    } catch (e) {
      return NextResponse.json({error: e.message}, {status: 500 })
    }
}

export async function GET(request) {
  const loggedInData = await checkLoggedIn();
  if (loggedInData.loggedIn) {
    const user = await prisma.user.findUnique({
      where: {
        id: loggedInData.user?.id
      },
      include: {
        history: true
      }
    });
    const hist = user.history;
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
    const { food, option } = await request.json();
    if (option == "favorite"){
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
  else{
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
  }
  return NextResponse.json({error: 'not signed in'}, {status: 403});
}