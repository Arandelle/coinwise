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
