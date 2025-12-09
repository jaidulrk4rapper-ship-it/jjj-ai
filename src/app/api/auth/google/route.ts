// src/app/api/auth/google/route.ts
// Google OAuth callback handler

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ensureGuestUser, updateUser, getUserByEmail } from "@/lib/users";
import { Timestamp } from "firebase-admin/firestore";

const COOKIE_NAME = "jjj_device_id";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const email = searchParams.get("email");

    // If email is directly provided (from Chrome identity)
    if (email) {
      return handleEmailLogin(email, req);
    }

    // If OAuth code is provided
    if (code && GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
      return handleOAuthCode(code, req);
    }

    // If no code or email, redirect to login
    return NextResponse.redirect(new URL("/login?error=no_auth", req.url));
  } catch (error: any) {
    console.error("Google auth error:", error);
    return NextResponse.redirect(new URL("/login?error=auth_failed", req.url));
  }
}

async function handleEmailLogin(email: string, req: NextRequest) {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check if user exists
  let user = await getUserByEmail(normalizedEmail);
  let userId: string;

  if (user) {
    userId = user.userId;
    await updateUser(userId, {
      lastLoginAt: Timestamp.now(),
    });
  } else {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    user = await ensureGuestUser(userId);
    
    await updateUser(userId, {
      email: normalizedEmail,
      isGuest: false,
      lastLoginAt: Timestamp.now(),
    });
  }

  // Set cookie
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";
  
  const response = NextResponse.redirect(new URL("/", req.url));
  response.cookies.set(COOKIE_NAME, userId, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return response;
}

async function handleOAuthCode(code: string, req: NextRequest) {
  try {
    // Exchange code for token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${req.nextUrl.origin}/api/auth/google`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user info from Google
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      throw new Error("Failed to get user info");
    }

    const userInfo = await userInfoResponse.json();
    const email = userInfo.email;

    if (!email) {
      return NextResponse.redirect(new URL("/login?error=no_email", req.url));
    }

    return handleEmailLogin(email, req);
  } catch (error: any) {
    console.error("OAuth code handling error:", error);
    return NextResponse.redirect(new URL("/login?error=auth_failed", req.url));
  }
}
