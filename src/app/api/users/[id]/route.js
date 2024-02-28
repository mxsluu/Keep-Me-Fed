import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";

export async function PUT(request, { params }) {
   const loggedInData = await checkLoggedIn();
   const id = parseInt(params.id);
   if (loggedInData.loggedIn && id) {
    const { budgetInput, locationInput } = await request.json();
    try {
      const user = await prisma.user.update({
        where: {
          id: loggedInData.user.id
        }, 
        data: {
          location: locationInput,
          budget: parseInt(budgetInput)
        }
      });
      return NextResponse.json(user);
    } catch {
      return NextResponse.json({error: 'record not found'}, {status: 401});
    }
  }

   return NextResponse.json({error: 'not signed in'}, {status: 403});
}
/*
export async function DELETE(request, { params }) {
  const loggedInData = await checkLoggedIn();
  const id = +params.id;
  if (loggedInData.loggedIn && id) {
    const todo = await prisma.toDo.delete({
      where: {
        id,
        ownerId: loggedInData.user?.id
      }
    });
    return NextResponse.json({ deleted: todo });
  }
  return NextResponse.json({error: 'not signed in'}, {status: 403});
}
*/