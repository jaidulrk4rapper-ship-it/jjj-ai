import { NextRequest, NextResponse } from "next/server";
import { checkAdminSecretKey } from "@/lib/adminAuth";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ uid: string }> }
) {
  try {
    if (!checkAdminSecretKey(req)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { params } = context;
    const { uid } = await params;

    const { db } = getFirebaseAdmin();
    const doc = await db.collection("jjjaiUsers").doc(uid).get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const data = doc.data()!;
    return NextResponse.json({
      uid: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || data.createdAt || null,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt || null,
      proSince: data.proSince?.toDate?.() || data.proSince || null,
    });
  } catch (error: any) {
    console.error("Admin get user error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ uid: string }> }
) {
  try {
    if (!checkAdminSecretKey(req)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { params } = context;
    const { uid } = await params;

    const body = await req.json();
    const { plan, coins } = body;

    const { db } = getFirebaseAdmin();
    const ref = db.collection("jjjaiUsers").doc(uid);

    const update: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (plan !== undefined) {
      update.plan = plan;
    }

    if (coins !== undefined) {
      update.coins = coins;
    }

    await ref.set(update, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin update user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ uid: string }> }
) {
  try {
    if (!checkAdminSecretKey(req)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { params } = context;
    const { uid } = await params;

    const { db } = getFirebaseAdmin();
    await db.collection("jjjaiUsers").doc(uid).delete();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

