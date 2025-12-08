// src/lib/db.ts

import { getFirebaseAdmin } from "./firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import * as admin from "firebase-admin";

function getDb() {
  try {
    const { db } = getFirebaseAdmin();
    return db;
  } catch (error) {
    // If Firebase isn't configured, throw a more specific error that can be caught
    if (error instanceof Error && error.message.includes("FIREBASE_SERVICE_ACCOUNT_KEY")) {
      const firebaseError = new Error("Firebase not configured");
      (firebaseError as any).isFirebaseConfigError = true;
      throw firebaseError;
    }
    throw error;
  }
}

export type JJJAIPlan = "free" | "pro";

export interface JJJAIUserDoc {
  email?: string;
  plan: JJJAIPlan;
  chatDaily?: Record<string, { messages: number }>;
  ttsDaily?: Record<string, { clips: number; seconds: number }>;
  chatMonthly?: Record<string, { messages: number }>;
  ttsMonthly?: Record<string, { clips: number; seconds: number }>;
  proSince?: Date | admin.firestore.Timestamp;
  proSource?: string;
  coins?: number; // Coins for premium features (e.g., video generation)
  createdAt?: admin.firestore.Timestamp;
  updatedAt?: admin.firestore.Timestamp;
}

export async function getUserDoc(uid: string) {
  try {
    const db = getDb();
    const ref = db.collection("jjjaiUsers").doc(uid);
    const snap = await ref.get();
    if (!snap.exists) return null;
    return snap.data() as JJJAIUserDoc;
  } catch (error: any) {
    if (error?.isFirebaseConfigError) {
      return null; // Return null if Firebase isn't configured
    }
    throw error;
  }
}

export async function ensureUserDoc(uid: string, email?: string | null) {
  try {
    const db = getDb();
    const ref = db.collection("jjjaiUsers").doc(uid);
    const snap = await ref.get();

    if (!snap.exists) {
      const now = new Date();
      const doc: JJJAIUserDoc = {
        email: email || undefined,
        plan: "free",
        coins: 0, // Start with 0 coins
        createdAt: admin.firestore.Timestamp.fromDate(now),
        updatedAt: admin.firestore.Timestamp.fromDate(now),
      };
      await ref.set(doc, { merge: true });
      return doc;
    }

    return snap.data() as JJJAIUserDoc;
  } catch (error: any) {
    if (error?.isFirebaseConfigError) {
      // Return a default doc if Firebase isn't configured
      return { plan: "free" } as JJJAIUserDoc;
    }
    throw error;
  }
}

export async function incrementUsage(
  uid: string,
  tool: "chat" | "tts" | "image",
  usage: { messages?: number; clips?: number; seconds?: number; images?: number }
) {
  try {
    const db = getDb();
    const ref = db.collection("jjjaiUsers").doc(uid);
    const now = new Date();
    const dayKey = now.toISOString().slice(0, 10); // 2025-12-06
    const monthKey = now.toISOString().slice(0, 7); // 2025-12

    const update: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (tool === "chat" && usage.messages) {
      update[`chatDaily.${dayKey}.messages`] = FieldValue.increment(
        usage.messages
      );
      update[`chatMonthly.${monthKey}.messages`] = FieldValue.increment(
        usage.messages
      );
    }

    if (tool === "tts") {
      if (usage.clips) {
        update[`ttsDaily.${dayKey}.clips`] = FieldValue.increment(usage.clips);
        update[`ttsMonthly.${monthKey}.clips`] = FieldValue.increment(
          usage.clips
        );
      }
      if (usage.seconds) {
        update[`ttsDaily.${dayKey}.seconds`] = FieldValue.increment(
          usage.seconds
        );
        update[`ttsMonthly.${monthKey}.seconds`] = FieldValue.increment(
          usage.seconds
        );
      }
    }

    if (tool === "image" && usage.images) {
      update[`imageDaily.${dayKey}.images`] = FieldValue.increment(
        usage.images
      );
      update[`imageMonthly.${monthKey}.images`] = FieldValue.increment(
        usage.images
      );
    }

    await ref.set(update, { merge: true });
  } catch (error: any) {
    // Silently fail if Firebase isn't configured - usage tracking is optional
    if (error?.isFirebaseConfigError) {
      console.warn("Usage tracking skipped: Firebase not configured");
      return;
    }
    // Log other errors but don't throw - usage tracking shouldn't break the app
    console.error("Failed to increment usage:", error);
  }
}

