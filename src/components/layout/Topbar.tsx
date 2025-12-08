'use client';

export default function Topbar({ title = 'JJJ AI Studio' }: { title?: string }) {
  return (
    <div className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[#1A1A1A] bg-[#050505]/80 px-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
      {/* Left side - Title with gradient */}
      <div className="text-sm font-medium text-gray-200">
        <span className="bg-gradient-to-r from-gray-100 via-sky-400 to-gray-100 bg-clip-text text-transparent">
          {title}
        </span>
      </div>

      {/* Right side - Status pill */}
      <div className="inline-flex items-center gap-2 rounded-full border border-[#1A1A1A] bg-[#050505] px-3 py-1 text-[11px] text-gray-400">
        <span className="h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_10px_rgba(56,189,248,0.9)]" />
        <span>Online · JJJ AI</span>
      </div>
    </div>
  );
}

