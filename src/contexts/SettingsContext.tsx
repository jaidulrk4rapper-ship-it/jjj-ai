// src/contexts/SettingsContext.tsx

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "dark" | "light";
type ReplyLength = "short" | "normal" | "detailed";
type FontSize = "small" | "medium" | "large";
type DefaultLanguage = "auto" | "en" | "hi" | "bn"; // jo bhi tu support kare

export interface JjjSettings {
  theme: Theme;
  replyLength: ReplyLength;
  showTimestamps: boolean;
  fontSize: FontSize;
  reducedMotion: boolean;
  defaultLanguage: DefaultLanguage;
  sidebarCollapsed: boolean;
}

const DEFAULT_SETTINGS: JjjSettings = {
  theme: "dark",
  replyLength: "normal",
  showTimestamps: true,
  fontSize: "medium",
  reducedMotion: false,
  defaultLanguage: "auto",
  sidebarCollapsed: false,
};

type SettingsContextValue = {
  settings: JjjSettings;
  setSettings: (fn: (prev: JjjSettings) => JjjSettings) => void;
  resetSettings: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

const STORAGE_KEY = "jjjai.settings.v1";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, _setSettings] = useState<JjjSettings>(DEFAULT_SETTINGS);

  // 🔁 Load from localStorage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        _setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (e) {
      console.warn("Failed to load settings", e);
    }
  }, []);

  // 💾 Save to localStorage + apply theme / font etc
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn("Failed to save settings", e);
    }

    // Apply theme to <html> for Tailwind / CSS (always dark)
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.dataset.theme = "dark"; // Always dark theme
      
      // Also add/remove class for better compatibility
      root.classList.remove("dark", "light");
      root.classList.add("dark");

      root.style.setProperty(
        "--jjj-font-size",
        settings.fontSize === "small"
          ? "14px"
          : settings.fontSize === "large"
          ? "18px"
          : "16px"
      );

      root.dataset.reducedMotion = settings.reducedMotion ? "true" : "false";
    }
  }, [settings]);

  const setSettings = (fn: (prev: JjjSettings) => JjjSettings) => {
    _setSettings((prev) => fn(prev));
  };

  const resetSettings = () => {
    _setSettings(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
}

