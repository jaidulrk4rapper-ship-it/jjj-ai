// app/page.tsx
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-slate-50">
      {/* Background glow layers */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-[-120px] h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute right-[-120px] top-20 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute bottom-[-140px] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* DESKTOP / LAPTOP LAYOUT (md and up) */}
      <div className="relative hidden md:block">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-8 py-10">
          {/* Top bar */}
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-500/60 bg-slate-900/60 shadow-[0_0_24px_rgba(56,189,248,0.35)] backdrop-blur">
                <span className="text-lg font-semibold tracking-tight text-sky-200">
                  JJJ
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
                  JJJ AI Studio
                </div>
                <div className="text-xs text-slate-400">
                  Full AI workspace for chat, voice &amp; content
                </div>
              </div>
            </div>

            <nav className="flex items-center gap-6 text-xs font-medium text-slate-300">
              <a href="#tools" className="hover:text-sky-300 transition-colors">
                Tools
              </a>
              <a href="#pricing" className="hover:text-sky-300 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="hover:text-sky-300 transition-colors">
                FAQ
              </a>
              <Link
                href="/"
                className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-4 py-2 text-xs font-semibold text-slate-950 shadow-[0_14px_45px_rgba(34,211,238,0.35)] hover:from-sky-300 hover:to-cyan-200 transition-all"
              >
                Open JJJ AI Studio
              </Link>
            </nav>
          </header>

          {/* Hero + main tools */}
          <section className="grid flex-1 grid-cols-[2fr,1.4fr] items-stretch gap-8">
            {/* Left hero */}
            <div className="flex flex-col justify-center gap-7">
              <p className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-[11px] font-medium text-emerald-200 shadow-[0_0_18px_rgba(52,211,153,0.35)]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live • Studio dashboard ready in one click
              </p>

              <div className="space-y-4">
                <h1 className="text-4xl font-semibold leading-tight text-slate-50">
                  Your{" "}
                  <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
                    entire AI workflow
                  </span>{" "}
                  in one clean studio.
                </h1>

                <p className="max-w-xl text-sm text-slate-300">
                  Switch between AI chat, text-to-speech, speech-to-text and
                  image generation without leaving a single dashboard. Designed
                  for creators, YouTubers and small teams who want speed, not
                  clutter.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/"
                  className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-400 px-5 py-2.5 text-xs font-semibold text-slate-950 shadow-[0_18px_45px_rgba(56,189,248,0.50)] hover:from-sky-400 hover:to-indigo-300 transition-all"
                >
                  Launch Studio
                </Link>
                <Link
                  href="/upgrade"
                  className="text-xs font-medium text-slate-300 hover:text-sky-300 transition-colors"
                >
                  See Pro plan → ₹699/month
                </Link>
              </div>

              <div className="mt-2 flex flex-wrap gap-4 text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-sky-400" /> AI Chat •
                  TTS • STT • Images
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />{" "}
                  Secure billing with Razorpay
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-indigo-400" /> Fast,
                  distraction-free UI
                </span>
              </div>
            </div>

            {/* Right preview cards */}
            <div
              id="tools"
              className="grid h-full grid-cols-2 gap-3 rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.85)] backdrop-blur-xl"
            >
              {/* AI Chat */}
              <Link
                href="/ai/chat"
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-900/60 p-3 shadow-[0_12px_30px_rgba(15,23,42,0.8)] hover:border-sky-500/50 transition-colors"
              >
                <div>
                  <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/20 text-sky-300">
                    💬
                  </div>
                  <h3 className="text-sm font-semibold text-slate-50">
                    AI Chat
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Gemini-powered assistant for ideas, scripts, research &amp;
                    replies.
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-800/80 px-3 py-2 text-[11px] text-slate-100 hover:bg-slate-700/80 transition-colors">
                  Open AI Chat <span>→</span>
                </div>
              </Link>

              {/* Text to Speech */}
              <Link
                href="/ai/text-to-speech"
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-900/60 p-3 shadow-[0_12px_30px_rgba(15,23,42,0.8)] hover:border-purple-500/50 transition-colors"
              >
                <div>
                  <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
                    🔊
                  </div>
                  <h3 className="text-sm font-semibold text-slate-50">
                    Text → Speech
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Studio-quality voices for shorts, reels, explainers &
                    podcasts.
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-800/80 px-3 py-2 text-[11px] text-slate-100 hover:bg-slate-700/80 transition-colors">
                  Open TTS <span>→</span>
                </div>
              </Link>

              {/* Speech to Text */}
              <Link
                href="/ai/speech-to-text"
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-900/60 p-3 shadow-[0_12px_30px_rgba(15,23,42,0.8)] hover:border-emerald-500/50 transition-colors"
              >
                <div>
                  <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                    🎙️
                  </div>
                  <h3 className="text-sm font-semibold text-slate-50">
                    Speech → Text
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Turn long audio, meetings &amp; thoughts into clean text in
                    seconds.
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-800/80 px-3 py-2 text-[11px] text-slate-100 hover:bg-slate-700/80 transition-colors">
                  Open STT <span>→</span>
                </div>
              </Link>

              {/* Text to Image */}
              <Link
                href="/ai/text-to-image"
                className="flex flex-col justify-between rounded-2xl border border-amber-400/70 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-amber-900/50 p-3 shadow-[0_16px_40px_rgba(245,158,11,0.35)] hover:border-amber-400/90 transition-colors"
              >
                <div>
                  <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
                    🖼️
                  </div>
                  <h3 className="text-sm font-semibold text-slate-50">
                    Text → Image
                  </h3>
                  <p className="mt-1 text-[11px] text-amber-100/90">
                    Thumbnails, posters &amp; concept art matched to your brand.
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-950/60 px-3 py-2 text-[11px] text-amber-50 hover:bg-slate-950/90 transition-colors">
                  Open Image Studio <span>→</span>
                </div>
              </Link>
            </div>
          </section>

          {/* Desktop footer */}
          <footer className="border-t border-slate-800 mt-12 py-6 text-sm text-slate-400">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
              <span>© {new Date().getFullYear()} JJJ AI Studio</span>
              <div className="flex gap-4">
                <a href="/contact" className="hover:underline">
                  Contact Us
                </a>
                <a href="/terms" className="hover:underline">
                  Terms &amp; Conditions
                </a>
                <a href="/privacy" className="hover:underline">
                  Privacy Policy
                </a>
                <a href="/refund" className="hover:underline">
                  Refund &amp; Cancellation Policy
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* MOBILE LAYOUT (below md) */}
      <div className="relative block md:hidden">
        <div className="flex min-h-screen flex-col bg-[#020617]/95 px-4 py-5">
          {/* Mobile header */}
          <header className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-sky-500/60 bg-slate-900/70 shadow-[0_0_18px_rgba(56,189,248,0.45)]">
                <span className="text-sm font-semibold text-sky-200">JJJ</span>
              </div>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-slate-100">
                  JJJ AI Studio
                </p>
                <p className="text-[10px] text-slate-400">
                  All tools in one screen
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-3 py-1.5 text-[10px] font-semibold text-slate-950 shadow-[0_10px_30px_rgba(56,189,248,0.50)] transition-all hover:from-sky-400 hover:to-cyan-300"
            >
              Open Studio
            </Link>
          </header>

          {/* ONE-SCREEN TOOLS GRID */}
          <section className="flex-1 rounded-3xl border border-slate-800 bg-slate-900/70 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.9)]">
            <h1 className="mb-1.5 text-sm font-semibold text-slate-50">
              Welcome, boss 👑
            </h1>
            <p className="mb-3 text-[10px] text-slate-300">
              Sab main features ek hi screen pe. Tap karke seedha tool open
              karo — scroll kam, kaam zyada.
            </p>

            <div className="grid h-[72vh] grid-cols-2 grid-rows-3 gap-3">
              {/* AI Chat */}
              <Link
                href="/ai/chat"
                className="flex flex-col items-start justify-between rounded-2xl border border-slate-800 bg-slate-900/95 px-3 py-2 text-left shadow-[0_10px_26px_rgba(15,23,42,0.9)] hover:border-sky-500/50 transition-colors"
              >
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-300 text-sm">
                  💬
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-50">
                    AI Chat
                  </div>
                  <div className="mt-0.5 text-[9px] text-slate-400">
                    Doubt clear, scripts, ideas — sab ek jagah.
                  </div>
                </div>
              </Link>

              {/* TTS */}
              <Link
                href="/ai/text-to-speech"
                className="flex flex-col items-start justify-between rounded-2xl border border-slate-800 bg-slate-900/95 px-3 py-2 text-left shadow-[0_10px_26px_rgba(15,23,42,0.9)] hover:border-purple-500/50 transition-colors"
              >
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300 text-sm">
                  🔊
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-50">
                    Text → Speech
                  </div>
                  <div className="mt-0.5 text-[9px] text-slate-400">
                    Reels &amp; videos ke liye natural voice.
                  </div>
                </div>
              </Link>

              {/* STT */}
              <Link
                href="/ai/speech-to-text"
                className="flex flex-col items-start justify-between rounded-2xl border border-slate-800 bg-slate-900/95 px-3 py-2 text-left shadow-[0_10px_26px_rgba(15,23,42,0.9)] hover:border-emerald-500/50 transition-colors"
              >
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 text-sm">
                  🎙️
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-50">
                    Speech → Text
                  </div>
                  <div className="mt-0.5 text-[9px] text-slate-400">
                    Meetings, notes &amp; audio ko text bana do.
                  </div>
                </div>
              </Link>

              {/* Text to Image */}
              <Link
                href="/ai/text-to-image"
                className="flex flex-col items-start justify-between rounded-2xl border border-amber-400/60 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-amber-900/60 px-3 py-2 text-left shadow-[0_12px_30px_rgba(245,158,11,0.4)] hover:border-amber-400/90 transition-colors"
              >
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300 text-sm">
                  🖼️
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-50">
                    Text → Image
                  </div>
                  <div className="mt-0.5 text-[9px] text-amber-100/90">
                    Thumbnail, poster, banner – sab AI se.
                  </div>
                </div>
              </Link>

              {/* Upgrade card */}
              <Link
                href="/upgrade"
                className="flex flex-col items-start justify-between rounded-2xl border border-yellow-400/60 bg-yellow-500/10 px-3 py-2 text-left shadow-[0_10px_26px_rgba(202,138,4,0.55)] hover:border-yellow-400/90 transition-colors"
              >
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-300 text-sm">
                  👑
                </div>
                <div>
                  <div className="text-xs font-semibold text-yellow-100">
                    Upgrade to Pro
                  </div>
                  <div className="mt-0.5 text-[9px] text-yellow-100/90">
                    High limits, priority access – ₹699/month.
                  </div>
                </div>
              </Link>

              {/* Account / Settings */}
              <Link
                href="/account"
                className="flex flex-col items-start justify-between rounded-2xl border border-slate-700 bg-slate-900/95 px-3 py-2 text-left shadow-[0_10px_26px_rgba(15,23,42,0.9)] hover:border-slate-600 transition-colors"
              >
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-300 text-sm">
                  ⚙️
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-50">
                    Account &amp; Settings
                  </div>
                  <div className="mt-0.5 text-[9px] text-slate-400">
                    Usage, plan, profile &amp; support.
                  </div>
                </div>
              </Link>
            </div>
          </section>

          {/* Mobile footer – compact buttons */}
          <footer className="border-t border-slate-800 mt-12 py-6 text-sm text-slate-400">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
              <span>© {new Date().getFullYear()} JJJ AI Studio</span>
              <div className="flex gap-4">
                <a href="/contact" className="hover:underline">
                  Contact Us
                </a>
                <a href="/terms" className="hover:underline">
                  Terms &amp; Conditions
                </a>
                <a href="/privacy" className="hover:underline">
                  Privacy Policy
                </a>
                <a href="/refund" className="hover:underline">
                  Refund &amp; Cancellation Policy
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
