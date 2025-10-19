import { cookies } from "next/headers"

export async function POST(){
    try{

        const cookieStore = cookies();
        (await cookieStore).set({
            name: "access_token",
            value: "",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 0 // expires immediately
        });

        return Response.json({message: "Logout successfully!"});


    }catch(error){
        console.error("Error loggin out: ", error)
        return Response.json("Server Error", {status: 500})
    }
}