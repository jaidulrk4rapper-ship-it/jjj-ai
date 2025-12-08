"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Footer from "@/components/layout/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  // For admin routes, just render children (admin layout will handle its own UI)
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // For non-admin routes, render the normal layout with sidebar/topbar/footer
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[240px]">
        <Topbar />
        <main className="flex-1 p-6 bg-black">
          <div className="h-full rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] p-6">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

