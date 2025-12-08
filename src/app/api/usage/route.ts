import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import { getUserById } from "@/lib/users";

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    
    let userDoc;
    try {
      userDoc = await getUserById(userId);
    } catch (error: any) {
      // If Firebase isn't configured, return default usage data
      console.error("Database error in usage API:", error);
      if (error?.isFirebaseConfigError || 
          (error instanceof Error && error.message.includes("FIREBASE_SERVICE_ACCOUNT_KEY")) ||
          (error instanceof Error && error.message.includes("Firebase not configured"))) {
        return NextResponse.json({
          plan: "free",
          usage: {
            chat: { used: 0, limit: 30, period: "day" },
            tts: { used: 0, limit: 5, period: "day" },
            image: { used: 0, limit: 5, period: "day" },
          },
        });
      }
      // For any other error, still return default data instead of crashing
      console.warn("Unexpected error in usage API, returning default data:", error);
      return NextResponse.json({
        plan: "free",
        usage: {
          chat: { used: 0, limit: 30, period: "day" },
          tts: { used: 0, limit: 5, period: "day" },
          image: { used: 0, limit: 5, period: "day" },
        },
      });
    }
    
    if (!userDoc) {
      // Return default free plan data if user not found
      return NextResponse.json({
        plan: "free",
        usage: {
          chat: { used: 0, limit: 30, period: "day" },
          tts: { used: 0, limit: 5, period: "day" },
          image: { used: 0, limit: 5, period: "day" },
        },
      });
    }

    const plan = userDoc.plan || "free";
    
    const now = new Date();
    const dayKey = now.toISOString().slice(0, 10);
    const monthKey = now.toISOString().slice(0, 7);

    if (plan === "free") {
      return NextResponse.json({
        plan: "free",
        usage: {
          chat: {
            used: userDoc.chatDaily?.[dayKey]?.messages || 0,
            limit: Number(process.env.JJJAI_FREE_MAX_CHAT_MESSAGES_PER_DAY || "30"),
            period: "day",
          },
          tts: {
            used: userDoc.ttsDaily?.[dayKey]?.clips || 0,
            limit: Number(process.env.JJJAI_FREE_MAX_TTS_CLIPS_PER_DAY || "5"),
            period: "day",
          },
          image: {
            used: (userDoc as any).imageDaily?.[dayKey]?.images || 0,
            limit: Number(process.env.JJJAI_FREE_MAX_IMAGES_PER_DAY || "5"),
            period: "day",
          },
        },
      });
    } else {
      // Pro plan - monthly limits
      return NextResponse.json({
        plan: "pro",
        usage: {
          chat: {
            used: userDoc.chatMonthly?.[monthKey]?.messages || 0,
            limit: Number(process.env.JJJAI_PRO_MAX_CHAT_MESSAGES_PER_MONTH || "1000"),
            period: "month",
          },
          tts: {
            used: Math.floor((userDoc.ttsMonthly?.[monthKey]?.seconds || 0) / 60),
            limit: Number(process.env.JJJAI_PRO_MAX_TTS_MINUTES_PER_MONTH || "300"),
            period: "month",
            unit: "minutes",
          },
          image: {
            used: (userDoc as any).imageMonthly?.[monthKey]?.images || 0,
            limit: Number(process.env.JJJAI_PRO_MAX_IMAGES_PER_MONTH || "300"),
            period: "month",
          },
        },
      });
    }
  } catch (error) {
    console.error("Error fetching usage:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage data" },
      { status: 500 }
    );
  }
}

