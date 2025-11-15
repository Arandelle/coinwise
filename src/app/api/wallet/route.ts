import { getToken } from "@/lib/getToken";
import { NextResponse } from "next/server";

export async function GET(){
    try{

        const token = await getToken();
        const res = await fetch(`${process.env.BACKEND_URL}/account/my-balance`, {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${token}`,
                "Content-Type" : "application/json"
            }
        });

        if (!res.ok){
            return new Response("Failed to fetch wallet balance", {status: res.status})
        }

        const data = await res.json();
        return Response.json(data)

    }catch(error){
        console.error("Error fetching wallet balance", error);
        return new Response("Server error", {status: 500});
    }
}

export async function POST(req: Request) {
    try {
        const token = await getToken();
        const body = await req.json();
        const res = await fetch(`${process.env.BACKEND_URL}/account/my-balance`, {
            method: "POST",
            headers: {
                "Authorization" : `Bearer ${token}`,
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(body)
        });

        if(!res.ok){
            return new Response("Failed to create wallet balance", {status: 500});
        }

        const data = await res.json();
        return NextResponse.json(data, {status: 201});

    }catch(error){
        console.error("Failed to create wallet balance", error)
        return new Response("Server error: Failed to create wallet balance",{status: 500})
    }
}