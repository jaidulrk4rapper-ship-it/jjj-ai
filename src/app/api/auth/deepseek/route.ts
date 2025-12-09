// src/app/api/auth/deepseek/route.ts
// DeepSeek-style authentication API

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

// Login endpoint
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, action } = body as { 
      email?: string; 
      password?: string;
      action?: "login" | "signup";
    };

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { ok: false, error: "Email is required" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cookieStore = await cookies();
    let userId: string | null = cookieStore.get(COOKIE_NAME)?.value || null;
    
    if (!userId) {
      userId = req.headers.get("x-user-id");
    }

    if (action === "signup") {
      // Sign up flow
      if (!password || typeof password !== "string" || password.length < 6) {
        return NextResponse.json(
          { ok: false, error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }

      const existingUser = await getUserByEmail(normalizedEmail);
      if (existingUser) {
        return NextResponse.json(
          { ok: false, error: "An account with this email already exists. Please log in instead." },
          { status: 400 }
        );
      }

      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      let user = await getUserById(userId);
      if (!user) {
        user = await ensureGuestUser(userId);
      }

      const passwordHash = await hashPassword(password);
      const updateData: any = {
        email: normalizedEmail,
        isGuest: false,
        passwordHash: passwordHash,
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
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;
    } else {
      // Login flow
      if (!password || typeof password !== "string") {
        return NextResponse.json(
          { ok: false, error: "Password is required" },
          { status: 400 }
        );
      }

      const existingUser = await getUserByEmail(normalizedEmail);
      if (!existingUser) {
        return NextResponse.json(
          { ok: false, error: "No account found with this email. Please sign up first." },
          { status: 404 }
        );
      }

      if (!existingUser.passwordHash) {
        return NextResponse.json(
          { ok: false, error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const isValid = await verifyPassword(password, existingUser.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { ok: false, error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const userId = existingUser.userId;
      const user = await getUserById(userId);
      if (!user) {
        return NextResponse.json(
          { ok: false, error: "User not found" },
          { status: 404 }
        );
      }

      const updatedUser = await updateUser(userId, {
        lastLoginAt: Timestamp.now(),
      });

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
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
      }

      return response;
    }
  } catch (error: any) {
    console.error("DeepSeek auth error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Authentication failed",
      },
      { status: 500 }
    );
  }
}

