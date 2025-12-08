// src/components/LoginPrompt.tsx
// Reusable login prompt component

"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useJjjUser } from "@/providers/UserProvider";

export default function LoginPrompt({ 
  title = "Sign in required",
  message = "Please sign in with your email to use this feature."
}: { 
  title?: string;
  message?: string;
}) {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [signInError, setSignInError] = useState<string | null>(null);
  const [signInLoading, setSignInLoading] = useState(false);
  const { signInWithEmail } = useJjjUser();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);

    if (!emailInput.trim() || !emailInput.includes("@")) {
      setSignInError("Please enter a valid email address");
      return;
    }

    setSignInLoading(true);
    try {
      await signInWithEmail(emailInput.trim());
      setShowSignInModal(false);
      setEmailInput("");
    } catch (error: any) {
      setSignInError(error?.message || "Failed to sign in. Please try again.");
    } finally {
      setSignInLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="max-w-md w-full space-y-4">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {message}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.location.href = '/login'}
              className="rounded-lg bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 font-medium transition-colors"
            >
              Sign in with email
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="rounded-lg border border-gray-300 dark:border-[#1A1A1A] bg-white dark:bg-[#111111] text-gray-700 dark:text-gray-300 px-6 py-3 font-medium transition-colors hover:bg-gray-50 dark:hover:bg-[#050505]"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>

      {/* Sign In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111111] rounded-xl border border-gray-200 dark:border-[#1A1A1A] p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sign in with email
              </h2>
              <button
                onClick={() => {
                  setShowSignInModal(false);
                  setEmailInput("");
                  setSignInError(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setSignInError(null);
                  }}
                  placeholder="you@example.com"
                  className="w-full rounded-md bg-white dark:bg-[#050505] border border-gray-300 dark:border-[#1A1A1A] px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  required
                />
                {signInError && (
                  <p className="mt-1 text-xs text-red-500">{signInError}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={signInLoading}
                className="w-full rounded-md bg-sky-600 hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm py-2 px-4 transition-colors"
              >
                {signInLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

