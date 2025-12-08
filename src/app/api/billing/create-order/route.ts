import { NextRequest, NextResponse } from "next/server";
import RazorpayLib from "razorpay";
import { getUserIdFromRequest } from "@/lib/auth";
import { getUserById } from "@/lib/users";

const PRICE_INR =
  Number(process.env.JJJAI_PRO_MONTHLY_PRICE_INR || "699");

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
        { error: "Please sign in with your email to upgrade to Pro." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({} as any));
    const { planType } = body as { planType?: "monthly" };

    // Abhi ke liye sirf monthly
    const amountInPaise = Math.round(PRICE_INR * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `jjjai_pro_${userId}_${Date.now()}`,
      notes: {
        userId: userId,
        email: user.email || "",
        plan: "pro-monthly",
        name: "JJJ AI Pro",
        description: "Monthly subscription for JJJ AI",
      },
    };

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      key: process.env.RAZORPAY_KEY_ID || "",
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      user: {
        id: userId,
        email: user.email,
      },
    });
  } catch (err: any) {
    console.error("Create order error:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
