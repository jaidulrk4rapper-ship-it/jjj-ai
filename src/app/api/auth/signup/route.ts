// src/app/api/auth/signup/route.ts
// Signup API - Creates new user account

import { NextRequest, NextResponse } from "next/server";
import { ensureGuestUser, updateUser, getUserByEmail, getUserById } from "@/lib/users";
import { cookies } from "next/headers";
import { Timestamp } from "firebase-admin/firestore";
import { hashPassword } from "@/lib/password";

const COOKIE_NAME = "jjj_device_id";

function validateEmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body as { 
      email?: string; 
      password?: string;
    };

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { ok: false, error: "Email is required" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { ok: false, error: "Password is required" },
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

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { ok: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists with this email
    const existingUser = await getUserByEmail(normalizedEmail);
    
    if (existingUser) {
      return NextResponse.json(
        { ok: false, error: "An account with this email already exists. Please sign in instead." },
        { status: 400 }
      );
    }

    // Get userId from cookie or header, or create new one
    const cookieStore = await cookies();
    let userId: string | null = cookieStore.get(COOKIE_NAME)?.value || null;
    
    if (!userId) {
      userId = req.headers.get("x-user-id");
    }

    // Create new user ID if not exists
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Get or create user (might be guest user)
    let user = await getUserById(userId);
    if (!user) {
      user = await ensureGuestUser(userId);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Prepare update data for new account
    const updateData: any = {
      email: normalizedEmail,
      isGuest: false,
      passwordHash: passwordHash,
      lastLoginAt: Timestamp.now(),
    };

    // Update user to create account
    const updatedUser = await updateUser(userId, updateData);

    // Set cookie
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
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Failed to create account",
      },
      { status: 500 }
    );
  }
}

