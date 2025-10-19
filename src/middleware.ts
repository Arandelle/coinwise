import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest){
    const token = req.cookies.get("access_token")?.value;

    const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard")
    const isAuthRoute = req.nextUrl.pathname.startsWith("/login")

    if (isProtectedRoute && !token){
        return NextResponse.redirect(new URL("/login", req.url))
    }

    if (isAuthRoute && token){
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register"]
}