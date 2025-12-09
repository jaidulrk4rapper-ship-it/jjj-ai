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
    
    // Check header if cookie not found
    if (!userId) {
      userId = req.headers.get("x-user-id");
    }

    // If userId is provided (from header or cookie), try to get existing user
    if (userId) {
      const user = await getUserById(userId);
      
      // If user exists, return it
      if (user) {
        // Set cookie if not already set (for future requests)
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

        // Set cookie if not already set
        if (!cookieStore.get(COOKIE_NAME)) {
          const isProduction = process.env.NODE_ENV === "production";
          response.cookies.set(COOKIE_NAME, userId, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });
        }

        return response;
      }
      
      // If userId was provided but user not found, it might be invalid
      // Don't create a new guest user - return error or create guest with that ID
      // For now, we'll create a guest user with the provided ID to maintain compatibility
      const guestUser = await ensureGuestUser(userId);
      
      const response = NextResponse.json({
        ok: true,
        user: {
          userId: guestUser.userId,
          email: guestUser.email,
          plan: guestUser.plan,
          coins: guestUser.coins,
          totalTokens: guestUser.totalTokens,
        },
      });

      // Set cookie
      const isProduction = process.env.NODE_ENV === "production";
      response.cookies.set(COOKIE_NAME, guestUser.userId, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;
    }

    // No userId provided - create new guest user
    const guestUser = await ensureGuestUser("temp_" + Date.now());
    
    const response = NextResponse.json({
      ok: true,
      user: {
        userId: guestUser.userId,
        email: guestUser.email,
        plan: guestUser.plan,
        coins: guestUser.coins,
        totalTokens: guestUser.totalTokens,
      },
    });

    // Set cookie for new guest user
    const isProduction = process.env.NODE_ENV === "production";
    response.cookies.set(COOKIE_NAME, guestUser.userId, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error: any) {
    console.error("Get user error:", error);
    // Never throw 500 for missing user - always return a guest user
    try {
      const guestUser = await ensureGuestUser("fallback_" + Date.now());
      const response = NextResponse.json({
        ok: true,
        user: {
          userId: guestUser.userId,
          email: guestUser.email,
          plan: guestUser.plan,
          coins: guestUser.coins,
          totalTokens: guestUser.totalTokens,
        },
      });

      // Set cookie
      const isProduction = process.env.NODE_ENV === "production";
      response.cookies.set(COOKIE_NAME, guestUser.userId, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;
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

