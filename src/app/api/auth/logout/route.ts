// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "jjj_device_id";

export async function POST(req: NextRequest) {
  try {
    // Clear the device ID cookie with proper options
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";
    
    // Create response
    const response = NextResponse.json(
      {
        ok: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );
    
    // Clear cookie by setting it with expired date
    response.cookies.set(COOKIE_NAME, "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 0, // Expire immediately
      path: "/",
    });
    
    // Also try to delete from cookie store
    cookieStore.delete(COOKIE_NAME);
    
    return response;
  } catch (error: any) {
    console.error("Logout error:", error);
    
    // Even on error, return success response with cleared cookie
    const response = NextResponse.json(
      {
        ok: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );
    
    // Try to clear cookie even on error
    const isProduction = process.env.NODE_ENV === "production";
    response.cookies.set(COOKIE_NAME, "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
    
    return response;
  }
}

