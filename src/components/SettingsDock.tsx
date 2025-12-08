"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSettings } from "./settings-provider";

export default function SettingsDock() {
  const [open, setOpen] = useState(false);

  const {
    replyLength,
    setReplyLength,
    showTimestamps,
    toggleTimestamps,
    fontSize,
    setFontSize,
    reducedMotion,
    toggleReducedMotion,
    defaultLang,
    setDefaultLang,
    theme,
    setTheme,
  } = useSettings();

  const handleReset = () => {
    setReplyLength("normal");
    if (!showTimestamps) toggleTimestamps();
    setFontSize("medium");
    if (reducedMotion) toggleReducedMotion();
    setDefaultLang("auto");
    setTheme("dark");
  };

  return (
    <>
      {/* S button bottom-left */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-[#1A1A1A] bg-black/80 text-sm font-semibold text-gray-100 shadow-[0_0_18px_rgba(0,0,0,0.9)] hover:border-sky-500 hover:text-sky-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.7)]"
        title="JJJ AI Settings"
      >
        S
      </button>

      {/* Floating window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-16 left-4 z-40 w-80 rounded-2xl border border-[#1A1A1A] bg-black/95 px-4 py-4 text-sm text-gray-300 shadow-[0_0_40px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          >
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Settings
                </h2>
                <p className="text-[11px] text-gray-500">
                  JJJ AI ko apne style ke hisaab se set karo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs text-gray-500 hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Theme toggle: Dark / Light */}
            <section className="mb-3 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Theme
              </p>
              <p className="text-[11px] text-gray-500">
                Left = Dark, Right = Light
              </p>
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative mt-1 flex h-7 w-full items-center rounded-full border border-[#1A1A1A] bg-[#050505] px-1 text-[11px] text-gray-400"
              >
                <span className="flex-1 text-center">Dark</span>
                <span className="flex-1 text-center">Light</span>
                <span
                  className={`absolute top-0.5 h-6 w-1/2 rounded-full bg-sky-600/80 shadow-[0_0_16px_rgba(56,189,248,0.7)] transition-transform ${
                    theme === "dark" ? "translate-x-0" : "translate-x-full"
                  }`}
                />
              </button>
            </section>

            {/* Chat experience */}
            <section className="mb-3 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Chat experience
              </p>

              {/* Reply length */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Reply length</label>
                <div className="inline-flex rounded-full border border-[#1A1A1A] bg-[#050505] p-1 text-xs">
                  {[
                    { key: "short", label: "Short" },
                    { key: "normal", label: "Normal" },
                    { key: "detailed", label: "Detailed" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() =>
                        setReplyLength(opt.key as typeof replyLength)
                      }
                      className={`px-3 py-1 rounded-full transition-colors ${
                        replyLength === opt.key
                          ? "bg-sky-600 text-white"
                          : "text-gray-400 hover:bg-[#111111]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timestamps */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Show timestamps</span>
                <button
                  type="button"
                  onClick={toggleTimestamps}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full border border-[#1A1A1A] px-0.5 transition-colors ${
                    showTimestamps ? "bg-sky-600" : "bg-[#050505]"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-white transition-transform ${
                      showTimestamps ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </section>

            {/* Interface */}
            <section className="mb-3 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Interface
              </p>

              {/* Font size */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Font size</label>
                <select
                  value={fontSize}
                  onChange={(e) =>
                    setFontSize(e.target.value as typeof fontSize)
                  }
                  className="w-full rounded-lg border border-[#1A1A1A] bg-[#050505] px-2 py-1.5 text-xs text-gray-200 outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium (default)</option>
                  <option value="large">Large</option>
                </select>
              </div>

              {/* Reduced motion */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Reduced motion</span>
                <button
                  type="button"
                  onClick={toggleReducedMotion}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full border border-[#1A1A1A] px-0.5 transition-colors ${
                    reducedMotion ? "bg-sky-600" : "bg-[#050505]"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-white transition-transform ${
                      reducedMotion ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </section>

            {/* AI defaults */}
            <section className="mb-3 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                AI defaults
              </p>
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Default language</label>
                <select
                  value={defaultLang}
                  onChange={(e) =>
                    setDefaultLang(e.target.value as typeof defaultLang)
                  }
                  className="w-full rounded-lg border border-[#1A1A1A] bg-[#050505] px-2 py-1.5 text-xs text-gray-200 outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="auto">Auto detect</option>
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
            </section>

            {/* Reset */}
            <div className="mt-2 border-t border-[#1A1A1A] pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full rounded-lg border border-[#1A1A1A] bg-[#050505] px-3 py-2 text-xs text-gray-300 hover:bg-[#111111]"
              >
                Reset to defaults
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

