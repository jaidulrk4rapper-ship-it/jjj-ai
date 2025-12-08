import { NextResponse } from "next/server";
import RazorpayLib from "razorpay";
import { getUserFromRequestDev } from "@/lib/auth";

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

// Coin packages: coins -> price in INR
const COIN_PACKAGES = [
  { coins: 100, price: 99 },   // 100 coins = ₹99 (1 coin = ₹0.99)
  { coins: 500, price: 449 },  // 500 coins = ₹449 (1 coin = ₹0.90)
  { coins: 1000, price: 799 }, // 1000 coins = ₹799 (1 coin = ₹0.80)
  { coins: 2500, price: 1799 }, // 2500 coins = ₹1799 (1 coin = ₹0.72)
  { coins: 5000, price: 3299 }, // 5000 coins = ₹3299 (1 coin = ₹0.66)
];

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequestDev(req);
    
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to purchase coins." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { packageId } = body as { packageId?: number };

    if (packageId === undefined || packageId < 0 || packageId >= COIN_PACKAGES.length) {
      return NextResponse.json(
        { error: "Invalid coin package selected." },
        { status: 400 }
      );
    }

    const coinPackage = COIN_PACKAGES[packageId];
    const amount = coinPackage.price * 100; // Convert to paise
    const currency = "INR";
    const receipt = `jjjai_coins_${coinPackage.coins}_${user.uid}_${Date.now()}`;

    const options = {
      amount,
      currency,
      receipt,
      notes: {
        userId: user.uid,
        email: user.email || "",
        product: "JJJ AI Coins",
        coins: coinPackage.coins.toString(),
        type: "coin-purchase",
        description: `${coinPackage.coins} coins for premium features`,
      },
    };

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      coins: coinPackage.coins,
      price: coinPackage.price,
    });
  } catch (error: any) {
    console.error("Error creating coin purchase order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}

