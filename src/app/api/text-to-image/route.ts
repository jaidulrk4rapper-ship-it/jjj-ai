import { NextResponse } from "next/server";
import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: Request) {
  try {
    if (!OPENAI_API_KEY) {
      console.error("Missing OPENAI_API_KEY env");
      return NextResponse.json(
        { error: "OPENAI_API_KEY not configured. Please:\n1. Get your key from https://platform.openai.com/api-keys\n2. Add it to .env.local as: OPENAI_API_KEY=sk-proj_your_key_here\n3. Restart the dev server (npm run dev)" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({} as any));
    const { prompt, style, size } = body as {
      prompt?: string;
      style?: string;
      size?: "square" | "wide" | "tall" | "";
    };

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    // Style + size ko prompt me hi mix kar dete hain
    const stylePrefix = style ? `${style} style, ` : "";
    const sizeHint =
      size === "wide"
        ? "16:9 cinematic horizontal composition, landscape"
        : size === "tall"
        ? "9:16 vertical composition, mobile wallpaper style"
        : "1:1 square composition, centered subject";

    const finalPrompt = `${stylePrefix}${prompt}. ${sizeHint}. High quality, detailed, sharp focus.`;

    // Determine image size for DALL-E
    // DALL-E supports: 1024x1024, 1792x1024, 1024x1792
    let imageSize: "1024x1024" | "1792x1024" | "1024x1792" = "1024x1024";
    if (size === "wide") {
      imageSize = "1792x1024"; // Landscape
    } else if (size === "tall") {
      imageSize = "1024x1792"; // Portrait
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    // Call OpenAI DALL-E API
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: finalPrompt,
      n: 1,
      size: imageSize,
      quality: "standard",
      response_format: "url", // We'll convert URL to base64
    });

    if (!response.data || response.data.length === 0) {
      return NextResponse.json(
        { error: "No image data returned from OpenAI" },
        { status: 500 }
      );
    }

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image URL returned from OpenAI" },
        { status: 500 }
      );
    }

    // Download the image and convert to base64
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: "Failed to download generated image" },
        { status: 500 }
      );
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");

    return NextResponse.json({ imageBase64 });
  } catch (err: any) {
    console.error("Text-to-image route crash:", err);
    
    // Better error handling for OpenAI API
    let errorMessage = "Internal Server Error";
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
