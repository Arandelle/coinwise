import { getToken } from "@/lib/getToken";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken();
    const body = await req.json();
    const { id } = await params;

    const res = await fetch(
      `${process.env.BACKEND_URL}/account/my-balance/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(
        { error: error.detail || "Failed to update the wallet balance" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {status: 200})

  } catch (error) {
    console.error("Failed to update wallet balance", error);
    return new Response("Server error: ", { status: 500 });
  }
}
