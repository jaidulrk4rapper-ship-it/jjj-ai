import { NextRequest, NextResponse } from "next/server";
import { checkUsage } from "@/lib/usageGuard";
import { incrementUsage } from "@/lib/db";
import { getUserById } from "@/lib/users";
import { getUserIdFromRequest } from "@/lib/auth";
import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

type ChatRequestBody = {
  message: string;
  replyLength?: "short" | "normal" | "detailed";
  defaultLanguage?: "auto" | "en" | "hi" | "bn";
};

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set" },
      { status: 500 }
    );
  }

  try {
    // Check if user is logged in (has email)
    const userId = await getUserIdFromRequest(req);
    const user = await getUserById(userId);
    
    if (!user || !user.email) {
      return NextResponse.json(
        { error: "Please sign in with your email to use AI Chat." },
        { status: 401 }
      );
    }

    const body = (await req.json()) as ChatRequestBody;
    const { message, replyLength = "normal", defaultLanguage = "auto" } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Check usage limits before processing
    const usageCheck = await checkUsage(req, "chat");

    if (!usageCheck.allowed) {
      return NextResponse.json({ error: usageCheck.reason }, { status: 429 });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    // Configure reply length settings
    let maxTokens = 1000;
    let systemPrompt = "You are JJJ AI, a friendly and helpful AI assistant. Reply in a clear, concise, and helpful manner.";
    
    if (replyLength === "short") {
      maxTokens = 300;
      systemPrompt = "You are JJJ AI, a friendly and helpful AI assistant. Keep your answers concise and to the point. Be brief and direct.";
    } else if (replyLength === "detailed") {
      maxTokens = 2000;
      systemPrompt = "You are JJJ AI, a friendly and helpful AI assistant. Provide detailed, comprehensive answers with examples and explanations when helpful.";
    }

    // Add language instruction if not auto
    if (defaultLanguage && defaultLanguage !== "auto") {
      const langMap: Record<string, string> = {
        en: "English",
        hi: "Hindi (हिंदी)",
        bn: "Bangla (বাংলা)",
      };
      const langName = langMap[defaultLanguage] || "English";
      systemPrompt = `You are JJJ AI, a friendly and helpful AI assistant. Always respond in ${langName}. ${systemPrompt.replace("You are JJJ AI, a friendly and helpful AI assistant. ", "")}`;
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using GPT-4o-mini for cost-effective responses
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message.trim(),
        },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || "";

    if (!reply) {
      return NextResponse.json(
        { error: "No response received from OpenAI" },
        { status: 500 }
      );
    }

    // Increment usage after successful API call
    try {
      await incrementUsage(userId, "chat", {
        messages: 1,
      });
    } catch (error) {
      // Log but don't fail the request if usage tracking fails
      console.error("Failed to increment usage:", error);
    }

    return NextResponse.json({
      reply,
    });
  } catch (err: any) {
    console.error("Chat API error:", err);
    
    // Better error handling for OpenAI API
    let errorMessage = "Server error while handling request";
    if (err?.response?.status === 401) {
      errorMessage = "Invalid OpenAI API key. Please check your OPENAI_API_KEY in .env.local";
    } else if (err?.response?.status === 429) {
      errorMessage = "OpenAI API rate limit exceeded. Please try again later.";
    } else if (err?.message) {
      errorMessage = err.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
