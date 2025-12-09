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
    <div className="max-w-2xl mx-auto py-3 md:py-8 lg:py-12 px-3 md:px-4 lg:px-6 text-center overflow-x-hidden">
      <div className="max-w-sm mx-auto w-full md:max-w-none">
        <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 lg:w-20 md:h-16 lg:h-20 rounded-full bg-green-500/20 mb-3 md:mb-4 lg:mb-6">
          <CheckCircle className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-green-500" />
        </div>

        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3">
          Welcome to JJJ AI Pro!
        </h1>

        <p className="text-gray-400 text-sm md:text-base lg:text-lg mb-4 md:mb-6 lg:mb-8">
          Your payment was successful. You now have access to all Pro features.
        </p>

        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-3 md:p-6 mb-4 md:mb-8">
          <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
            <Crown className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-sky-400" />
            <span className="text-base md:text-lg lg:text-xl font-semibold text-white">Pro Features Unlocked</span>
          </div>
          <ul className="text-left space-y-2 text-sm md:text-base text-gray-300">
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

        <div className="flex flex-col sm:flex-row gap-2 md:gap-3 lg:gap-4 justify-center">
          <Link
            href="/"
            className="px-3 md:px-4 lg:px-6 py-2 md:py-2.5 lg:py-3 bg-sky-600 hover:bg-sky-700 text-white text-sm md:text-base font-semibold rounded-lg transition-colors w-full sm:w-auto"
          >
            Start Using Pro
          </Link>
          <Link
            href="/ai/chat"
            className="px-3 md:px-4 lg:px-6 py-2 md:py-2.5 lg:py-3 border border-[#1A1A1A] hover:bg-[#111111] text-gray-300 text-sm md:text-base font-semibold rounded-lg transition-colors w-full sm:w-auto"
          >
            Try AI Chat
          </Link>
        </div>

        <p className="mt-4 md:mt-6 text-xs md:text-sm text-gray-500">
          Redirecting to home in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}

