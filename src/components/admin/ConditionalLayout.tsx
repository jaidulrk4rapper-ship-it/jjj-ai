"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
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
  const isChatRoute = pathname?.startsWith("/ai/chat");
  const isAiRoute = pathname?.startsWith("/ai");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Desktop margin depends on collapsed state.
  // Mobile (width < md) me margin left 0 rahega (sidebar overlay hai)
  const desktopMargin = settings.sidebarCollapsed ? "0px" : "240px";

  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden md:max-w-none">
      {/* Sidebar - handles its own mobile/desktop display */}
      <Sidebar />

      {/* Main content area */}
      <div
        className={clsx(
          "flex-1 flex flex-col min-w-0 w-full max-w-full transition-all duration-300 ease-in-out",
          // Mobile: no margin (sidebar overlay), maintain aspect ratio
          // Desktop: dynamic margin based on collapsed state
          settings.sidebarCollapsed ? "md:ml-0" : "md:ml-[240px]"
        )}
      >
        <Topbar />
        {isChatRoute ? (
          // Full screen for chat page - no padding or border
          <main className="flex-1 bg-black overflow-x-hidden min-h-0 pb-20 md:pb-0">
            {children}
          </main>
        ) : (
          // Normal layout with 24px padding and canvas container
          <main className="flex-1 bg-black overflow-x-hidden min-h-0 overflow-y-auto pb-20 md:pb-0">
            <div className="container-canvas min-h-full max-w-mobile-canvas md:max-w-tablet-canvas lg:max-w-desktop-canvas mx-auto">
              <div className="rounded-lg sm:rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] p-6">
                {children}
              </div>
            </div>
          </main>
        )}
        {!isAiRoute && <Footer />}
      </div>
      
      {/* Mobile Navigation - only visible on mobile */}
      <MobileNav />
    </div>
  );
}

