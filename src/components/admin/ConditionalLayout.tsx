"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Footer from "@/components/layout/Footer";
import { useSettings } from "@/contexts/SettingsContext";
import clsx from "clsx";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { settings } = useSettings();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Desktop margin depends on collapsed state.
  // Mobile (width < md) me margin left 0 rahega (sidebar overlay hai)
  const desktopMargin = settings.sidebarCollapsed ? "0px" : "240px";

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div
        className={clsx(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out w-full",
          // Mobile: no margin (sidebar overlay)
          // Desktop: dynamic margin based on collapsed state
          settings.sidebarCollapsed ? "md:ml-0" : "md:ml-[240px]"
        )}
        style={
          {
            // Fallback for dynamic margin (if Tailwind classes don't work)
            "--desktop-ml": desktopMargin,
          } as React.CSSProperties
        }
      >
        <Topbar />
        <main className="flex-1 p-1 sm:p-2 md:p-3 lg:p-4 xl:p-6 bg-black overflow-x-hidden">
          <div className="h-full rounded-lg sm:rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

