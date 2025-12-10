"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSettings } from "@/contexts/SettingsContext";

export default function SettingsDock() {
  const [open, setOpen] = useState(false);

  const { settings, setSettings, resetSettings } = useSettings();

  const setReplyLength = (replyLength: "short" | "normal" | "detailed") => {
    setSettings((prev) => ({ ...prev, replyLength }));
  };

  const setFontSize = (fontSize: "small" | "medium" | "large") => {
    setSettings((prev) => ({ ...prev, fontSize }));
  };

  return (
    <>
      {/* S button bottom-left - hidden on mobile to avoid overlap with MobileNav */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="hidden md:flex fixed bottom-4 left-4 z-40 h-10 w-10 items-center justify-center rounded-full border border-[#1A1A1A] bg-black/80 text-sm font-semibold text-gray-100 shadow-[0_0_18px_rgba(0,0,0,0.9)] hover:border-sky-500 hover:text-sky-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.7)]"
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
            className="fixed left-0 top-16 z-50 w-[280px] max-w-[80vw] rounded-3xl border border-slate-800 bg-[#020617] px-4 py-4 shadow-2xl text-slate-50"
          >
            <div className="relative">
              {/* Close button - top-right */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute -top-1 -right-1 text-xs text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>

              <div className="space-y-4 text-xs">
                <div>
                  <h2 className="text-[11px] font-semibold tracking-wide text-slate-300">
                    SETTINGS
                  </h2>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    JJJ AI ko apne style ke hisaab se set karo.
                  </p>
                </div>

                {/* Reply length */}
                <div className="space-y-2">
                  <h3 className="text-[11px] font-semibold text-slate-300">
                    Reply length
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setReplyLength("short")}
                      className={`flex-1 rounded-full px-2 py-1.5 text-[11px] ${
                        settings.replyLength === "short"
                          ? "bg-sky-500 text-slate-950"
                          : "bg-slate-900 text-slate-300"
                      }`}
                    >
                      Short
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplyLength("normal")}
                      className={`flex-1 rounded-full px-2 py-1.5 text-[11px] ${
                        settings.replyLength === "normal"
                          ? "bg-sky-500 text-slate-950"
                          : "bg-slate-900 text-slate-300"
                      }`}
                    >
                      Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplyLength("detailed")}
                      className={`flex-1 rounded-full px-2 py-1.5 text-[11px] ${
                        settings.replyLength === "detailed"
                          ? "bg-sky-500 text-slate-950"
                          : "bg-slate-900 text-slate-300"
                      }`}
                    >
                      Detailed
                    </button>
                  </div>
                </div>

                {/* Font size */}
                <div className="space-y-2">
                  <h3 className="text-[11px] font-semibold text-slate-300">
                    Font size
                  </h3>
                  <select
                    value={settings.fontSize}
                    onChange={(e) => setFontSize(e.target.value as "small" | "medium" | "large")}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium (default)</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

