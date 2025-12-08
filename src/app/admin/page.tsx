"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  UserCheck, 
  Crown, 
  Coins, 
  TrendingUp,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { adminFetch } from "@/lib/adminClient";
import type { AdminStats } from "@/app/api/admin/stats/route";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const router = useRouter();

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await adminFetch<{ ok: boolean } & AdminStats>("/api/admin/stats");
      // Extract stats (remove ok field)
      const { ok, ...statsData } = data;
      setStats(statsData);
    } catch (err: any) {
      console.error("Failed to fetch stats:", err);
      
      if (err.message === "ADMIN_UNAUTHORIZED") {
        localStorage.removeItem("jjj_admin_key");
        router.push("/admin/login");
        return;
      }
      
      setError(err?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-400">Loading admin dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-white min-h-[400px]">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="mb-2 text-red-400 font-semibold">Error loading dashboard</p>
        <p className="mb-4 text-sm text-gray-400 max-w-md text-center">{error}</p>
        {error === "ADMIN_UNAUTHORIZED" ? (
          <button
            onClick={() => {
              localStorage.removeItem("jjj_admin_key");
              router.push("/admin/login");
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
          >
            Back to login
          </button>
        ) : (
          <button
            onClick={fetchStats}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Overview of JJJ AI platform statistics</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] text-white text-sm transition-colors border border-[#2A2A2A]"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <h3 className="text-sm text-gray-400 mb-1">Total Users</h3>
          <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
        </div>

        {/* Free Users */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gray-500/10 border border-gray-500/20">
              <UserCheck className="w-6 h-6 text-gray-400" />
            </div>
          </div>
          <h3 className="text-sm text-gray-400 mb-1">Free Users</h3>
          <p className="text-3xl font-bold text-white">{stats.freeUsers}</p>
        </div>

        {/* Pro Users */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <Crown className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <h3 className="text-sm text-gray-400 mb-1">Pro Users</h3>
          <p className="text-3xl font-bold text-white">{stats.proUsers}</p>
        </div>

        {/* Total Coins */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <Coins className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <h3 className="text-sm text-gray-400 mb-1">Total Coins</h3>
          <p className="text-3xl font-bold text-white">{stats.totalCoins.toLocaleString()}</p>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Platform Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Pro Conversion Rate</p>
            <p className="text-2xl font-bold text-white">
              {stats.proConversionRate.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Free Plan Users</p>
            <p className="text-2xl font-bold text-white">
              {stats.totalUsers > 0
                ? ((stats.freeUsers / stats.totalUsers) * 100).toFixed(1)
                : "0"}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Last Updated</p>
            <p className="text-sm font-medium text-white">
              {formatTime(stats.lastUpdated)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
