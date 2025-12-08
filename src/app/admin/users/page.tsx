"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  RefreshCw, 
  AlertCircle, 
  Crown, 
  UserCheck,
  Plus,
  Minus,
  Loader2
} from "lucide-react";
import { adminFetch } from "@/lib/adminClient";
import type { AdminUser } from "@/app/api/admin/users/route";

interface UsersResponse {
  ok: boolean;
  users: AdminUser[];
  error?: string;
}

interface UpdateUserResponse {
  ok: boolean;
  user: AdminUser;
  error?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await adminFetch<UsersResponse>("/api/admin/users");
      if (data.ok) {
        setUsers(data.users);
      } else {
        throw new Error(data.error || "Failed to fetch users");
      }
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      
      if (err.message === "ADMIN_UNAUTHORIZED") {
        localStorage.removeItem("jjj_admin_key");
        router.push("/admin/login");
        return;
      }
      
      setError(err?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUser = async (uid: string, update: { plan?: "free" | "pro"; coinsDelta?: number }) => {
    try {
      setUpdatingUid(uid);
      
      const data = await adminFetch<UpdateUserResponse>("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, ...update }),
      });

      if (data.ok && data.user) {
        // Update user in local state
        setUsers((prev) =>
          prev.map((u) => (u.uid === uid ? data.user : u))
        );
      } else {
        throw new Error(data.error || "Failed to update user");
      }
    } catch (err: any) {
      console.error("Failed to update user:", err);
      alert(err?.message || "Failed to update user");
    } finally {
      setUpdatingUid(null);
    }
  };

  const togglePlan = (user: AdminUser) => {
    const newPlan = user.plan === "free" ? "pro" : "free";
    updateUser(user.uid, { plan: newPlan });
  };

  const addCoins = (uid: string) => {
    updateUser(uid, { coinsDelta: 100 });
  };

  const removeCoins = (uid: string) => {
    updateUser(uid, { coinsDelta: -100 });
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const shortUid = (uid: string) => {
    return `${uid.substring(0, 8)}...`;
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-400">Loading users…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-white min-h-[400px]">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="mb-2 text-red-400 font-semibold">Error loading users</p>
        <p className="mb-4 text-sm text-gray-400 max-w-md text-center">{error}</p>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Users Management</h1>
          <p className="text-gray-400">Manage users, plans, and coins</p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] text-white text-sm transition-colors border border-[#2A2A2A]"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-12 text-center">
          <UserCheck className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No users found</p>
        </div>
      ) : (
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#111111] border-b border-[#1A1A1A]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    UID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Coins
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {users.map((user) => {
                  const isUpdating = updatingUid === user.uid;
                  return (
                    <tr key={user.uid} className="hover:bg-[#111111] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {user.email || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400 font-mono">
                          {shortUid(user.uid)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {user.plan === "pro" ? (
                            <Crown className="w-4 h-4 text-yellow-400" />
                          ) : (
                            <UserCheck className="w-4 h-4 text-gray-400" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              user.plan === "pro"
                                ? "text-yellow-400"
                                : "text-gray-400"
                            }`}
                          >
                            {user.plan.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white font-medium">
                          {user.coins.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">
                          {formatDate(user.updatedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {isUpdating ? (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Updating…
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => togglePlan(user)}
                                disabled={isUpdating}
                                className="px-3 py-1.5 text-xs rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {user.plan === "free" ? "Make Pro" : "Make Free"}
                              </button>
                              <button
                                onClick={() => addCoins(user.uid)}
                                disabled={isUpdating}
                                className="p-1.5 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Add 100 Coins"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => removeCoins(user.uid)}
                                disabled={isUpdating}
                                className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Remove 100 Coins"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
