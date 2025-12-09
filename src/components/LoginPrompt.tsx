// src/components/LoginPrompt.tsx
// Reusable login prompt component with DeepSeek-style login

"use client";

import { useState } from "react";
import DeepSeekLogin from "./DeepSeekLogin";

export default function LoginPrompt({ 
  title = "Sign in required",
  message = "Please sign in with your email to use this feature."
}: { 
  title?: string;
  message?: string;
}) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="max-w-md w-full space-y-4">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-semibold text-white">
            {title}
          </h2>
          <p className="text-gray-400">
            {message}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowLogin(true)}
              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-medium transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="rounded-lg border border-[#1A1A1A] bg-[#111111] text-gray-300 px-6 py-3 font-medium transition-colors hover:bg-[#050505]"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>

      {showLogin && (
        <DeepSeekLogin onClose={() => setShowLogin(false)} defaultAction="login" />
      )}
    </>
  );
}

