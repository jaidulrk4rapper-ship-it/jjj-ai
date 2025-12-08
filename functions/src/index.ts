import * as functions from "firebase-functions";
import * as cors from "cors";
import OpenAI from "openai";

const corsHandler = cors({ origin: true });

// OpenAI client: key from Firebase config
const openaiClient = new OpenAI({
  apiKey: functions.config().openai.key,
});

// 🌟 JJJ AI – Speech/Text → Smart Reply
export const jjjAi = functions
  .region("asia-south1") // India ke paas region
  .https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
      try {
        if (req.method !== "POST") {
          res.status(405).send("Only POST allowed");
          return;
        }

        const { text } = req.body as { text?: string };

        if (!text || typeof text !== "string" || text.trim().length === 0) {
          res.status(400).json({ error: "Field `text` required" });
          return;
        }

        const userText = text.trim();

        // 🧠 OpenAI Responses API call
        const response = await openaiClient.responses.create({
          model: "gpt-4.1-mini",
          instructions:
            "You are JJJ AI, a friendly AI assistant for an Indian user. " +
            "Reply in casual Hinglish (mix of Hindi/English), short and clear. " +
            "User sometimes speaks Bengali too, so understand that as well.",
          input: userText,
          max_output_tokens: 512,
        });

        // Node SDK gives combined text as `output_text`
        const replyText = (response as any).output_text as string | undefined;

        if (!replyText || replyText.trim().length === 0) {
          res.status(500).json({
            error: "JJJ AI se reply nahi mila (empty response).",
          });
          return;
        }

        res.json({ reply: replyText.trim() });
      } catch (err) {
        console.error("JJJ AI backend error:", err);
        res.status(500).json({
          error: "JJJ AI backend me error aaya. Logs check karo.",
        });
      }
    });
  });

