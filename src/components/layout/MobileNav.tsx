"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, MessageCircle, Sparkles, Crown } from "lucide-react";
import { useJjjUser } from "@/providers/UserProvider";

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useJjjUser();
  const isPro = user?.plan === "pro";

  // Hide mobile nav on admin routes and login pages
  const isAdminRoute = pathname?.startsWith("/admin");
  const isLoginRoute = pathname?.startsWith("/login") || pathname?.startsWith("/signup");
  
  if (isAdminRoute || isLoginRoute) {
    return null;
  }

  const navItems = [
    {
      id: "home",
      label: "Home",
      href: "/",
      icon: Home,
    },
    {
      id: "ai-chat",
      label: "AI",
      href: "/ai/chat",
      icon: MessageCircle,
    },
    {
      id: "studio",
      label: "Studio",
      href: "/studio",
      icon: Sparkles,
    },
    {
      id: "upgrade",
      label: isPro ? "Pro" : "Upgrade",
      href: "/upgrade",
      icon: Crown,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 flex md:hidden items-center justify-around bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 safe-area-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-0 flex-1 ${
              active
                ? "text-sky-400 bg-sky-500/10"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <Icon className={`h-5 w-5 ${active ? "text-sky-400" : ""}`} />
            <span className="text-[10px] font-medium truncate w-full text-center">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

