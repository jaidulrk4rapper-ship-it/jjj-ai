// src/lib/adminAuth.ts

/**
 * Simple admin authentication
 * In production, use proper JWT/Firebase Auth
 */

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "IdujjGF304W975#7OIH";
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function getAdminFromRequest(req: Request): boolean {
  // Check for admin secret key in header (required for API access)
  const adminKey = req.headers.get("x-admin-key");
  if (ADMIN_SECRET_KEY && adminKey !== ADMIN_SECRET_KEY) {
    return false;
  }
  
  // Also check for admin token (for login-based access)
  const adminToken = req.headers.get("x-admin-token");
  return adminToken === ADMIN_PASSWORD;
}

export function checkAdminSecretKey(req: Request): boolean {
  if (!ADMIN_SECRET_KEY) {
    // If no secret key is set, allow access (for development)
    return true;
  }
  
  const adminKey = req.headers.get("x-admin-key");
  return adminKey === ADMIN_SECRET_KEY;
}

