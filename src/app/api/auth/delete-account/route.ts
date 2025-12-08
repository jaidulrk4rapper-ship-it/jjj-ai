// src/app/api/auth/delete-account/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserIdFromRequest } from "@/lib/auth";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

const COOKIE_NAME = "jjj_device_id";

export async function POST(req: NextRequest) {
  try {
    // Get user ID from request
    const userId = await getUserIdFromRequest(req);
    
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Delete user document from Firestore
    const { db } = getFirebaseAdmin();
    const userRef = db.collection("jjjaiUsers").doc(userId);
    
    // Check if user exists
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      // User doesn't exist, but still clear cookie and return success
      const cookieStore = await cookies();
      const isProduction = process.env.NODE_ENV === "production";
      
      const response = NextResponse.json({
        ok: true,
        message: "Account already deleted",
      });
      
      response.cookies.set(COOKIE_NAME, "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      });
      
      cookieStore.delete(COOKIE_NAME);
      return response;
    }

    // Delete the user document
    await userRef.delete();

    // Clear the device ID cookie properly
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";
    
    const response = NextResponse.json({
      ok: true,
      message: "Account deleted successfully",
    });
    
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
    console.error("Delete account error:", error);
    
    // Even on error, try to clear cookie
    try {
      const cookieStore = await cookies();
      const isProduction = process.env.NODE_ENV === "production";
      
      const errorResponse = NextResponse.json(
        { ok: false, error: error.message || "Failed to delete account" },
        { status: 500 }
      );
      
      errorResponse.cookies.set(COOKIE_NAME, "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      });
      
      cookieStore.delete(COOKIE_NAME);
      return errorResponse;
    } catch (cookieError) {
      return NextResponse.json(
        { ok: false, error: error.message || "Failed to delete account" },
        { status: 500 }
      );
    }
  }
}

