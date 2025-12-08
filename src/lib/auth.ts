// src/lib/auth.ts
// Helper to get userId from request (header or cookie)

import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { ensureGuestUser, getUserById } from "./users";

const COOKIE_NAME = "jjj_device_id";

/**
 * Get userId from request (header or cookie)
 * If missing, creates a guest user and returns its userId
 */
export async function getUserIdFromRequest(req: NextRequest | { headers?: { get?: (name: string) => string | null } }): Promise<string> {
  const nextReq = req as NextRequest;
  
  // Try header first
  let userId = nextReq.headers?.get?.("x-user-id") || (req as any).headers?.get?.("x-user-id");
  
  // Try cookie
  if (!userId) {
    try {
      const cookieStore = await cookies();
      userId = cookieStore.get(COOKIE_NAME)?.value || null;
    } catch {
      // Cookies might not be available in some contexts
    }
  }

  // If still missing, create guest user
  if (!userId) {
    const guestUser = await ensureGuestUser("temp_" + Date.now() + "_" + Math.random().toString(36).substring(7));
    userId = guestUser.userId;
  }

  return userId;
}

/**
 * Legacy compatibility: Get user object (for APIs that still expect old format)
 * @deprecated Use getUserIdFromRequest and getUserById instead
 */
export async function getUserFromRequestDev(req: NextRequest | { headers?: { get?: (name: string) => string | null } }): Promise<{ uid: string; email?: string } | null> {
  try {
    const userId = await getUserIdFromRequest(req);
    const user = await getUserById(userId);
    
    if (!user) {
      return null;
    }
    
    return {
      uid: user.userId,
      email: user.email || undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Legacy compatibility: Get user object
 * @deprecated Use getUserIdFromRequest and getUserById instead
 */
export async function getUserFromRequest(req: NextRequest | { headers?: { get?: (name: string) => string | null } }): Promise<{ uid: string; email?: string } | null> {
  return getUserFromRequestDev(req);
}
