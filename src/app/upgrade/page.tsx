"use client";

import { useState, useEffect } from "react";
import { Crown, Check, Sparkles, Zap, Infinity, Shield, Headphones } from "lucide-react";
import { useJjjUser } from "@/providers/UserProvider";
import LoginPrompt from "@/components/LoginPrompt";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function UpgradePage() {
  const { user, loading: userLoading } = useJjjUser();
  
  // Show login prompt if user is not logged in
  if (!userLoading && (!user || !user.email)) {
    return <LoginPrompt title="Sign in to upgrade" message="Please sign in with your email to upgrade to JJJ AI Pro." />;
  }

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
    <div className="max-w-5xl mx-auto py-12 px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 mb-6 shadow-lg shadow-amber-500/20">
          <Crown className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
          Upgrade to JJJ AI Pro
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Unlock unlimited access to all AI features with higher limits and priority support
        </p>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-[#111111] border border-[#1A1A1A]">
          <Zap className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Faster Processing</h3>
            <p className="text-xs text-gray-400">Priority queue for all requests</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-lg bg-[#111111] border border-[#1A1A1A]">
          <Infinity className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Higher Limits</h3>
            <p className="text-xs text-gray-400">10x more usage than free plan</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-lg bg-[#111111] border border-[#1A1A1A]">
          <Headphones className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Priority Support</h3>
            <p className="text-xs text-gray-400">Get help when you need it</p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Free Plan */}
        <div className="rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] p-8 relative">
          <h2 className="text-2xl font-semibold text-white mb-2">Free</h2>
          <div className="mb-6">
            <span className="text-4xl font-bold text-white">₹0</span>
            <span className="text-gray-400 ml-2">forever</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3 text-sm">
              <Check className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-400">30 AI Chat messages per day</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <Check className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-400">5 Text-to-Speech clips per day</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <Check className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-400">5 Images per day</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <Check className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-400">Max 2,000 characters per message</span>
            </li>
          </ul>
          <button
            disabled
            className="w-full bg-[#1A1A1A] text-gray-500 font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
          >
            Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="rounded-2xl border-2 border-amber-500 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 p-8 relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 blur-3xl" />
          
          <div className="absolute top-6 right-6 bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
            RECOMMENDED
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-semibold text-white">Pro</h2>
              <Crown className="h-5 w-5 text-amber-400" />
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">₹699</span>
              <span className="text-gray-400 ml-2">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-sm">
                <Check className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-white">1,000+ AI Chat messages per month</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Check className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-white">300 minutes of Text-to-Speech per month</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Check className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-white">300 Images per month</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Check className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-white">Max 6,000 characters per message</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Check className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-white">Priority support & faster processing</span>
              </li>
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-lg transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                "Upgrade to Pro"
              )}
            </button>
            {error && (
              <p className="mt-3 text-sm text-red-400 text-center">{error}</p>
            )}
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Secure payments</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>Cancel anytime</span>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          All payments are processed securely by Razorpay. No questions asked refund policy.
        </p>
      </div>
    </div>
  );
}

