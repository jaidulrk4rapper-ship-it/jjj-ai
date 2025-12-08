import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { ensureUserDoc, JJJAIUserDoc } from "@/lib/db";
import {
  TTS_FREE_MAX_CHARS,
  TTS_PRO_MAX_CHARS,
  TTS_FREE_DAILY_LIMIT,
  TTS_PRO_DAILY_LIMIT,
} from "@/config/usage";

export interface TTSUsageInfo {
  ok: boolean;
  plan: "free" | "pro";
  todayClips: number;
  dailyLimit: number;
  maxChars: number;
}

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);

    // In production, require auth. In dev, allow without auth
    if (!user && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { ok: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Dev mode: use dummy user if not authenticated
    const uid = user?.uid || "dev-user";
    const email = user?.email;

    const userDoc = await ensureUserDoc(uid, email);

    const now = new Date();
    const dayKey = now.toISOString().slice(0, 10); // "YYYY-MM-DD"

    const plan = userDoc.plan ?? "free";
    const ttsDaily = userDoc.ttsDaily || {};
    const today = ttsDaily[dayKey] || { clips: 0, seconds: 0 };

    const dailyLimit =
      plan === "pro" ? TTS_PRO_DAILY_LIMIT : TTS_FREE_DAILY_LIMIT;
    const maxChars =
      plan === "pro" ? TTS_PRO_MAX_CHARS : TTS_FREE_MAX_CHARS;

    const response: TTSUsageInfo = {
      ok: true,
      plan,
      todayClips: today.clips || 0,
      dailyLimit,
      maxChars,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error fetching TTS usage:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch usage data" },
      { status: 500 }
    );
  }
}

