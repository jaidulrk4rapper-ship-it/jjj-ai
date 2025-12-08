// src/lib/auth.ts

export interface JJJAIUser {
  uid: string;
  email?: string;
}

/**
 * TEMP implementation:
 *  - Frontend se har API call me header bhejo:
 *      x-jjjai-user-id: <uid>
 *      x-jjjai-user-email: <email>
 *
 *  - Later yahi function Firebase Auth / JWT verify se replace kar dena.
 */
export async function getUserFromRequest(req: Request): Promise<JJJAIUser | null> {
  const uid = req.headers.get("x-jjjai-user-id");
  const email = req.headers.get("x-jjjai-user-email") || undefined;

  if (!uid) return null;
  return { uid, email };
}

/**
 * Alias for backward compatibility
 */
export async function getUserFromRequestDev(req: Request): Promise<JJJAIUser | null> {
  return getUserFromRequest(req);
}
