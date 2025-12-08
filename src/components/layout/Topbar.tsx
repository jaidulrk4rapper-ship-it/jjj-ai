"use client";

import { useSettings } from "@/contexts/SettingsContext";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ChevronDown, ChevronUp, Crown, Settings, LogOut, Trash2, X, UserCircle } from "lucide-react";
import { useJjjUser } from "@/providers/UserProvider";
import { useEffect, useRef, useState } from "react";

export default function Topbar() {
  const { settings, setSettings } = useSettings();
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: userLoading, signInWithEmail, signUpWithEmail, logout, deleteAccount } = useJjjUser();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [signInError, setSignInError] = useState<string | null>(null);
  const [signInLoading, setSignInLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setSettings((prev) => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed,
    }));
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const pageTitle = (() => {
    if (!pathname) return "JJJ AI Studio";
    if (pathname.startsWith("/ai/chat")) return "AI Chat";
    if (pathname.startsWith("/ai/text-to-speech")) return "Text to Speech";
    if (pathname.startsWith("/ai/speech-to-text")) return "Speech to Text";
    if (pathname.startsWith("/ai/text-to-image")) return "Text to Image";
    return "JJJ AI Studio";
  })();

  const getInitials = (email: string | null | undefined) => {
    if (!email) return "G";
    return email.charAt(0).toUpperCase();
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);

    if (!emailInput.trim() || !emailInput.includes("@")) {
      setSignInError("Please enter a valid email address");
      return;
    }

    if (isSignUp && !passwordInput.trim()) {
      setSignInError("Please enter a password");
      return;
    }

    setSignInLoading(true);
    try {
      if (isSignUp) {
        if (!passwordInput.trim()) {
          setSignInError("Please enter a password");
          setSignInLoading(false);
          return;
        }
        await signUpWithEmail(emailInput.trim(), passwordInput);
        setShowSignInModal(false);
        setEmailInput("");
        setPasswordInput("");
      } else {
        await signInWithEmail(emailInput.trim(), passwordInput || undefined);
        setShowSignInModal(false);
        setEmailInput("");
        setPasswordInput("");
      }
    } catch (error: any) {
      setSignInError(error?.message || (isSignUp ? "Failed to sign up. Please try again." : "Failed to sign in. Please try again."));
    } finally {
      setSignInLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error: any) {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteAccount();
      setShowDeleteConfirm(false);
      setShowUserMenu(false);
    } catch (error: any) {
      console.error("Delete account error:", error);
      alert(error?.message || "Failed to delete account. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10 bg-black/60 backdrop-blur-sm">
        {/* LEFT SIDE: hamburger + title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/80 hover:bg-white/10 transition-colors"
            aria-label={settings.sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
            title={settings.sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">{pageTitle}</span>
            <span className="text-[11px] text-white/40 hidden sm:inline">
              Welcome back, boss.
            </span>
          </div>
        </div>

        {/* RIGHT SIDE: User menu */}
        <div className="flex items-center gap-3">
          {userLoading ? (
            <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />
          ) : user?.email ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 px-2 py-1.5 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-xs font-semibold text-white">
                  {getInitials(user.email)}
                </div>
                <span className="hidden sm:inline text-sm text-white/80 max-w-[120px] truncate">
                  {user.email.split("@")[0]}
                </span>
                {showUserMenu ? (
                  <ChevronUp className="h-4 w-4 text-white/60 hidden sm:inline" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-white/60 hidden sm:inline" />
                )}
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#111111] border border-[#1A1A1A] rounded-lg shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-[#1A1A1A]">
                    <div className="text-sm font-medium text-white truncate">{user.email}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {user.plan === "pro" ? "Pro Plan" : "Free Plan"}
                    </div>
                  </div>

                  {user.plan === "free" && (
                    <button
                      onClick={() => {
                        router.push("/upgrade");
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[#050505] transition-colors border-b border-[#1A1A1A]"
                    >
                      <Crown className="h-4 w-4 text-amber-400" />
                      <span>Upgrade plan</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      router.push("/account");
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-[#050505] transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>

                  <div className="border-t border-[#1A1A1A]" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-[#050505] transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </button>

                  <div className="border-t border-[#1A1A1A]" />

                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Account</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setShowSignInModal(true);
                setIsSignUp(false);
              }}
              className="group relative flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-500/50 text-white/80 hover:text-sky-400 h-10 w-10 transition-all duration-200 hover:shadow-[0_0_12px_rgba(56,189,248,0.4)]"
              title="Sign in"
              aria-label="Sign in"
            >
              <UserCircle className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </header>

      {/* Sign In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111111] rounded-xl border border-gray-200 dark:border-[#1A1A1A] p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isSignUp ? "Sign up" : "Sign in"}
              </h2>
              <button
                onClick={() => {
                  setShowSignInModal(false);
                  setEmailInput("");
                  setPasswordInput("");
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
              </div>
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setSignInError(null);
                    }}
                    placeholder="Enter password"
                    className="w-full rounded-md bg-white dark:bg-[#050505] border border-gray-300 dark:border-[#1A1A1A] px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    required={isSignUp}
                  />
                </div>
              )}
              {signInError && <p className="text-xs text-red-500">{signInError}</p>}
              <button
                type="submit"
                disabled={signInLoading}
                className="w-full rounded-md bg-sky-600 hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm py-2 px-4 transition-colors"
              >
                {signInLoading ? (isSignUp ? "Signing up..." : "Signing in...") : isSignUp ? "Sign up" : "Sign in"}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setSignInError(null);
                  }}
                  className="text-xs text-sky-500 hover:text-sky-600"
                >
                  {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111111] rounded-xl border border-gray-200 dark:border-[#1A1A1A] p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Account</h2>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteLoading(false);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                disabled={deleteLoading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteLoading(false);
                  }}
                  disabled={deleteLoading}
                  className="flex-1 rounded-md border border-gray-300 dark:border-[#1A1A1A] bg-white dark:bg-[#050505] text-gray-700 dark:text-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#111111] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex-1 rounded-md bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

