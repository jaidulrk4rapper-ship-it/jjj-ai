import { NextRequest, NextResponse } from "next/server";
import RazorpayLib from "razorpay";
import { getUserIdFromRequest } from "@/lib/auth";
import { getUserById } from "@/lib/users";

function getRazorpayInstance() {
  const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
  const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
  
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys are not configured");
  }
  
  return new RazorpayLib({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
}

export async function POST(req: NextRequest) {
  try {
    // Check if user is logged in (has email)
    const userId = await getUserIdFromRequest(req);
    const user = await getUserById(userId);
    
    if (!user || !user.email) {
      return NextResponse.json(
        { error: "Please sign in with your email to upgrade." },
        { status: 401 }
      );
    }

    // Check if user is already Pro
    if (user.plan === "pro") {
      return NextResponse.json(
        { error: "You are already on JJJ AI Pro plan." },
        { status: 400 }
      );
    }

    const amount = 39900; // ₹399 in paise
    const currency = "INR";
    const receipt = `jjjai_pro_${userId}_${Date.now()}`;

    const options = {
      amount,
      currency,
      receipt,
      notes: {
        userId: userId,
        email: user.email || "",
        plan: "pro",
        product: "JJJ AI Pro",
      },
    };

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
