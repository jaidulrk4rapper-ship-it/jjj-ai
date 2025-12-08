"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Trim password before sending
      const trimmedPassword = password.trim();
      
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: trimmedPassword }),
      });

      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(text || "Invalid response from server");
      }

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Invalid password");
      }

      // Save admin key locally for /admin page
      if (data.adminKey) {
        localStorage.setItem("jjj_admin_key", data.adminKey as string);
      }

      router.push("/admin");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center text-white">
      <div className="bg-black/60 border border-white/10 rounded-xl p-6 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4 text-center">
          JJJ AI Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">
              Admin password
            </label>
            <input
              type="password"
              className="w-full rounded-md bg-black/70 border border-white/15 px-3 py-2 text-sm outline-none focus:border-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
            />
          </div>
          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-60 py-2 text-sm font-medium"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
        <p className="mt-3 text-xs text-center text-gray-400">
          Use the password from <code className="text-gray-300">ADMIN_PASSWORD</code> in .env.local
        </p>
      </div>
    </div>
  );
}
