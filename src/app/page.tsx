// app/page.tsx
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#020617] text-slate-50 w-full">
      {/* Background glow layers */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-[-120px] h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute right-[-120px] top-20 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute bottom-[-140px] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* DESKTOP / LAPTOP LAYOUT (md and up) */}
      <div className="relative hidden md:block">
        <div className="container-canvas max-w-tablet-canvas lg:max-w-desktop-canvas mx-auto">
          <div className="flex min-h-[calc(100vh-200px)] flex-col gap-8">
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
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight text-slate-50">
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

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/"
                  className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-[0_18px_45px_rgba(56,189,248,0.50)] hover:from-sky-400 hover:to-indigo-300 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-[#020617]"
                  aria-label="Launch JJJ AI Studio"
                >
                  Launch Studio
                </Link>
                <Link
                  href="/upgrade"
                  className="text-xs font-medium text-slate-300 hover:text-sky-300 transition-colors"
                >
                  Pro → ₹699/mo
                </Link>
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
                <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-800/80 px-2.5 py-1.5 text-[10px] text-slate-100 hover:bg-slate-700/80 transition-colors">
                  Open <span>→</span>
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
                <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-800/80 px-2.5 py-1.5 text-[10px] text-slate-100 hover:bg-slate-700/80 transition-colors">
                  Open <span>→</span>
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
                <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-800/80 px-2.5 py-1.5 text-[10px] text-slate-100 hover:bg-slate-700/80 transition-colors">
                  Open <span>→</span>
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
                <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-950/60 px-2.5 py-1.5 text-[10px] text-amber-50 hover:bg-slate-950/90 transition-colors">
                  Open <span>→</span>
                </div>
              </Link>
            </div>
          </section>
          </div>
        </div>
      </div>

      {/* MOBILE LAYOUT (below md) - 1080x2400px artboard, 9:19.5 aspect ratio */}
      <div className="md:hidden flex min-h-screen max-w-full w-full flex-col items-center bg-[#020617] text-slate-50 overflow-x-hidden">
        {/* MAIN CONTENT */}
        <div className="container-canvas max-w-mobile-canvas w-full pt-4 pb-2 flex flex-col gap-3">
          {/* Top brand row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-xs font-semibold">
                JJJ
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold">JJJ AI Studio</span>
                <span className="text-[11px] text-slate-400">All tools · One screen</span>
              </div>
            </div>

            <Link
              href="/"
              className="rounded-full px-2.5 py-1 text-[10px] font-medium bg-sky-500/90 hover:bg-sky-400 active:scale-[0.97] shadow-sm"
            >
              Open
            </Link>
          </div>

          {/* Welcome card */}
          <div className="rounded-3xl bg-gradient-to-br from-[#020b2b] via-[#020617] to-[#0b1120] border border-slate-800/70 px-4 py-3 shadow-[0_0_35px_rgba(15,23,42,0.7)]">
            <p className="text-xs text-slate-400">Welcome, boss 👑</p>
          </div>

          {/* Feature grid – smaller premium-style buttons */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {/* AI Chat */}
            <Link
              href="/ai/chat"
              className="flex flex-col items-start rounded-2xl bg-[#020b2b] border border-slate-800/80 px-3 py-3 shadow-sm active:scale-[0.97]"
            >
              <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-xl bg-sky-500/20 text-xs">
                💬
              </div>
              <span className="text-xs font-semibold">AI Chat</span>
              <span className="mt-0.5 text-[11px] text-slate-400">
                Doubt clear, scripts, ideas.
              </span>
            </Link>

            {/* Text → Speech */}
            <Link
              href="/ai/text-to-speech"
              className="flex flex-col items-start rounded-2xl bg-[#020b2b] border border-slate-800/80 px-3 py-3 shadow-sm active:scale-[0.97]"
            >
              <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-xl bg-violet-500/20 text-xs">
                🎧
              </div>
              <span className="text-xs font-semibold">Text → Speech</span>
              <span className="mt-0.5 text-[11px] text-slate-400">
                Reels & videos ke liye voice.
              </span>
            </Link>

            {/* Speech → Text */}
            <Link
              href="/ai/speech-to-text"
              className="flex flex-col items-start rounded-2xl bg-[#020b2b] border border-slate-800/80 px-3 py-3 shadow-sm active:scale-[0.97]"
            >
              <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/20 text-xs">
                📝
              </div>
              <span className="text-xs font-semibold">Speech → Text</span>
              <span className="mt-0.5 text-[11px] text-slate-400">
                Notes, meetings ko text banao.
              </span>
            </Link>

            {/* Text → Image */}
            <Link
              href="/ai/text-to-image"
              className="flex flex-col items-start rounded-2xl bg-[#020b2b] border border-amber-500/60 px-3 py-3 shadow-[0_0_20px_rgba(245,158,11,0.35)] active:scale-[0.97]"
            >
              <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/20 text-xs">
                🖼️
              </div>
              <span className="text-xs font-semibold">Text → Image</span>
              <span className="mt-0.5 text-[11px] text-amber-100/90">
                Thumbnail, poster, banner.
              </span>
            </Link>

            {/* Upgrade to Pro */}
            <Link
              href="/upgrade"
              className="flex flex-col items-start rounded-2xl bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-400 px-3 py-3 text-slate-900 shadow-[0_0_28px_rgba(250,204,21,0.6)] active:scale-[0.97]"
            >
              <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-xl bg-black/10 text-xs">
                👑
              </div>
              <span className="text-xs font-semibold">Upgrade to Pro</span>
              <span className="mt-0.5 text-[11px] text-slate-900/80">
                High limits · priority support.
              </span>
            </Link>

            {/* Account & Settings */}
            <Link
              href="/account"
              className="flex flex-col items-start rounded-2xl bg-[#020b2b] border border-slate-800/80 px-3 py-3 shadow-sm active:scale-[0.97]"
            >
              <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-xl bg-slate-500/20 text-xs">
                ⚙️
              </div>
              <span className="text-xs font-semibold">Account & Settings</span>
              <span className="mt-0.5 text-[11px] text-slate-400">
                Plan, usage, profile & support.
              </span>
            </Link>
          </div>
        </div>

        {/* FOOTER – single, tiny, no scroll */}
        <footer className="container-canvas max-w-mobile-canvas w-full pb-3 pt-1 border-t border-slate-800 text-[10px] text-slate-500">
          <div className="flex items-center justify-between">
            <span>© {new Date().getFullYear()} JJJ AI Studio</span>
            <div className="flex gap-2">
              <a href="/contact" className="underline underline-offset-2">Contact</a>
              <a href="/terms" className="underline underline-offset-2">Policies</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

