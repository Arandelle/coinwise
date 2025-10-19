import { Users } from "@/app/types/Users";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    try{
        const body : Users = await req.json();
        const response = await fetch(`${process.env.BACKEND_URL}/auth/signup`, {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(body)
        });

        if (!response.ok){
            const errorData = await response.text();
            return NextResponse.json({error: "Failed to sign-up", details: errorData},
                {status: response.status}
            )
        }

        const data = await response.json();
        return NextResponse.json(data, {status: 201});

    }catch(error){
        console.error("Failed to signup", error)
        return NextResponse.json({error: "Server Error: ", details: String(error)},
        {status: 500}
    )
    }
    
}