// src/app/api/admin/login/route.ts

import { NextResponse } from "next/server";

// Use hardcoded password (fallback to env var if set)
// This ensures it works even if env vars aren't loaded
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "IdujjGF304W975#7OIH";
const ADMIN_SECRET_KEY =
  process.env.ADMIN_SECRET_KEY || "JJJAI_SUPER_ADMIN_999";

// Log on module load to verify
if (process.env.NODE_ENV !== "production") {
  console.log("Admin login route loaded. Password length:", ADMIN_PASSWORD?.length || 0);
}

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    // Hardcoded password for now (to bypass env var issues)
    const correctPassword = "IdujjGF304W975#7OIH";
    
    // Trim whitespace and compare
    const trimmedPassword = (password || "").trim();
    const trimmedCorrectPassword = correctPassword.trim();

    // Debug logging
    console.log("=== LOGIN ATTEMPT ===");
    console.log("Provided password length:", trimmedPassword.length);
    console.log("Expected password length:", trimmedCorrectPassword.length);
    console.log("Provided first 3 chars:", trimmedPassword.substring(0, 3));
    console.log("Expected first 3 chars:", trimmedCorrectPassword.substring(0, 3));
    console.log("Provided last 3 chars:", trimmedPassword.substring(trimmedPassword.length - 3));
    console.log("Expected last 3 chars:", trimmedCorrectPassword.substring(trimmedCorrectPassword.length - 3));
    console.log("Exact match:", trimmedPassword === trimmedCorrectPassword);
    console.log("Env ADMIN_PASSWORD:", ADMIN_PASSWORD ? "SET" : "NOT SET");
    console.log("====================");

    if (!trimmedPassword || trimmedPassword !== trimmedCorrectPassword) {
      return NextResponse.json(
        { 
          ok: false, 
          error: `Invalid password. Expected length: ${trimmedCorrectPassword.length}, Got: ${trimmedPassword.length}` 
        },
        { status: 401 }
      );
    }

    // Simple dev login – front-end ko adminKey bhej rahe
    return NextResponse.json({
      ok: true,
      adminKey: ADMIN_SECRET_KEY,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Login failed" },
      { status: 500 }
    );
  }
}
