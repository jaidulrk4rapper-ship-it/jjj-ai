"use client";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg">
          <Sun className="h-5 w-5 text-gray-400" />
        </div>
        <div className="p-2 rounded-lg">
          <Moon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="p-2 rounded-lg">
          <Laptop className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 ${
          theme === "light" ? "text-sky-400" : "text-gray-400 dark:text-gray-400"
        }`}
      >
        <Sun className="h-5 w-5" />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 ${
          theme === "dark" ? "text-sky-400" : "text-gray-400 dark:text-gray-400"
        }`}
      >
        <Moon className="h-5 w-5" />
      </button>

      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 ${
          theme === "system" ? "text-sky-400" : "text-gray-400 dark:text-gray-400"
        }`}
      >
        <Laptop className="h-5 w-5" />
      </button>
    </div>
  );
}
