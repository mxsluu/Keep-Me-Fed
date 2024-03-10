import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { checkLoggedIn } from "@/lib/auth";


export async function POST(request){
    const data=await request.json();

    const {startTime, endTime}=data;
    const userId=1;
    let BusyBlock;
    try{
        BusyBlock=await prisma.BusyBlock.create({
            data: {
                startTime,
                endTime,
                userId,
         
            },
            
        });
        return NextResponse.json(BusyBlock);
    }catch(error){
        console.error('Error creating busy block:',error);
        return NextResponse.json({error: 'Failed to create busy block'});
    }
}

export async function GET(){
    const loggedInData = await checkLoggedIn();
    if (loggedInData.loggedIn) {
        try {
            // Retrieve busy blocks associated with the logged-in user
            const userId = loggedInData.user.id;
            const busyBlocks = await prisma.busyBlock.findMany({
                where: {
                    userId: userId,
                },
            });

            // Return the retrieved busy blocks as a response
            return NextResponse.json(busyBlocks);
        } catch (error) {
            console.error('Error fetching busy blocks:', error);
            return NextResponse.json({ error: 'Failed to fetch busy blocks' }, { status: 500 });
        }
    } else {
        // If the user is not logged in, return an error response
        return NextResponse.json({ error: 'User not authenticated' }, { status: 403 });
    }
    
} ad