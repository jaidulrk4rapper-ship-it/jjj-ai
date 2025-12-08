'use client';

export default function TopBar({ title = 'JJJ AI Studio' }: { title?: string }) {
  return (
    <div className="h-14 border-b border-white/5 bg-[#050816] flex items-center justify-between px-6">
      <div className="text-lg font-medium text-gray-100">{title}</div>
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 text-sm font-medium text-gray-300 border border-white/10 rounded-md hover:bg-white/5 transition-colors">
          Save
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-md hover:from-blue-600 hover:to-blue-700 transition-colors">
          Run
        </button>
      </div>
    </div>
  );
}

