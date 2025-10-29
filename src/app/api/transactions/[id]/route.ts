import { NextResponse } from "next/server";

export async function PUT(req: Request, {params} : {params : {id: string}}) {

  try{

    const body = await req.json();
    const res = await fetch(`${process.env.BACKEND_URL}/transactions/${params.id}`, {
      method: "PUT",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify(body)
    });

    if(!res.ok){
      const errorData = await res.json();
      return NextResponse.json(
        {error: errorData.detail || "Failed to update data"},
        {status: res.status}
      );
    };

    const data = await res.json();
    return NextResponse.json(
      data, {status: 200}
    );

  }catch(error){
    return NextResponse.json(
      {error: "Server error"},
      {status: 500}
    )
  }
  
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/transactions/${params.id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.detail || "Failed to delete transaction" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/transactions/[id]:", error);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
