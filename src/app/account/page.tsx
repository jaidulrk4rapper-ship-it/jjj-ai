// src/app/account/page.tsx
// Account Settings Page

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useJjjUser } from "@/providers/UserProvider";
import { LogOut, Trash2, Crown, Mail, User } from "lucide-react";
import LoginPrompt from "@/components/LoginPrompt";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: userLoading, logout, deleteAccount, daysLeft } = useJjjUser();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Show loading state while checking authentication
  if (userLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  // Show login prompt if user is not logged in (only after loading is complete)
  if (!user || !user.email) {
    return <LoginPrompt title="Sign in to view account" message="Please sign in with your email to view your account settings." />;
  }

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
    } catch (error: any) {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    
    setDeleteLoading(true);
    try {
      await deleteAccount();
    } catch (error: any) {
      console.error("Delete account error:", error);
      alert(error?.message || "Failed to delete account. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const email = user?.email || "";
  const plan = user?.plan === "pro" ? "JJJ AI Pro" : "Free Plan";
  const coins = user?.coins || 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Mobile Layout */}
      <div className="w-full max-w-sm mx-auto p-3 space-y-4 md:hidden">
        {/* Header */}
        <h1 className="text-xl font-semibold">Account Settings</h1>
        <p className="text-sm text-gray-400 -mt-2">Manage your account information and preferences</p>

        {/* Account Info Card */}
        <div className="bg-[#111827] rounded-xl p-4 space-y-3 border border-gray-800">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <span>👤</span> Account Information
          </h2>

          <div className="text-sm space-y-1">
            <p className="text-gray-400">Email Address</p>
            <p className="font-medium">{email}</p>
          </div>

          <div className="text-sm space-y-1">
            <p className="text-gray-400">Plan</p>
            <p className="font-medium">{plan}</p>
          </div>

          <div className="text-sm space-y-1">
            <p className="text-gray-400">Coins Balance</p>
            <p className="font-medium">{coins} coins</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="w-full bg-gray-800 text-sm py-2 rounded-lg"
          >
            {logoutLoading ? "Logging out..." : "Log out"}
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full bg-red-600 text-sm py-2 rounded-lg"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block max-w-2xl mx-auto space-y-6 w-full">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Manage your account information and preferences
          </p>
        </div>

        {/* Account Information */}
        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1A1A1A] rounded-xl p-6 space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-white">{user?.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Plan
              </label>
              <div className="flex items-center gap-2">
                {user?.plan === "pro" ? (
                  <>
                    <Crown className="h-4 w-4 text-sky-500" />
                    <span className="text-sm font-medium text-sky-600 dark:text-sky-400">JJJ AI Pro</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-600 dark:text-gray-400">Free Plan</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Coins Balance
              </label>
              <span className="text-sm text-gray-900 dark:text-white">{user?.coins || 0} coins</span>
            </div>
          </div>
        </div>

        {/* Subscription Section */}
        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1A1A1A] rounded-xl p-6 space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Subscription
          </h2>
          
          <div className="space-y-4">
            {user?.plan === "pro" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Plan
                  </label>
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-sky-500" />
                    <span className="text-sm font-medium text-sky-600 dark:text-sky-400">Pro</span>
                  </div>
                </div>
                {typeof daysLeft === "number" && daysLeft > 0 ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Pro plan active – {daysLeft} day{daysLeft !== 1 ? "s" : ""} remaining.
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your Pro plan has expired. You are on the free plan.
                  </p>
                )}
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Plan
                  </label>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Free</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You are on the free plan. Upgrade to JJJ AI Pro for higher limits.
                </p>
              </>
            )}
            
            <button
              onClick={() => router.push("/upgrade")}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium transition-colors"
            >
              <Crown className="h-4 w-4" />
              <span>{user?.plan === "pro" ? "Manage / Renew Pro plan" : "Upgrade to Pro"}</span>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1A1A1A] rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Actions
          </h2>
          
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-[#1A1A1A] bg-white dark:bg-[#050505] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111111] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="h-4 w-4" />
              <span>{logoutLoading ? "Logging out..." : "Log out"}</span>
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-red-300 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111111] rounded-xl border border-gray-200 dark:border-[#1A1A1A] p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Account
              </h2>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteLoading(false);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                disabled={deleteLoading}
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete your account? This action cannot be undone. All your data, including:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-2">
                <li>Your account information</li>
                <li>Usage history</li>
                <li>Generated content</li>
                <li>Subscription data</li>
              </ul>
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                All of this will be permanently deleted.
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
    </div>
  );
}
