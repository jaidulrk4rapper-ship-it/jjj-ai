"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "./ToastProvider";

export function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Ctrl/Cmd + K: Quick navigation
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        toast.info("Press / for shortcuts");
      }

      // / key: Show shortcuts help
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toast.info("Shortcuts: Ctrl+K (nav), Esc (close modals)");
      }

      // Esc: Close modals/sidebars
      if (e.key === "Escape") {
        // This will be handled by individual components
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, pathname, toast]);

  return null;
}

