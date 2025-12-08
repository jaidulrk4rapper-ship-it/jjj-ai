import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ uid: string }> }
) {
  const { params } = context;
  const { uid } = await params;

  const db = getDb();
  const ref = db.collection("jjjaiUsers").doc(uid);

  const body = await req.json();
  const { plan } = body;

  if (plan !== "free" && plan !== "pro") {
    return NextResponse.json(
      { error: "Invalid plan" },
      { status: 400 }
    );
  }

  const update: any = {
    plan,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (plan === "pro") {
    update.proSince = FieldValue.serverTimestamp();
    update.proSource = "JJJ AI";
  }

  await ref.set(update, { merge: true });

  return NextResponse.json({ success: true });
}

