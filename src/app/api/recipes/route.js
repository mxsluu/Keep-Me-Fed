import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";

export async function GET(request) {
  //const loggedInData = await checkLoggedIn();
  //if (loggedInData.loggedIn) {
    const recipes = await prisma.recipe.findMany({});
    return NextResponse.json(recipes);
  //}
  //return NextResponse.json({error: 'not signed in'}, {status: 403});
}
/*
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