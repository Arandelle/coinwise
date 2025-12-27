import { cookies } from "next/headers";

// for protected routes
export async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    // Throw a real JS error instead of returning a NextResponse
    throw new Error("Not authenticated");
  }

  return token;
}

// for optional routes (guest or authenticated)
export async function getTokenOptional(){
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  return token || null;
}