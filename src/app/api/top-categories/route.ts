import { getToken } from "@/lib/getToken";

export async function GET(){
    try{

        const token = await getToken();
        const res = await fetch(`${process.env.BACKEND_URL}/categories/most-used`, {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${token}`,
                "Content-Type" : "application/json"
            },
        });

        if(!res.ok){
            return new Response("Failed to fetch top categories", {status: res.status});
        }

        const data = await res.json();
        return Response.json(data);

    }catch(error){
        console.error("Error fetching top categories", error);
        return new Response("Error fetching top categories", {status: 500});
    }
}