// src/app/admin/layout.tsx

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // All hooks must be called before any conditional returns
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check authentication
  const adminKey = typeof window !== "undefined" ? localStorage.getItem("jjj_admin_key") : null;
  
  // Handle redirect in useEffect (must be called before any returns)
  useEffect(() => {
    if (mounted && !adminKey && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [adminKey, mounted, pathname, router]);

  // Skip layout for login page - just render children
  if (pathname === "/admin/login") {
    return <div className="w-full min-h-screen bg-black text-white">{children}</div>;
  }

  // Show loading only on initial mount
  if (!mounted) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-white">Loading admin panel...</div>
      </div>
    );
  }

  // Check authentication and redirect if needed
  if (!adminKey) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-white">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Top bar */}
      <header className="w-full border-b border-white/10 px-6 py-4 flex justify-between items-center bg-black">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">JJJ AI — Admin Panel</h1>
          <nav className="flex items-center gap-4">
            <a
              href="/admin"
              className={`text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1 ${
                pathname === "/admin" ? "text-blue-400 font-medium" : "text-gray-400 hover:text-white"
              }`}
            >
              Dashboard
            </a>
            <a
              href="/admin/users"
              className={`text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1 ${
                pathname === "/admin/users" ? "text-blue-400 font-medium" : "text-gray-400 hover:text-white"
              }`}
            >
              Users
            </a>
          </nav>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("jjj_admin_key");
            router.push("/admin/login");
          }}
          className="text-sm text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1"
          aria-label="Logout from admin panel"
        >
          Logout
        </button>
      </header>

      {/* Content */}
      <main className="p-6">{children}</main>
    </div>
  );
}
