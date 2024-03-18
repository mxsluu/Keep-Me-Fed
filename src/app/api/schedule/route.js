import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { checkLoggedIn } from "@/lib/auth";



export async function POST(request){
    const loggedInData = await checkLoggedIn();
    const {startTime, endTime}= await request.json()
    const start = new Date(startTime)
    const end = new Date(endTime)
    const id = loggedInData.user.id
    let BusyBlock;
    try{
        BusyBlock=await prisma.BusyBlock.create({
            data: {
                startTime: start,
                endTime: end,
                user: {
                    connect: {
                        id
                    }
                }
            },
        });
        return NextResponse.json(BusyBlock);
    }catch(error){
        console.error('Error creating busy block:',error);
        return NextResponse.json({error: 'Failed to create busy block'});
    }
}

export async function PUT(request){
    const loggedInData = await checkLoggedIn();
    const {event}= await request.json()
    const start = new Date(event.start)
    const end = new Date(event.end)
    const id = loggedInData.user.id
    try{
        await prisma.BusyBlock.deleteMany({
            where: {
                userId: id,
                startTime: start,
                endTime: end
            }
        });
    }catch(error){
        console.error('Error deleting busy block:',error);
        return NextResponse.json({error: 'Failed to delete block'});
    }
}

/*
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
}
*/