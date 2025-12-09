import { NextResponse } from "next/server";
import crypto from "crypto";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

export async function POST(req: Request) {
  const bodyText = await req.text(); // raw string
  const signature = req.headers.get("x-razorpay-signature");

  if (!signature || !RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "Signature or secret missing" },
      { status: 400 }
    );
  }

  // Verify signature
  const expected = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(bodyText)
    .digest("hex");

  if (expected !== signature) {
    console.warn("Razorpay webhook signature mismatch");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = JSON.parse(bodyText);

  // Yeh Razorpay ka payload structure depend karega event type pe.
  // "payment.captured" event ke liye:
  const event = payload.event as string;
  const paymentEntity = payload.payload?.payment?.entity;

  if (!paymentEntity) {
    return NextResponse.json({ received: true });
  }

  // Notes ke andar userId dala tha create-order me
  const notes = paymentEntity.notes || {};
  const userId = notes.userId as string | undefined;

  if (!userId) {
    console.warn("No userId in payment notes");
    return NextResponse.json({ received: true });
  }

  // Sirf successful / captured payments pe upgrade
  if (event === "payment.captured") {
    try {
      const { getUserById, updateUser } = await import("@/lib/users");
      const user = await getUserById(userId);

      if (!user) {
        console.error(`User ${userId} not found`);
        return NextResponse.json({ received: true, error: "User not found" });
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
        proSource: "JJJ AI",
      });
      
      console.log("JJJ AI Pro activated for user:", userId, "Expires:", newExpiry.toISOString());
    } catch (error) {
      console.error("Failed to upgrade user to Pro:", error);
      // Still return success to Razorpay to avoid retries
      // Log the error for manual investigation
      return NextResponse.json({ received: true, error: "Upgrade failed but webhook received" });
    }
  }

  return NextResponse.json({ received: true });
}

