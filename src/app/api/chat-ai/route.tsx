import { AIPrompt } from "@/app/types/AIPrompt";

export async function POST(req: Request){
    try{

        const body : AIPrompt = await req.json();

        const response = await fetch(`http://127.0.0.1:8000/ai/coinwise-ai`, {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
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