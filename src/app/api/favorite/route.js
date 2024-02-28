import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";

export async function GET(request) {
  const loggedInData = await checkLoggedIn();
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
    return NextResponse.json([...user.favoriteRecipes.map(r => ({...r, type: 'recipe'})), ...user.favoriteRestaurants.map(r => ({...r, type: 'restaurant'}))]);
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