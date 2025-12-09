import { NextResponse } from "next/server";
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

      // Get current user to check existing subscription
      const { getUserById, updateUser } = await import("@/lib/users");
      const user = await getUserById(userId);

      if (!user) {
        console.error(`User ${userId} not found`);
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      // Determine base date for subscription extension
      const now = new Date();
      const currentExpiry = user.planExpiresAt ? new Date(user.planExpiresAt) : null;
      
      // If user already has active Pro subscription, extend from current expiry
      // Otherwise, start from now
      const baseDate = currentExpiry && currentExpiry > now ? currentExpiry : now;
      const newExpiry = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

      // Update user with Pro plan and expiry dates
      await updateUser(userId, {
        plan: "pro",
        planStartedAt: user.planStartedAt ?? now.toISOString(),
        planExpiresAt: newExpiry.toISOString(),
        proSince: now,
        proSource: "razorpay",
      });

      console.log(`User ${userId} upgraded to Pro. Expires: ${newExpiry.toISOString()}`);

      return NextResponse.json({ success: true });
    }

    // Handle subscription renewal (if you add subscriptions later)
    if (event.event === "subscription.charged") {
      const subscription = event.payload.subscription.entity;
      const userId = subscription.notes?.userId;

      if (userId) {
        const { getUserById, updateUser } = await import("@/lib/users");
        const user = await getUserById(userId);
        
        if (user) {
          const now = new Date();
          const currentExpiry = user.planExpiresAt ? new Date(user.planExpiresAt) : null;
          const baseDate = currentExpiry && currentExpiry > now ? currentExpiry : now;
          const newExpiry = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);
          
          await updateUser(userId, {
            plan: "pro",
            planStartedAt: user.planStartedAt ?? now.toISOString(),
            planExpiresAt: newExpiry.toISOString(),
            proSince: now,
            proSource: "razorpay",
          });
        }
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

