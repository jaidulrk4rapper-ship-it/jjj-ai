"use client";

export function ChatSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex gap-3">
        <div className="h-8 w-8 rounded-full bg-slate-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-800 rounded w-3/4" />
          <div className="h-4 bg-slate-800 rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-sky-900/50 rounded w-3/4 ml-auto" />
          <div className="h-4 bg-sky-900/50 rounded w-1/2 ml-auto" />
        </div>
        <div className="h-8 w-8 rounded-full bg-sky-900/50" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#1a1a1a] bg-[#020617] p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-slate-800 rounded w-1/3" />
        <div className="h-4 bg-slate-800 rounded w-full" />
        <div className="h-4 bg-slate-800 rounded w-5/6" />
        <div className="h-10 bg-slate-800 rounded w-1/2" />
      </div>
    </div>
  );
}

export function ImageSkeleton() {
  return (
    <div className="rounded-xl bg-slate-900/50 animate-pulse aspect-square flex items-center justify-center">
      <div className="h-12 w-12 rounded-full bg-slate-800" />
    </div>
  );
}

export function ButtonSkeleton() {
  return (
    <div className="h-10 bg-slate-800 rounded-lg w-32 animate-pulse" />
  );
}

