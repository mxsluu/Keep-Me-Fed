import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";

export async function PUT(request, { params }) {
   const loggedInData = await checkLoggedIn();
   const id = parseInt(params.id);
   if (loggedInData.loggedIn && id) {
    const { cost } = await request.json();
    try {
      const user = await prisma.user.update({
        where: {
          id: loggedInData.user.id
        }, 
        data: {
          budget: {
            increment: -parseFloat(cost)
          },
        },
      });
      return NextResponse.json(user);
    } catch {
      return NextResponse.json({error: 'record not found'}, {status: 401});
    }
  }

   return NextResponse.json({error: 'not signed in'}, {status: 403});
}
