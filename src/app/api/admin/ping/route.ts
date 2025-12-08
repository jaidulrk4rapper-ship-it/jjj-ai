// src/app/api/admin/ping/route.ts

import { NextResponse } from "next/server";
import { checkAdminSecretKey } from "@/lib/adminAuth";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

export async function GET(req: Request) {
  if (!checkAdminSecretKey(req)) {
    return NextResponse.json(
      { ok: false, error: "Forbidden" },
      { status: 403 }
    );
  }
  try {
    const { db } = getFirebaseAdmin();

    // Just test query (no data required)
    const snap = await db.collection("jjjaiUsers").limit(1).get();

    return NextResponse.json({
      ok: true,
      message: "Admin Firestore connected ✅",
      sampleCount: snap.size,
    });
  } catch (error: any) {
    console.error("ADMIN PING ERROR >>>", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Admin ping failed ❌",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}

