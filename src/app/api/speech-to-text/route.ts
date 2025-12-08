import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY missing" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const { audioBase64, mimeType } = body as {
      audioBase64?: string;
      mimeType?: string;
    };

    if (!audioBase64 || !mimeType) {
      return NextResponse.json(
        { error: "audioBase64 and mimeType are required." },
        { status: 400 }
      );
    }

    const model = "gemini-flash-latest";

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    data: audioBase64,
                    mimeType,
                  },
                },
                {
                  text: "Transcribe this audio to text. Return only the clean transcript.",
                },
              ],
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Speech-to-text Gemini error status:", res.status);
      console.error("Speech-to-text Gemini error body:", errorText);
      
      let errorMessage = "Failed to transcribe audio.";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || 
                      errorJson.error?.details?.[0]?.message || 
                      errorJson.message || 
                      errorMessage;
      } catch {
        if (errorText) {
          errorMessage = `${errorMessage}: ${errorText.substring(0, 200)}`;
        }
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: res.status >= 500 ? 500 : res.status }
      );
    }

    const data = await res.json();
    const textPart =
      data?.candidates?.[0]?.content?.parts?.find((p: any) => p.text)?.text;

    if (!textPart) {
      return NextResponse.json(
        { error: "No transcript returned from AI." },
        { status: 500 }
      );
    }

    return NextResponse.json({ transcript: textPart });
  } catch (err: any) {
    console.error("Speech-to-text route crash:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

