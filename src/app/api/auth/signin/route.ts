// src/app/api/auth/signin/route.ts
// Email sign-in API

import { NextRequest, NextResponse } from "next/server";
import { ensureGuestUser, updateUser, getUserById, getUserByEmail } from "@/lib/users";
import { cookies } from "next/headers";
import { Timestamp } from "firebase-admin/firestore";
import { hashPassword, verifyPassword } from "@/lib/password";

const COOKIE_NAME = "jjj_device_id";

function validateEmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, isGoogleAuth } = body as { 
      email?: string; 
      password?: string;
      isGoogleAuth?: boolean;
    };

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { ok: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email
    if (!validateEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists with this email
    const existingUser = await getUserByEmail(normalizedEmail);
    
    // Debug logging (remove in production if needed)
    if (existingUser && !isGoogleAuth) {
      console.log(`[Signin] User found: ${normalizedEmail}, hasPasswordHash: ${!!existingUser.passwordHash}`);
    }

    // If not Google auth, require password
    if (!isGoogleAuth) {
      if (!password || typeof password !== "string") {
        return NextResponse.json(
          { ok: false, error: "Password is required" },
          { status: 400 }
        );
      }

      // If user doesn't exist, tell them to sign up
      if (!existingUser) {
        return NextResponse.json(
          { ok: false, error: "No account found with this email. Please sign up first." },
          { status: 404 }
        );
      }

      // User exists, check if password is set
      if (!existingUser.passwordHash || existingUser.passwordHash === null) {
        return NextResponse.json(
          { ok: false, error: "This account was created with Google sign-in. Please use 'Continue with Google' to sign in." },
          { status: 400 }
        );
      }

      // Verify password
      try {
        const isValid = await verifyPassword(password, existingUser.passwordHash);
        if (!isValid) {
          return NextResponse.json(
            { ok: false, error: "Invalid email or password" },
            { status: 401 }
          );
        }
      } catch (verifyError) {
        console.error("Password verification error:", verifyError);
        return NextResponse.json(
          { ok: false, error: "Error verifying password. Please try again." },
          { status: 500 }
        );
      }
    } else {
      // Google auth - if user doesn't exist, create it
      if (!existingUser) {
        // For Google auth, we can create new user
        const cookieStore = await cookies();
        let userId: string | null = cookieStore.get(COOKIE_NAME)?.value || null;
        
        if (!userId) {
          userId = req.headers.get("x-user-id");
        }

        if (!userId) {
          userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }

        let user = await getUserById(userId);
        if (!user) {
          user = await ensureGuestUser(userId);
        }

        const updateData: any = {
          email: normalizedEmail,
          isGuest: false,
          lastLoginAt: Timestamp.now(),
        };

        const updatedUser = await updateUser(userId, updateData);

        const response = NextResponse.json({
          ok: true,
          user: {
            userId: updatedUser.userId,
            email: updatedUser.email,
            plan: updatedUser.plan,
            coins: updatedUser.coins,
            totalTokens: updatedUser.totalTokens,
          },
        });

        const isProduction = process.env.NODE_ENV === "production";
        response.cookies.set(COOKIE_NAME, userId, {
          httpOnly: true,
          secure: isProduction,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 365,
          path: "/",
        });

        return response;
      }
    }

    // User exists, use their userId
    const userId = existingUser.userId;

    // Get user
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Update last login
    const updatedUser = await updateUser(userId, {
      lastLoginAt: Timestamp.now(),
    });

    // Get cookie store for checking/setting cookie
    const cookieStore = await cookies();

    // Set cookie if not already set
    const response = NextResponse.json({
      ok: true,
      user: {
        userId: updatedUser.userId,
        email: updatedUser.email,
        plan: updatedUser.plan,
        coins: updatedUser.coins,
        totalTokens: updatedUser.totalTokens,
      },
    });

    if (!cookieStore.get(COOKIE_NAME)) {
      const isProduction = process.env.NODE_ENV === "production";
      response.cookies.set(COOKIE_NAME, userId, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
      });
    }

    return response;
  } catch (error: any) {
    console.error("Sign-in error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Failed to sign in",
      },
      { status: 500 }
    );
  }
}

