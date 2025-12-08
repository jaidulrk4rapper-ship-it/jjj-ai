import { NextResponse } from "next/server";
import crypto from "crypto";
import { upgradeUserToPro } from "@/lib/db";

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
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    // Handle payment success
    if (event.event === "payment.captured" || event.event === "payment.authorized") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const userId = payment.notes?.userId;

      if (!userId) {
        console.error("Missing userId in payment notes");
        return NextResponse.json(
          { error: "Missing userId" },
          { status: 400 }
        );
      }

      // Calculate renewal date (30 days from now)
      const renewalDate = new Date();
      renewalDate.setDate(renewalDate.getDate() + 30);

      // Upgrade user to Pro
      await upgradeUserToPro(userId, renewalDate.toISOString());

      console.log(`User ${userId} upgraded to Pro. Renewal date: ${renewalDate.toISOString()}`);

      return NextResponse.json({ success: true });
    }

    // Handle subscription renewal (if you add subscriptions later)
    if (event.event === "subscription.charged") {
      const subscription = event.payload.subscription.entity;
      const userId = subscription.notes?.userId;

      if (userId) {
        const renewalDate = new Date();
        renewalDate.setDate(renewalDate.getDate() + 30);
        await upgradeUserToPro(userId, renewalDate.toISOString());
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}

