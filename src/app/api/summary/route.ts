import { getToken } from "@/lib/getToken";

export async function GET(request: Request){
    try{
        const token = await getToken();

        // Extract the query params 
        const {searchParams} = new URL(request.url);
        const queryString = searchParams.toString();

        const response = await fetch(`${process.env.BACKEND_URL}/transactions/summary?${queryString}`, {
            method: "GET",
            headers: {"Content-Type" : "application/json", 
                "Authorization" : `Bearer ${token}`
            }
        });

        if (!response.ok){
            return new Response("Failed to fetch data.", {status: response.status})
        }

        const data = await response.json();

        return Response.json(data)

    }catch(error){
        console.error("Server Error: ", error);
        return new Response("Server Error: ", {status: 500})
    }
}