// src/app/api/user/me/route.ts
// Get current user API

import { NextRequest, NextResponse } from "next/server";
import { getUserById, ensureGuestUser } from "@/lib/users";
import { cookies } from "next/headers";

const COOKIE_NAME = "jjj_device_id";

export async function GET(req: NextRequest) {
  try {
    // Get userId from cookie or header
    const cookieStore = await cookies();
    let userId: string | null = cookieStore.get(COOKIE_NAME)?.value || null;
    
    if (!userId) {
      userId = req.headers.get("x-user-id");
    }

    // If no userId, create guest user
    if (!userId) {
      const guestUser = await ensureGuestUser("temp_" + Date.now());
      userId = guestUser.userId;
    }

    // Get user
    let user = await getUserById(userId);
    
    // If not found, create guest user
    if (!user) {
      user = await ensureGuestUser(userId);
    }

    return NextResponse.json({
      ok: true,
      user: {
        userId: user.userId,
        email: user.email,
        plan: user.plan,
        coins: user.coins,
        totalTokens: user.totalTokens,
      },
    });
  } catch (error: any) {
    console.error("Get user error:", error);
    // Never throw 500 for missing user - always return a guest user
    try {
      const guestUser = await ensureGuestUser("fallback_" + Date.now());
      return NextResponse.json({
        ok: true,
        user: {
          userId: guestUser.userId,
          email: guestUser.email,
          plan: guestUser.plan,
          coins: guestUser.coins,
          totalTokens: guestUser.totalTokens,
        },
      });
    } catch (fallbackError) {
      return NextResponse.json(
        {
          ok: false,
          error: "Failed to get user",
        },
        { status: 500 }
      );
    }
  }
}

