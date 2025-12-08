import { NextResponse } from "next/server";
import { getUserFromRequestDev } from "@/lib/auth";
import { getUserCoins } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequestDev(req);
    
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to check coin balance." },
        { status: 401 }
      );
    }

    const coins = await getUserCoins(user.uid);

    return NextResponse.json({ coins });
  } catch (error: any) {
    console.error("Error getting coin balance:", error);
    return NextResponse.json(
      { error: "Failed to get coin balance", coins: 0 },
      { status: 500 }
    );
  }
}

