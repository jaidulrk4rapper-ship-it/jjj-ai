import { NextRequest, NextResponse } from "next/server";
import { checkAdminSecretKey } from "@/lib/adminAuth";
import { getDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ uid: string }> }
) {
  if (!checkAdminSecretKey(req)) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const { params } = context;
  const { uid } = await params;

  const db = getDb();
  const ref = db.collection("jjjaiUsers").doc(uid);

  const body = await req.json();
  const { amount } = body;

  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return NextResponse.json(
      { error: "Invalid amount" },
      { status: 400 }
    );
  }

  await ref.set(
    {
      coins: FieldValue.increment(amount),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return NextResponse.json({ success: true });
}
