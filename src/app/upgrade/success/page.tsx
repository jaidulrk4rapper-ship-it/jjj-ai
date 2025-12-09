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
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 sm:px-6 text-center overflow-x-hidden">
      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-500/20 mb-4 sm:mb-6">
        <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-500" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
        Welcome to JJJ AI Pro!
      </h1>

      <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
        Your payment was successful. You now have access to all Pro features.
      </p>

      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-sky-400" />
          <span className="text-lg sm:text-xl font-semibold text-white">Pro Features Unlocked</span>
        </div>
        <ul className="text-left space-y-2 text-sm sm:text-base text-gray-300">
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

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
        <Link
          href="/"
          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-sky-600 hover:bg-sky-700 text-white text-sm sm:text-base font-semibold rounded-lg transition-colors w-full sm:w-auto"
        >
          Start Using Pro
        </Link>
        <Link
          href="/ai/chat"
          className="px-4 sm:px-6 py-2.5 sm:py-3 border border-[#1A1A1A] hover:bg-[#111111] text-gray-300 text-sm sm:text-base font-semibold rounded-lg transition-colors w-full sm:w-auto"
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

