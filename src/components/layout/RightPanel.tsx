"use client";

import { useState } from "react";

type ReplyLength = "short" | "normal" | "detailed";
type FontSize = "small" | "medium" | "large";
type DefaultLang = "auto" | "en" | "hi";

export default function RightPanel() {
  const [replyLength, setReplyLength] = useState<ReplyLength>("normal");
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [defaultLang, setDefaultLang] = useState<DefaultLang>("auto");

  function resetAll() {
    setReplyLength("normal");
    setShowTimestamps(true);
    setFontSize("medium");
    setReducedMotion(false);
    setDefaultLang("auto");
  }

  return (
    <aside className="hidden lg:flex h-full w-72 flex-col border-l border-[#1A1A1A] bg-black px-4 py-4 text-sm text-gray-300">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Settings
      </h2>
      <p className="mb-4 text-xs text-gray-500">
        Tune JJJ AI according to your style. These are local preferences for
        this browser.
      </p>

      {/* Chat Experience */}
      <section className="mb-4 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Chat experience
        </h3>

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
                onClick={() => setReplyLength(opt.key as ReplyLength)}
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

        {/* Show timestamps */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300">Show timestamps</p>
            <p className="text-[11px] text-gray-500">
              Show time under each AI message.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowTimestamps((v) => !v)}
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
      <section className="mb-4 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Interface
        </h3>

        {/* Font size */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Font size</label>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as FontSize)}
            className="w-full rounded-lg border border-[#1A1A1A] bg-[#050505] px-2 py-1.5 text-xs text-gray-200 outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="small">Small</option>
            <option value="medium">Medium (default)</option>
            <option value="large">Large</option>
          </select>
        </div>

        {/* Reduced motion */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs text-gray-300">Reduced motion</p>
            <p className="text-[11px] text-gray-500">
              Turn off heavy animations if you prefer.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setReducedMotion((v) => !v)}
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

      {/* AI Defaults */}
      <section className="mb-4 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          AI defaults
        </h3>

        {/* Default language */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Default language</label>
          <select
            value={defaultLang}
            onChange={(e) => setDefaultLang(e.target.value as DefaultLang)}
            className="w-full rounded-lg border border-[#1A1A1A] bg-[#050505] px-2 py-1.5 text-xs text-gray-200 outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="auto">Auto detect</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
      </section>

      {/* Reset */}
      <div className="mt-auto pt-3 border-t border-[#1A1A1A]">
        <button
          type="button"
          onClick={resetAll}
          className="w-full rounded-lg border border-[#1A1A1A] bg-[#050505] px-3 py-2 text-xs text-gray-300 hover:bg-[#111111]"
        >
          Reset to defaults
        </button>
        <p className="mt-2 text-[11px] text-gray-500">
          These settings are just UI preferences right now. Later we can wire
          them into the API behavior.
        </p>
      </div>
    </aside>
  );
}
