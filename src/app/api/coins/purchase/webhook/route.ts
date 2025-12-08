import { NextResponse } from "next/server";
import { addCoins } from "@/lib/db";
import crypto from "crypto";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    // Handle payment success for coin purchase
    if (event.event === "payment.captured" || event.event === "payment.authorized" || event.event === "order.paid") {
      const payment = event.payload.payment?.entity || event.payload.payment;
      const order = event.payload.order?.entity || event.payload.order;

      // Check if this is a coin purchase
      const isCoinPurchase = 
        order?.notes?.type === "coin-purchase" || 
        payment?.notes?.type === "coin-purchase" ||
        order?.notes?.product === "JJJ AI Coins";

      if (isCoinPurchase) {
        const userId = order?.notes?.userId || payment?.notes?.userId;
        const coins = parseInt(order?.notes?.coins || payment?.notes?.coins || "0");

        if (userId && coins > 0) {
          await addCoins(userId, coins);
          console.log(`Added ${coins} coins to user: ${userId}`);
        } else {
          console.error("Missing userId or coins in coin purchase payment");
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Coin purchase webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

