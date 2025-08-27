import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import apiCall from "./api/apiCall";
import { API_URL } from "./lib/common";

export async function middleware(req: NextRequest) {
  // Match only /dashboard route
  if (req.nextUrl.pathname === "/dashboard") {
    const token = req.cookies.get("token")?.value;
    const username = req.cookies.get('username')?.value

    // No token → redirect to /voter
    if (!token) {
      return NextResponse.redirect(new URL("/vote", req.url));
    }

    try {
      // Call your backend verify-user API
      const res = await apiCall({
        url: `${API_URL}/api/admin/verify-user`,
        method: "POST",
        body: { username, token },
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(res, "res")


      // const data = await res.json();

      if (!res.success) {
        // Invalid token → redirect to /voter
        return NextResponse.redirect(new URL("/vote", req.url));
      }

      // Optionally, you can attach verified info to request headers
      const response = NextResponse.next();
      response.headers.set("x-username", res.username);
      response.headers.set("x-token", token);
      return response;

    } catch (err) {
      console.error("Middleware verify-user error:", err);
      return NextResponse.redirect(new URL("/vote", req.url));
    }
  }

  // Other routes → continue normally
  return NextResponse.next();
}

// Only run middleware for /dashboard
export const config = {
  matcher: ["/dashboard"],
};
