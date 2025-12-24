import { AIPrompt } from "@/app/types/AIPrompt";
import { getToken } from "@/lib/getToken";


export async function GET(request: Request){
    try{
        const token = await getToken();

        // Extract query params
        const {searchParams} = new URL(request.url);

        // Build query string
        const queryString = searchParams.toString();

        const response = await fetch(`${process.env.BACKEND_URL}/ai/conversation-history?${queryString}`, {
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${token}`
            }
        });

        if (!response.ok){
            const errorText = await response.json();
            return new Response(errorText || "Error fetching conversation history", {status: response.status});
        }

        const data = await response.json();
        return Response.json(data);

    }catch(error){
        return Response.json("Server Error", {status: 500})
    }
}

export async function POST(req: Request){
    try{

        const body : AIPrompt = await req.json();

        const token = await getToken();

        const response = await fetch(`${process.env.BACKEND_URL}/ai/coinwise-ai`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if(!response.ok){
            const errorText = await response.text()
            return new Response(errorText || "Error getting response", {status: response.status});
        }

        const data = await response.json();
        return Response.json(data);

    }catch(error){
        console.error("Error in /api/ai/coinwise-ai", error);
        return Response.json("Server Error", {status: 500})
    }
} 


export async function DELETE(){
    try {
        const token = await getToken();

        const response = await fetch(`${process.env.BACKEND_URL}/ai/clear-conversation`, {
            method: "DELETE",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${token}`
            }
        });

        if(!response.ok){
            const errorText = await response.text()
            return Response.json({error: errorText || "Error clearing conversation"}, {status: response.status});
        }
        
        return new Response(null, {status: 204});

    }catch(error){
        return Response.json("Server Error", {status: 500})
    }
}
