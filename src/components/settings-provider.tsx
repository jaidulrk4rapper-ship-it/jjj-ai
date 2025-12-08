"use client";

import React, { createContext, useContext, useState } from "react";

type ReplyLength = "short" | "normal" | "detailed";
type FontSize = "small" | "medium" | "large";
type DefaultLang = "auto" | "en" | "hi";
type ThemeMode = "dark" | "light";

type SettingsContextType = {
  replyLength: ReplyLength;
  setReplyLength: (v: ReplyLength) => void;

  showTimestamps: boolean;
  toggleTimestamps: () => void;

  fontSize: FontSize;
  setFontSize: (v: FontSize) => void;

  reducedMotion: boolean;
  toggleReducedMotion: () => void;

  defaultLang: DefaultLang;
  setDefaultLang: (v: DefaultLang) => void;

  theme: ThemeMode;
  setTheme: (v: ThemeMode) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [replyLength, setReplyLength] = useState<ReplyLength>("normal");
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [defaultLang, setDefaultLang] = useState<DefaultLang>("auto");
  const [theme, setTheme] = useState<ThemeMode>("dark"); // default dark

  const value: SettingsContextType = {
    replyLength,
    setReplyLength,
    showTimestamps,
    toggleTimestamps: () => setShowTimestamps((v) => !v),
    fontSize,
    setFontSize,
    reducedMotion,
    toggleReducedMotion: () => setReducedMotion((v) => !v),
    defaultLang,
    setDefaultLang,
    theme,
    setTheme,
  };

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }
  return ctx;
}

