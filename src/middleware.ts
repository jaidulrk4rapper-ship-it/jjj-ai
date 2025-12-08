// src/middleware.ts

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

// Protect only /api/admin/* routes (except login)
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip protection for login route (it's the one that gives you the key)
  if (pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    if (!ADMIN_SECRET_KEY) {
      // Dev mode: agar secret nahi hai to allow
      return NextResponse.next();
    }

    const headerKey = req.headers.get("x-admin-key");

    if (headerKey !== ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