/**
 * Upgrade user to Pro plan
 */
export async function upgradeUserToPro(uid: string, renewalDate: string): Promise<void> {
  try {
    const db = getDb();
    const ref = db.collection("jjjaiUsers").doc(uid);
    
    await ref.set({
      plan: "pro",
      proSource: "JJJ AI",
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
  } catch (error: any) {
    if (error?.isFirebaseConfigError) {
      throw new Error("Firebase not configured. Cannot upgrade user to Pro plan.");
    }
    throw error;
  }
}

/**
 * Get user's coin balance
 */
export async function getUserCoins(uid: string): Promise<number> {
  try {
    const userDoc = await getUserDoc(uid);
    return userDoc?.coins ?? 0;
  } catch (error: any) {
    if (error?.isFirebaseConfigError) {
      return 0; // Return 0 if Firebase not configured
    }
    throw error;
  }
}

/**
 * Deduct coins from user (for premium features)
 * Returns true if deduction was successful, false if insufficient coins
 */
export async function deductCoins(uid: string, amount: number): Promise<boolean> {
  try {
    const db = getDb();
    const ref = db.collection("jjjaiUsers").doc(uid);
    
    // Get current balance
    const userDoc = await getUserDoc(uid);
    const currentCoins = userDoc?.coins ?? 0;
    
    if (currentCoins < amount) {
      return false; // Insufficient coins
    }
    
    // Deduct coins
    await ref.set({
      coins: FieldValue.increment(-amount),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    
    return true;
  } catch (error: any) {
    if (error?.isFirebaseConfigError) {
      throw new Error("Firebase not configured. Cannot deduct coins.");
    }
    throw error;
  }
}

/**
 * Add coins to user (after purchase)
 */
export async function addCoins(uid: string, amount: number): Promise<void> {
  try {
    const db = getDb();
    const ref = db.collection("jjjaiUsers").doc(uid);
    
    await ref.set({
      coins: FieldValue.increment(amount),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
  } catch (error: any) {
    if (error?.isFirebaseConfigError) {
      throw new Error("Firebase not configured. Cannot add coins.");
    }
    throw error;
  }
}

/**
 * Get all users from Firestore
 */
export async function getAllUsers() {
  try {
    const db = getDb();
    const snapshot = await db.collection("jjjaiUsers").get();
    
    const users = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id,
        email: data.email || "N/A",
        plan: data.plan || "free",
        coins: data.coins || 0,
        createdAt: data.createdAt?.toDate?.() || data.createdAt || null,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt || null,
        proSince: data.proSince?.toDate?.() || data.proSince || null,
      };
    });
    
    // Sort by created date (newest first)
    users.sort((a, b) => {
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bDate - aDate;
    });
    
    return users;
  } catch (error: any) {
    if (error?.isFirebaseConfigError) {
      return [];
    }
    throw error;
  }
}

/**
 * Get user statistics (total, free, pro counts, total coins)
 */
export async function getUserStats() {
  try {
    const db = getDb();
    const snapshot = await db.collection("jjjaiUsers").get();
    
    let totalUsers = 0;
    let freeUsers = 0;
    let proUsers = 0;
    let totalCoins = 0;
    
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      totalUsers++;
      
      if (data.plan === "pro") {
        proUsers++;
      } else {
        freeUsers++;
      }
      
      // Sum up coins
      const coins = data.coins || 0;
      totalCoins += typeof coins === "number" ? coins : 0;
    });
    
    return {
      totalUsers,
      freeUsers,
      proUsers,
      totalCoins,
    };
  } catch (error: any) {
    if (error?.isFirebaseConfigError) {
      return {
        totalUsers: 0,
        freeUsers: 0,
        proUsers: 0,
        totalCoins: 0,
      };
    }
    throw error;
  }
}
