import prisma from "@/lib/db";
import { NextResponse } from "next/server";



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