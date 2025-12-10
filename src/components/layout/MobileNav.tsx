"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, MessageCircle, Waves, Image as ImageIcon, Crown } from "lucide-react";
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
      label: "Chat",
      href: "/ai/chat",
      icon: MessageCircle,
    },
    {
      id: "text-to-speech",
      label: "TTS",
      href: "/ai/text-to-speech",
      icon: Waves,
    },
    {
      id: "text-to-image",
      label: "Image",
      href: "/ai/text-to-image",
      icon: ImageIcon,
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around bg-[#0A0A0A]/98 backdrop-blur-xl border-t border-slate-800/80 px-1 py-2 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg transition-all min-w-0 flex-1 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] ${
              active
                ? "text-sky-400 bg-sky-500/15 scale-105"
                : "text-gray-400 hover:text-gray-300 active:scale-95"
            }`}
            aria-label={`Navigate to ${item.label}`}
            aria-current={active ? "page" : undefined}
          >
            <Icon className={`h-5 w-5 flex-shrink-0 ${active ? "text-sky-400" : ""}`} aria-hidden="true" />
            <span className="text-[9px] sm:text-[10px] font-medium truncate w-full text-center leading-tight">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

