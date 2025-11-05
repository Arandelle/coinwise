import { getToken } from "@/lib/getToken";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const token = await getToken();
    const res = await fetch(`${process.env.BACKEND_URL}/categories/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return new Response("Failed to fetch categories", { status: res.status });
    }

    const data = await res.json();
    return Response.json(data);

  } catch (error) {
    console.error("Error fetching categories", error);
    return new Response("Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken();
    const body = await request.json();

    const res = await fetch(`${process.env.BACKEND_URL}/categories/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return Response.json(errorData, { status: res.status });
    }

    const data = await res.json();
    return Response.json(data, { status: 201 });

  } catch (error) {
    console.error("Error creating category", error);
    return new Response("Server Error", { status: 500 });
  }
}