// src/app/login/page.tsx
// Premium Login Page with smooth animations

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useJjjUser } from "@/providers/UserProvider";
import { Mail, ArrowRight, Sparkles, Lock, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: userLoading, signInWithEmail } = useJjjUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);

  // Check for error in URL
  useEffect(() => {
    const errorParam = searchParams?.get("error");
    if (errorParam === "auth_failed") {
      setError("Authentication failed. Please try again.");
    } else if (errorParam === "no_email") {
      setError("Could not get email from Google. Please try again.");
    }
  }, [searchParams]);

  // Auto-fetch email from Chrome and attempt auto-login
  useEffect(() => {
    if (autoLoginAttempted) return;
    
    const attemptAutoLogin = async () => {
      // Try Chrome identity API
      if (typeof window !== "undefined" && (window as any).chrome?.identity) {
        try {
          (window as any).chrome.identity.getProfileUserInfo(async (info: any) => {
            if (info?.email) {
              setEmail(info.email);
              setAutoLoginAttempted(true);
              
              // Try to auto-login with Chrome account
              try {
                setIsGoogleLoading(true);
                await signInWithEmail(info.email, undefined, true);
                router.push("/");
              } catch (err) {
                // Auto-login failed, user needs to enter password
                setIsGoogleLoading(false);
              }
            }
          });
        } catch (err) {
          console.log("Chrome identity not available");
        }
      }
    };

    attemptAutoLogin();
  }, [autoLoginAttempted, signInWithEmail, router]);

  // Redirect if already logged in
  useEffect(() => {
    if (!userLoading && user?.email) {
      router.push("/");
    }
  }, [user, userLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      // First try Chrome identity API (for Chrome extensions)
      if (typeof window !== "undefined" && (window as any).chrome?.identity) {
        (window as any).chrome.identity.getAuthToken(
          { interactive: true },
          async (token: string) => {
            if ((window as any).chrome?.runtime?.lastError) {
              // Chrome auth failed, try OAuth
              tryOAuthFlow();
              return;
            }

            try {
              const response = await fetch(
                `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`
              );
              const data = await response.json();

              if (data.email) {
                await signInWithEmail(data.email, undefined, true);
                router.push("/");
              } else {
                setError("Failed to get email from Google");
                setIsGoogleLoading(false);
              }
            } catch (err) {
              setError("Failed to sign in with Google");
              setIsGoogleLoading(false);
            }
          }
        );
      } else {
        // Use standard Google OAuth flow
        tryOAuthFlow();
      }
    } catch (err: any) {
      setError(err?.message || "Failed to sign in with Google");
      setIsGoogleLoading(false);
    }
  };

  const tryOAuthFlow = () => {
    // For now, use a simple approach: redirect to our API which will handle OAuth
    // Or use Chrome's profile info if available
    if (typeof window !== "undefined" && (window as any).chrome?.identity) {
      (window as any).chrome.identity.getProfileUserInfo(async (info: any) => {
        if (info?.email) {
          try {
            await signInWithEmail(info.email, undefined, true);
            router.push("/");
          } catch (err: any) {
            setError(err?.message || "Failed to sign in");
            setIsGoogleLoading(false);
          }
        } else {
          setError("Please sign in to Chrome with your Google account first");
          setIsGoogleLoading(false);
        }
      });
    } else {
      setError("Google sign-in requires Chrome browser. Please use email/password to sign in.");
      setIsGoogleLoading(false);
    }
  };

  if (userLoading || isGoogleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Signing you in...</p>
        </div>
      </div>
    );
  }

  if (user?.email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Logo and Title */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400 bg-clip-text text-transparent animate-pulse">
              JJJ AI
            </div>
            <Sparkles className="h-6 w-6 text-sky-400 animate-pulse" />
          </div>
          <h1 className="text-2xl font-semibold text-white">
            Welcome back
          </h1>
          <p className="text-gray-400 text-xs">
            Sign in to continue to JJJ AI
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-[#111111]/80 backdrop-blur-xl border border-[#1A1A1A] rounded-xl p-6 space-y-4 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Email address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-sky-400 transition-colors duration-200" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#050505] border border-[#1A1A1A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 hover:border-[#2A2A2A]"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-sky-400 transition-colors duration-200" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-[#050505] border border-[#1A1A1A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 hover:border-[#2A2A2A]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg animate-in fade-in slide-in-from-top-2">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1A1A1A]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-[#111111] text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-2 border border-[#1A1A1A] bg-[#050505] hover:bg-[#0A0A0A] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-all duration-200 hover:border-[#2A2A2A] transform hover:scale-[1.01] active:scale-[0.99]"
          >
            {isGoogleLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in with Google...</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center space-y-1.5">
          <p className="text-xs text-gray-500">
            Don't have an account?{" "}
            <button
              onClick={() => router.push("/signup")}
              className="text-sky-400 hover:text-sky-300 underline font-medium transition-colors"
            >
              Sign up
            </button>
          </p>
          <p className="text-xs text-gray-500">
            <button
              onClick={() => router.push("/")}
              className="text-gray-400 hover:text-gray-300 underline transition-colors"
            >
              Explore features
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
