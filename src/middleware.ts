import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest){
    const token = req.cookies.get("access_token")?.value;

    const authRoutes = ["/login", "/signup"]
    const protectedRoutes = ["/dashboard", "/transactions"];

    const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
    const isAuthRoute = authRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

    if (isProtectedRoute && !token){
        return NextResponse.redirect(new URL("/login", req.url))
    }

    if (isAuthRoute && token){
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*","/transactions/:path*", "/login", "/signup"]
}