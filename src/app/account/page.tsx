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
  const { user, loading: userLoading, logout, deleteAccount } = useJjjUser();
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

  return (
    <div className="min-h-[calc(100vh-80px)] p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Account Settings
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your account information and preferences
          </p>
        </div>

        {/* Account Information */}
        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1A1A1A] rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
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
