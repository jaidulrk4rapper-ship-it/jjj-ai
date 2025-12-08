import { NextResponse } from "next/server";
import { checkAdminSecretKey } from "@/lib/adminAuth";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
  req: Request,
  { params }: { params: { uid: string } }
) {
  try {
    if (!checkAdminSecretKey(req)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { amount } = await req.json();

    if (typeof amount !== "number") {
      return NextResponse.json(
        { error: "Amount must be a number" },
        { status: 400 }
      );
    }

    const { db } = getFirebaseAdmin();
    const ref = db.collection("jjjaiUsers").doc(params.uid);

    await ref.set(
      {
        coins: FieldValue.increment(amount),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin add coins error:", error);
    return NextResponse.json(
      { error: "Failed to update coins" },
      { status: 500 }
    );
  }
}

