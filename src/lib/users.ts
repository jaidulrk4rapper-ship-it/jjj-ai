// src/lib/users.ts
// User management helpers for guest + email sign-in system

import { getFirebaseAdmin } from "./firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import * as admin from "firebase-admin";

export type JjjPlan = "free" | "pro";

export interface JjjUser {
  userId: string;
  email?: string | null;
  passwordHash?: string | null; // Hashed password
  isGuest: boolean;
  plan: JjjPlan;
  coins: number;
  totalTokens: number;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
  lastLoginAt?: admin.firestore.Timestamp;
  // Legacy fields (merged from existing JJJAIUserDoc)
  chatDaily?: Record<string, { messages: number }>;
  ttsDaily?: Record<string, { clips: number; seconds: number }>;
  chatMonthly?: Record<string, { messages: number }>;
  ttsMonthly?: Record<string, { clips: number; seconds: number }>;
  proSince?: Date | admin.firestore.Timestamp;
  proSource?: string;
}

function getDb() {
  try {
    const { db } = getFirebaseAdmin();
    return db;
  } catch (error) {
    if (error instanceof Error && error.message.includes("FIREBASE_SERVICE_ACCOUNT_KEY")) {
      const firebaseError = new Error("Firebase not configured");
      (firebaseError as any).isFirebaseConfigError = true;
      throw firebaseError;
    }
    throw error;
  }
}

/**
 * Ensure a guest user exists or get existing user
 */
export async function ensureGuestUser(deviceId: string): Promise<JjjUser> {
  try {
    const db = getDb();
    const ref = db.collection("jjjaiUsers").doc(deviceId);
    const snap = await ref.get();

    const now = admin.firestore.Timestamp.now();

    if (!snap.exists) {
      // Create new guest user
      const newUser: JjjUser = {
        userId: deviceId,
        email: null,
        isGuest: true,
        plan: "free",
        coins: 0,
        totalTokens: 0,
        createdAt: now,
        updatedAt: now,
      };
      await ref.set(newUser);
      return newUser;
    }

    // Get existing user and ensure required fields exist
    const data = snap.data() as Partial<JjjUser>;
    const user: JjjUser = {
      userId: deviceId,
      email: data.email ?? null,
      passwordHash: data.passwordHash ?? null,
      isGuest: data.isGuest ?? (data.email ? false : true),
      plan: (data.plan as JjjPlan) ?? "free",
      coins: data.coins ?? 0,
      totalTokens: data.totalTokens ?? 0,
      createdAt: data.createdAt ?? now,
      updatedAt: data.updatedAt ?? now,
      lastLoginAt: data.lastLoginAt,
      // Preserve legacy fields
      chatDaily: data.chatDaily,
      ttsDaily: data.ttsDaily,
      chatMonthly: data.chatMonthly,
      ttsMonthly: data.ttsMonthly,
      proSince: data.proSince,
      proSource: data.proSource,
    };

    // Update if missing required fields
    const needsUpdate = 
      data.isGuest === undefined ||
      data.coins === undefined ||
      data.totalTokens === undefined ||
      !data.createdAt ||
      !data.updatedAt;

    if (needsUpdate) {
      await ref.set({
        isGuest: user.isGuest,
        coins: user.coins,
        totalTokens: user.totalTokens,
        createdAt: user.createdAt,
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    }

    return user;
  } catch (error: any) {
    if (error?.isFirebaseConfigError) {
      // Return a default guest user if Firebase isn't configured
      const now = admin.firestore.Timestamp.now();
      return {
        userId: deviceId,
        email: null,
        isGuest: true,
        plan: "free",
        coins: 0,
        totalTokens: 0,
        createdAt: now,
        updatedAt: now,
      };
    }
    throw error;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<JjjUser | null> {
  try {
    const db = getDb();
    const snapshot = await db
      .collection("jjjaiUsers")
      .where("email", "==", email.toLowerCase())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data() as Partial<JjjUser>;
    const now = admin.firestore.Timestamp.now();

    return {
      userId: doc.id,
      email: data.email ?? null,
      passwordHash: data.passwordHash ?? null,
      isGuest: data.isGuest ?? (data.email ? false : true),
      plan: (data.plan as JjjPlan) ?? "free",
      coins: data.coins ?? 0,
      totalTokens: data.totalTokens ?? 0,
      createdAt: data.createdAt ?? now,
      updatedAt: data.updatedAt ?? now,
      lastLoginAt: data.lastLoginAt,
      chatDaily: data.chatDaily,
      ttsDaily: data.ttsDaily,
      chatMonthly: data.chatMonthly,
      ttsMonthly: data.ttsMonthly,
      proSince: data.proSince,
      proSource: data.proSource,
    };
  } catch (error: any) {
    if (error?.isFirebaseConfigError) {
      return null;
    }
    throw error;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<JjjUser | null> {
  try {
    const db = getDb();
    const ref = db.collection("jjjaiUsers").doc(userId);
    const snap = await ref.get();

    if (!snap.exists) {
      return null;
    }

    const data = snap.data() as Partial<JjjUser>;
    const now = admin.firestore.Timestamp.now();

    return {
      userId,
      email: data.email ?? null,
      passwordHash: data.passwordHash ?? null,
      isGuest: data.isGuest ?? (data.email ? false : true),
      plan: (data.plan as JjjPlan) ?? "free",
      coins: data.coins ?? 0,
      totalTokens: data.totalTokens ?? 0,
      createdAt: data.createdAt ?? now,
      updatedAt: data.updatedAt ?? now,
      lastLoginAt: data.lastLoginAt,
      // Preserve legacy fields
      chatDaily: data.chatDaily,
      ttsDaily: data.ttsDaily,
      chatMonthly: data.chatMonthly,
      ttsMonthly: data.ttsMonthly,
      proSince: data.proSince,
      proSource: data.proSource,
    };
  } catch (error: any) {
    if (error?.isFirebaseConfigError) {
      return null;
    }
    throw error;
  }
}

/**
 * Update user document
 */
export async function updateUser(
  userId: string,
  data: Partial<JjjUser>
): Promise<JjjUser> {
  try {
    const db = getDb();
    const ref = db.collection("jjjaiUsers").doc(userId);

    const updateData: Record<string, any> = {
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    };

    // Remove userId from update (it's the document ID)
    delete updateData.userId;

    await ref.set(updateData, { merge: true });

    // Return updated user
    const updated = await getUserById(userId);
    if (!updated) {
      throw new Error("User not found after update");
    }
    return updated;
  } catch (error: any) {
    if (error?.isFirebaseConfigError) {
      throw new Error("Firebase not configured. Cannot update user.");
    }
    throw error;
  }
}

