import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { ensureUserDoc, incrementUsage, JJJAIUserDoc } from "@/lib/db";
import {
  TTS_FREE_MAX_CHARS,
  TTS_PRO_MAX_CHARS,
  TTS_FREE_DAILY_LIMIT,
  TTS_PRO_DAILY_LIMIT,
  TTS_CHARS_PER_SECOND,
} from "@/config/usage";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const ALLOWED_VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"] as const;
type AllowedVoice = (typeof ALLOWED_VOICES)[number];

export async function POST(req: Request) {
  try {
    // Auth + user doc
    const user = await getUserFromRequest(req);

    // In production, require auth. In dev, allow without auth (like usageGuard)
    if (!user && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Dev mode: use dummy user if not authenticated
    const uid = user?.uid || "dev-user";
    const email = user?.email;

    const userDoc = await ensureUserDoc(uid, email);

    // Determine plan + limits
    const plan = userDoc.plan ?? "free";
    const maxChars =
      plan === "pro" ? TTS_PRO_MAX_CHARS : TTS_FREE_MAX_CHARS;
    const dailyLimit =
      plan === "pro" ? TTS_PRO_DAILY_LIMIT : TTS_FREE_DAILY_LIMIT;

    // Read today's usage from ttsDaily
    const now = new Date();
    const dayKey = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const todayClips = userDoc.ttsDaily?.[dayKey]?.clips ?? 0;

    // Parse request body
    const { text, voice } = await req.json();

    // Validation before calling OpenAI
    const trimmed = typeof text === "string" ? text.trim() : "";

    if (!trimmed) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    if (trimmed.length > maxChars) {
      return NextResponse.json(
        {
          error: `Text too long for your plan. Max ${maxChars} characters.`,
          plan,
          maxChars,
        },
        { status: 400 }
      );
    }

    if (todayClips >= dailyLimit) {
      return NextResponse.json(
        {
          error: "Daily TTS limit reached for your plan.",
          plan,
          todayClips,
          dailyLimit,
        },
        { status: 429 }
      );
    }

    // Voice validation
    const rawVoice = (voice as string) || "alloy";
    const selectedVoice: AllowedVoice = ALLOWED_VOICES.includes(rawVoice as AllowedVoice)
      ? (rawVoice as AllowedVoice)
      : "alloy";

    // Call OpenAI TTS
    const response = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: selectedVoice,
      input: trimmed,
    });

    const audioBuffer = Buffer.from(await response.arrayBuffer());

    // Increment usage after successful generation
    const approxSeconds = Math.max(
      1,
      Math.round(trimmed.length / TTS_CHARS_PER_SECOND)
    );

    await incrementUsage(uid, "tts", {
      clips: 1,
      seconds: approxSeconds,
    });

    // Return audio with usage headers
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
        "X-TTS-Plan": plan,
        "X-TTS-Today": String(todayClips + 1),
        "X-TTS-DailyLimit": String(dailyLimit),
      },
    });
  } catch (error: any) {
    console.error("OpenAI TTS error:", error);
    
    // Handle OpenAI API errors
    if (error?.status === 401) {
      return NextResponse.json(
        { error: "Invalid OpenAI API key" },
        { status: 500 }
      );
    }
    
    if (error?.status === 429) {
      return NextResponse.json(
        { error: "OpenAI API rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "OpenAI TTS failed" },
      { status: 500 }
    );
  }
}

