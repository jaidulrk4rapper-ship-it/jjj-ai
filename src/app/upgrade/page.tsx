"use client";

import { useState, useEffect } from "react";
import { Crown, Check } from "lucide-react";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function UpgradePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script dynamically
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);

      return () => {
        // Cleanup
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    } else if (window.Razorpay) {
      setRazorpayLoaded(true);
    }
  }, []);

  const handleUpgrade = async () => {
    if (!razorpayLoaded) {
      setError("Payment system is loading. Please wait a moment and try again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "JJJ AI",
        description: "JJJ AI Pro - Monthly Subscription",
        order_id: data.orderId,
        handler: async function (response: any) {
          // Payment successful
          // The webhook will handle the upgrade
          // Redirect to success page or show success message
          window.location.href = "/upgrade/success";
        },
        prefill: {
          // You can prefill user details if available
        },
        theme: {
          color: "#0ea5e9", // sky-500
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">

      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 mb-4">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Upgrade to JJJ AI Pro</h1>
        <p className="text-gray-400 text-lg">
          Unlock unlimited access to all AI features
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Free Plan */}
        <div className="rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] p-6">
          <h2 className="text-xl font-semibold text-white mb-2">Free Plan</h2>
          <div className="text-3xl font-bold text-white mb-4">₹0</div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2 text-sm text-gray-400">
              <Check className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <span>30 AI Chat messages per day</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-400">
              <Check className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <span>5 Text-to-Speech clips per day (max 30s)</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-400">
              <Check className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <span>5 Images per day</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-400">
              <Check className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <span>Max 2,000 characters per message</span>
            </li>
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="rounded-xl border-2 border-sky-500 bg-gradient-to-br from-sky-500/10 to-blue-600/10 p-6 relative">
          <div className="absolute top-4 right-4 bg-sky-500 text-white text-xs font-semibold px-2 py-1 rounded">
            RECOMMENDED
          </div>
          <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
            Pro Plan
            <Crown className="h-5 w-5 text-sky-400" />
          </h2>
          <div className="text-3xl font-bold text-white mb-1">₹399</div>
          <div className="text-sm text-gray-400 mb-4">per month</div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2 text-sm text-white">
              <Check className="h-4 w-4 text-sky-400 mt-0.5 flex-shrink-0" />
              <span>1,000+ AI Chat messages per month</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-white">
              <Check className="h-4 w-4 text-sky-400 mt-0.5 flex-shrink-0" />
              <span>300 minutes of Text-to-Speech per month</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-white">
              <Check className="h-4 w-4 text-sky-400 mt-0.5 flex-shrink-0" />
              <span>300 Images per month</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-white">
              <Check className="h-4 w-4 text-sky-400 mt-0.5 flex-shrink-0" />
              <span>Max 6,000 characters per message</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-white">
              <Check className="h-4 w-4 text-sky-400 mt-0.5 flex-shrink-0" />
              <span>Priority support & quota</span>
            </li>
          </ul>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? "Processing..." : "Upgrade to Pro"}
          </button>
          {error && (
            <p className="mt-3 text-sm text-red-400 text-center">{error}</p>
          )}
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>All payments are secure and processed by Razorpay</p>
        <p className="mt-1">Cancel anytime. No questions asked.</p>
      </div>
    </div>
  );
}

