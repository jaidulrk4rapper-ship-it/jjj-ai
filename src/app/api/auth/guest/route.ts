// src/app/api/auth/guest/route.ts
// Guest auto-account API

import { NextRequest, NextResponse } from "next/server";
import { ensureGuestUser } from "@/lib/users";
import { cookies } from "next/headers";

const COOKIE_NAME = "jjj_device_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function generateDeviceId(): string {
  // Generate a random UUID-like string
  return "device_" + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    let deviceId = cookieStore.get(COOKIE_NAME)?.value;

    // Generate new device ID if missing
    if (!deviceId) {
      deviceId = generateDeviceId();
    }

    // Ensure guest user exists
    const user = await ensureGuestUser(deviceId);

    // Set cookie
    const response = NextResponse.json({
      ok: true,
      user: {
        userId: user.userId,
        email: user.email,
        plan: user.plan,
        coins: user.coins,
        totalTokens: user.totalTokens,
      },
    });

    // Set cookie with httpOnly, secure in production, 30 days expiration
    const isProduction = process.env.NODE_ENV === "production";
    response.cookies.set(COOKIE_NAME, deviceId, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return response;
  } catch (error: any) {
    console.error("Guest auth error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Failed to create guest account",
      },
      { status: 500 }
    );
  }
}

