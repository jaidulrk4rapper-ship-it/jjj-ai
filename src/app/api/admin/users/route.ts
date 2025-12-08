// src/app/api/admin/users/route.ts

import { NextResponse } from "next/server";
import { checkAdminSecretKey } from "@/lib/adminAuth";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export interface AdminUser {
  uid: string;
  email?: string;
  plan: "free" | "pro";
  coins: number;
  createdAt?: string;
  updatedAt?: string;
}

interface UpdateUserBody {
  uid: string;
  plan?: "free" | "pro";
  coinsDelta?: number;
}

export async function GET(req: Request) {
  try {
    if (!checkAdminSecretKey(req)) {
      return NextResponse.json(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const { db } = getFirebaseAdmin();
    const snapshot = await db
      .collection("jjjaiUsers")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const users: AdminUser[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      // Show "Guest user" if no email and isGuest is true (or email is missing)
      const email = data.email || (data.isGuest ? "Guest user" : undefined);
      return {
        uid: doc.id,
        email: email,
        plan: data.plan || "free",
        coins: data.coins || 0,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || undefined,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || undefined,
      };
    });

    return NextResponse.json({ ok: true, users });
  } catch (error: any) {
    console.error("Admin users GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    if (!checkAdminSecretKey(req)) {
      return NextResponse.json(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body: UpdateUserBody = await req.json();
    const { uid, plan, coinsDelta } = body;

    if (!uid) {
      return NextResponse.json(
        { ok: false, error: "uid is required" },
        { status: 400 }
      );
    }

    const { db } = getFirebaseAdmin();
    const userRef = db.collection("jjjaiUsers").doc(uid);

    // Check if user exists
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    // Update plan if provided
    if (plan !== undefined) {
      updateData.plan = plan;
      if (plan === "pro") {
        const currentData = userDoc.data();
        if (currentData?.plan !== "pro") {
          // Only set proSince if switching to pro
          updateData.proSince = FieldValue.serverTimestamp();
          updateData.proSource = "admin";
        }
      }
    }

    // Update coins if coinsDelta provided
    if (coinsDelta !== undefined) {
      updateData.coins = FieldValue.increment(coinsDelta);
    }

    await userRef.update(updateData);

    // Fetch updated user data
    const updatedDoc = await userRef.get();
    const updatedData = updatedDoc.data();

    const updatedUser: AdminUser = {
      uid: updatedDoc.id,
      email: updatedData?.email || undefined,
      plan: updatedData?.plan || "free",
      coins: updatedData?.coins || 0,
      createdAt: updatedData?.createdAt?.toDate?.()?.toISOString() || undefined,
      updatedAt: updatedData?.updatedAt?.toDate?.()?.toISOString() || undefined,
    };

    return NextResponse.json({ ok: true, user: updatedUser });
  } catch (error: any) {
    console.error("Admin users PATCH error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}
