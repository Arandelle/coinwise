import { cookies } from "next/headers";

export async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    // Throw a real JS error instead of returning a NextResponse
    throw new Error("Not authenticated");
  }

  return token;
}
