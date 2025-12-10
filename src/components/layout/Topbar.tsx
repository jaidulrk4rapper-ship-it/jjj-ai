"use client";

import { useSettings } from "@/contexts/SettingsContext";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ChevronDown, ChevronUp, Crown, Settings, LogOut, Trash2, X, UserCircle } from "lucide-react";
import { useJjjUser } from "@/providers/UserProvider";
import { useEffect, useRef, useState } from "react";
import DeepSeekLogin from "@/components/DeepSeekLogin";

export default function Topbar() {
  const { settings, setSettings } = useSettings();
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: userLoading, logout, deleteAccount } = useJjjUser();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
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
      <header className="sticky top-0 z-20 flex items-center justify-between px-3 sm:px-4 md:px-6 py-2 sm:py-3 border-b border-white/10 bg-black/60 backdrop-blur-sm w-full min-w-0 overflow-x-hidden">
        {/* LEFT SIDE: logo + hamburger + title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden">
          <img src="/logo.png" alt="JJJ AI" className="h-8 w-auto flex-shrink-0" />
          
          <button
            type="button"
            onClick={toggleSidebar}
            className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/5 text-white/80 hover:bg-white/10 transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-black"
            aria-label={settings.sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
            aria-expanded={!settings.sidebarCollapsed}
            title={settings.sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          </button>

          <div className="flex flex-col min-w-0">
            <span className="text-xs sm:text-sm font-semibold text-white truncate">{pageTitle}</span>
            <span className="text-[10px] sm:text-[11px] text-white/40 hidden sm:inline">
              Welcome back, boss.
            </span>
          </div>
        </div>

        {/* RIGHT SIDE: User menu */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {userLoading ? (
            <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />
          ) : user?.email ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/5 hover:bg-white/10 px-1.5 sm:px-2 py-1.5 transition-colors"
              >
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-[10px] sm:text-xs font-semibold text-white">
                  {getInitials(user.email)}
                </div>
                <span className="hidden md:inline text-xs sm:text-sm text-white/80 max-w-[100px] sm:max-w-[120px] truncate">
                  {user.email.split("@")[0]}
                </span>
                {showUserMenu ? (
                  <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/60 hidden md:inline" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/60 hidden md:inline" />
                )}
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 sm:w-56 bg-[#111111] border border-[#1A1A1A] rounded-lg shadow-xl overflow-hidden z-50">
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
              onClick={() => setShowLoginModal(true)}
              className="group relative flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 text-white/80 hover:text-blue-400 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 transition-all duration-200 hover:shadow-[0_0_12px_rgba(59,130,246,0.4)]"
              title="Log in"
              aria-label="Log in"
            >
              <UserCircle className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:scale-110" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </header>

      {/* DeepSeek Login Modal */}
      {showLoginModal && (
        <DeepSeekLogin onClose={() => setShowLoginModal(false)} defaultAction="login" />
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

