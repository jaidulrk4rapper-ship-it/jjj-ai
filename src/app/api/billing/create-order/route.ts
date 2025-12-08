import { NextResponse } from "next/server";
import RazorpayLib from "razorpay";
import { getUserFromRequest } from "@/lib/auth";

const PRICE_INR =
  Number(process.env.JJJAI_PRO_MONTHLY_PRICE_INR || "399");

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
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { error: "Login required to upgrade to Pro." },
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
      receipt: `jjjai_pro_${user.uid}_${Date.now()}`,
      notes: {
        userId: user.uid,
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
        id: user.uid,
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
