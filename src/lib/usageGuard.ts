// src/lib/usageGuard.ts
import { getUserFromRequest } from "./auth";
import { JJJAIUserDoc, ensureUserDoc, getUserDoc } from "./db";

export type Tool = "chat" | "tts" | "image";

export type UsageCheckResult =
  | {
      allowed: true;
      userId: string;
      plan: "free" | "pro";
      userDoc: JJJAIUserDoc;
    }
  | {
      allowed: false;
      reason: string;
      status?: number;
    };

// Helper: read limit envs with default
function numEnv(name: string, fallback: number): number {
  const v = process.env[name];
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export async function checkUsage(
  req: Request,
  tool: Tool
): Promise<UsageCheckResult> {
  const user = await getUserFromRequest(req);
  
  // 🛡️ Option B: Sirf production me auth enforce karo
  // Dev mode me free access allow karo
  if (!user && process.env.NODE_ENV === "production") {
    return {
      allowed: false,
      reason: "Please sign in to use JJJ AI.",
      status: 401,
    };
  }
  
  // Dev mode me user nahi hai toh dummy user create karo
  if (!user) {
    // Return allowed with dummy user for dev mode
    return {
      allowed: true,
      userId: "dev-user",
      plan: "free",
      userDoc: { plan: "free" } as JJJAIUserDoc,
    };
  }

  // Ensure user doc exists (default plan = free)
  let existing: JJJAIUserDoc;
  try {
    existing = (await getUserDoc(user.uid)) || (await ensureUserDoc(user.uid, user.email));
  } catch (error) {
    console.error("Database error in checkUsage:", error);
    // If Firebase isn't configured, allow the request but log the error
    // This prevents the app from crashing during development
    if (error instanceof Error && error.message.includes("FIREBASE_SERVICE_ACCOUNT_KEY")) {
      return {
        allowed: true, // Allow requests when Firebase isn't configured
        userId: user.uid,
        plan: "free",
        userDoc: { plan: "free" } as JJJAIUserDoc,
      };
    }
    throw error;
  }
  
  const plan = (existing.plan ?? "free") as "free" | "pro";

  const now = new Date();
  const dayKey = now.toISOString().slice(0, 10);
  const monthKey = now.toISOString().slice(0, 7);

  // Free plan limits
  if (plan === "free") {
    if (tool === "chat") {
      const usedToday = existing.chatDaily?.[dayKey]?.messages ?? 0;
      const limit = numEnv("JJJAI_FREE_MAX_CHAT_MESSAGES_PER_DAY", 30);

      if (usedToday + 1 > limit) {
        return {
          allowed: false,
          status: 429,
          reason:
            "Aaj ka JJJ AI free chat limit khatam ho gaya. Kal try karo ya JJJ AI Pro activate karo.",
        };
      }
    }

    if (tool === "tts") {
      const usedClips = existing.ttsDaily?.[dayKey]?.clips ?? 0;
      const limitClips = numEnv("JJJAI_FREE_MAX_TTS_CLIPS_PER_DAY", 5);
      if (usedClips + 1 > limitClips) {
        return {
          allowed: false,
          status: 429,
          reason:
            "Aaj ka free voice limit khatam ho gaya. JJJ AI Pro se unlimited reels bana sakte ho.",
        };
      }
    }

    if (tool === "image") {
      const usedImages = (existing as any).imageDaily?.[dayKey]?.images ?? 0;
      const limitImages = numEnv("JJJAI_FREE_MAX_IMAGES_PER_DAY", 5);

      if (usedImages + 1 > limitImages) {
        return {
          allowed: false,
          status: 429,
          reason:
            "Aaj ka free image limit khatam ho gaya. JJJ AI Pro se aur zyada images generate kar sakte ho.",
        };
      }
    }
  }

  // PRO plan limits (soft): tum chaho to yahan bhi cap laga sakte ho.
  // For now, hum pro ko practically unlimited treat kar rahe.

  return {
    allowed: true,
    userId: user.uid,
    plan,
    userDoc: existing,
  };
}
