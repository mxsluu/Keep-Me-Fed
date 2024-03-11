import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";

export async function GET(request) {
  const loggedInData = await checkLoggedIn();
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit'));
    if (loggedInData.loggedIn){
      if (search != null && search.length){
        search.replace("%20")
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
        return NextResponse.json([...recipes.map(r => ({...r, type: 'recipe', distance: null})), ...restaurants.map(r => ({...r, type: 'restaurant', cookTime: null, distance: null}))]);
      }
      else{
        const recipes = await prisma.recipe.findMany({
          where: {
            AND: [
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
        return NextResponse.json([...recipes.map(r => ({...r, type: 'recipe', distance: null})), ...restaurants.map(r => ({...r, type: 'restaurant', cookTime: null, distance: null}))]);
      }
    }
    else {
      if (search != null && search.length){
        search.replace("%20")
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
        return NextResponse.json([...recipes.map(r => ({...r, type: 'recipe', distance: null})), ...restaurants.map(r => ({...r, type: 'restaurant', cookTime: null, distance: null}))]);
      }
      else{
        const recipes = await prisma.recipe.findMany({});
        const restaurants = await prisma.restaurant.findMany({});
        return NextResponse.json([...recipes.map(r => ({...r, type: 'recipe', distance: null})), ...restaurants.map(r => ({...r, type: 'restaurant', cookTime: null, distance: null}))]);
      }
    }
  }
    
/*
return NextResponse.json({error: 'not signed in'}, {status: 403});
export async function POST(request) {
  const loggedInData = await checkLoggedIn();
  if (loggedInData.loggedIn) {
    const { done, value } = await request.json();
    const todo = await prisma.toDo.create({
      data: {
        ownerId: loggedInData.user?.id,
        done,
        value
      }
    });
    return NextResponse.json(todo);
  }
  return NextResponse.json({error: 'not signed in'}, {status: 403});
}

*/