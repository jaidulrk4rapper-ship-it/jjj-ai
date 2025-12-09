// src/components/DeepSeekLogin.tsx
// DeepSeek-style login component

"use client";

import { useState } from "react";
import { X, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useJjjUser } from "@/providers/UserProvider";

interface DeepSeekLoginProps {
  onClose?: () => void;
  defaultAction?: "login" | "signup";
}

export default function DeepSeekLogin({ onClose, defaultAction = "login" }: DeepSeekLoginProps) {
  const [action, setAction] = useState<"login" | "signup">(defaultAction);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signUpWithEmail } = useJjjUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password.trim() || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      if (action === "signup") {
        await signUpWithEmail(email.trim(), password);
      } else {
        await signInWithEmail(email.trim(), password);
      }
      if (onClose) onClose();
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err?.message || `Failed to ${action === "signup" ? "sign up" : "sign in"}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111111] rounded-xl border border-[#1A1A1A] p-8 w-full max-w-md mx-4">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Logo/Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"></div>
            <span className="text-xl font-semibold text-white">JJJ AI</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Only login via email is supported
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="Email address"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#050505] border border-[#1A1A1A] text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Password"
                className="w-full pl-10 pr-12 py-3 rounded-lg bg-[#050505] border border-[#1A1A1A] text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-400 bg-red-900/20 border border-red-900/50 rounded-lg p-3">
              {error}
            </div>
          )}

          {/* Consent Text */}
          <p className="text-xs text-gray-400 text-center">
            By signing up or logging in, you consent to JJJ AI's{" "}
            <a href="/terms" className="text-blue-400 hover:text-blue-300">Terms of Use</a> and{" "}
            <a href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>.
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium transition-colors"
          >
            {loading ? (action === "signup" ? "Signing up..." : "Logging in...") : (action === "signup" ? "Sign up" : "Log in")}
          </button>

          {/* Toggle Action */}
          <div className="flex items-center justify-between text-sm">
            {action === "login" ? (
              <button
                type="button"
                onClick={() => {
                  setAction("signup");
                  setError(null);
                }}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign up
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAction("login");
                  setError(null);
                }}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Log in
              </button>
            )}
            {action === "login" && (
              <button
                type="button"
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                Forgot password?
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

