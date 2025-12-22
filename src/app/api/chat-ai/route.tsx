import { AIPrompt } from "@/app/types/AIPrompt";
import { getToken } from "@/lib/getToken";

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