import { NextResponse } from "next/server";
import RazorpayLib from "razorpay";
import { getUserFromRequestDev } from "@/lib/auth";
import { getUserDoc } from "@/lib/db";

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

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequestDev(req);
    
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to upgrade." },
        { status: 401 }
      );
    }

    // Check if user is already Pro
    const userDoc = await getUserDoc(user.uid);
    if (userDoc?.plan === "pro") {
      return NextResponse.json(
        { error: "You are already on JJJ AI Pro plan." },
        { status: 400 }
      );
    }

    const amount = 39900; // ₹399 in paise
    const currency = "INR";
    const receipt = `jjjai_pro_${user.uid}_${Date.now()}`;

    const options = {
      amount,
      currency,
      receipt,
      notes: {
        userId: user.uid,
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
