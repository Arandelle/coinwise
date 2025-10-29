import { Transaction } from "@/app/types/Transaction";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/transactions`, {
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      return new Response("Failed to fetch", { status: res.status });
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.log("Error in /api/transaction route: ", error);
    return new Response("Server Error: ", { status: 500 });
  }
}

export async function POST(req: Request){
  try{
    const body : Transaction = await req.json()
    const res = await fetch(`${process.env.BACKEND_URL}/transactions/`, {
      method: "POST",
      headers : {"Content-Type" : "application/json"},
      body: JSON.stringify(body)
    });

    if(!res.ok){
      return new Response("Failed to add new item")
    };

    const data = await res.json();

    return NextResponse.json(data, {status: 201})


  }catch(error){
    return new Response("Server Error: ", {status: 500})
  }
}
