"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Crown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UpgradeSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
        <CheckCircle className="h-10 w-10 text-green-500" />
      </div>

      <h1 className="text-3xl font-bold text-white mb-3">
        Welcome to JJJ AI Pro!
      </h1>

      <p className="text-gray-400 text-lg mb-8">
        Your payment was successful. You now have access to all Pro features.
      </p>

      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="h-6 w-6 text-sky-400" />
          <span className="text-xl font-semibold text-white">Pro Features Unlocked</span>
        </div>
        <ul className="text-left space-y-2 text-gray-300">
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span>1,000+ AI Chat messages per month</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span>300 minutes of Text-to-Speech per month</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span>300 Images per month</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span>Longer messages (up to 6,000 characters)</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span>Priority support</span>
          </li>
        </ul>
      </div>

      <div className="flex gap-4 justify-center">
        <Link
          href="/"
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors"
        >
          Start Using Pro
        </Link>
        <Link
          href="/ai/chat"
          className="px-6 py-3 border border-[#1A1A1A] hover:bg-[#111111] text-gray-300 font-semibold rounded-lg transition-colors"
        >
          Try AI Chat
        </Link>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Redirecting to home in {countdown} seconds...
      </p>
    </div>
  );
}

