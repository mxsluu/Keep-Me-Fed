import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";

export async function POST(request) {
    const loggedInData = await checkLoggedIn();
    const { food, type, price } = await request.json()
    const today = new Date()
    if (type == "recipe"){
      delete food.ingredients;
      delete food.instructions;
      try {
        const newEaten = await prisma.Eaten.create({
          data: { 
          date: today,
          user: {
            connect: loggedInData.user
          },
          recipe: {
            connect: food
          },
          price: price
        }
        });
        return NextResponse.json(newEaten, {status: 200});
      } catch (e) {
        return NextResponse.json({error: e.message}, {status: 500 })
      }
    }
    else{
      try {
        const newEaten = await prisma.Eaten.create({
          data: { 
          date: today,
          user: {
            connect: loggedInData.user
          },
          restaurant: {
            connect: food
          },
        }
        });
        return NextResponse.json(newEaten, {status: 200});
      } catch (e) {
        return NextResponse.json({error: e.message}, {status: 500 })
      }
    }
}

export async function GET(request) {
  const loggedInData = await checkLoggedIn();
  if (loggedInData.loggedIn) {
    const user = await prisma.Eaten.findMany({
      where: {
        userId: loggedInData.user?.id
      },
      include: {
        recipe: true,
        restaurant: true
      }
    });
    return NextResponse.json(user);
  }
  return NextResponse.json({error: 'not signed in'}, {status: 403});
}