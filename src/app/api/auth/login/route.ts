import { UserLogin } from "@/app/types/Users";
import { cookies } from "next/headers";

export async function POST(request: Request){

    try{

        const body : UserLogin = await request.json()

        const response = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(body)
        });

        if(!response.ok){
            const errorText = await response.text();
            return new Response(errorText || "Login Failed", {status: response.status});
        }

        const data = await response.json();
        
        // Store JWT in secure HTTP-only cookie
        const cookieStore = await cookies()
        cookieStore.set({
            name: "access_token",
            value: data.access_token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            path: "/",
            maxAge: 60 * 60 * 24 // 1day
        });

        return Response.json({message: "Login Successful!"});

    }catch(error){
        console.error("Error in /api/auth/login route: ", error);
        return Response.json("Server Error", {status: 500})
    }
}