// src/app/api/admin/stats/route.ts

import { NextResponse } from "next/server";
import { checkAdminSecretKey } from "@/lib/adminAuth";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

export interface AdminStats {
  totalUsers: number;
  freeUsers: number;
  proUsers: number;
  totalCoins: number;
  proConversionRate: number;
  lastUpdated: string;
}

export async function GET(req: Request) {
  try {
    if (!checkAdminSecretKey(req)) {
      return NextResponse.json(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { db } = getFirebaseAdmin();
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

    const proConversionRate =
      totalUsers > 0 ? (proUsers / totalUsers) * 100 : 0;

    const stats: AdminStats = {
      totalUsers,
      freeUsers,
      proUsers,
      totalCoins,
      proConversionRate: Math.round(proConversionRate * 100) / 100, // Round to 2 decimal places
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({ ok: true, ...stats });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
