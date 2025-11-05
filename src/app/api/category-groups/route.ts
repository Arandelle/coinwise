import { getToken } from "@/lib/getToken";

export async function GET() {
  try {
    const token = await getToken();
    const res = await fetch(`${process.env.BACKEND_URL}/category-groups/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return new Response("Failed to fetch category groups", { status: res.status });
    }

    const data = await res.json();
    return Response.json(data);

  } catch (error) {
    console.error("Error fetching category groups", error);
    return new Response("Server Error", { status: 500 });
  }
}