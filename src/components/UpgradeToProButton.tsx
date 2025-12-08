"use client";

import { useState } from "react";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

type Props = {
  userId: string;
  userEmail?: string;
};

export default function UpgradeToProButton({ userId, userEmail }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    try {
      setError(null);
      setLoading(true);

      // 1) Create order from our backend
      const res = await fetch("/api/billing/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-jjjai-user-id": userId,
          "x-jjjai-user-email": userEmail || "",
        },
        body: JSON.stringify({ planType: "monthly" }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create order");
      }

      const data = await res.json();

      // 2) Razorpay Checkout open
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "JJJ AI Pro",
        description: "Monthly subscription for JJJ AI",
        order_id: data.orderId,
        prefill: {
          email: data.user?.email || userEmail || "",
        },
        theme: {
          color: "#0ea5e9",
        },
        handler: function () {
          alert(
            "Payment successful! Pro activation will happen automatically in a few seconds."
          );
        },
      };

      if (!window.Razorpay) {
        // if script missing
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
          const rzp = new window.Razorpay(options);
          rzp.open();
        };
        script.onerror = () =>
          setError("Could not load Razorpay checkout script.");
        document.body.appendChild(script);
      } else {
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err: any) {
      console.error("Upgrade error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Opening Razorpay…" : "Upgrade to JJJ AI Pro"}
      </button>
      {error && (
        <p className="text-[11px] text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

