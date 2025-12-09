import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 mt-12 py-6 text-sm text-slate-400">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
        <span>© {new Date().getFullYear()} JJJ AI Studio</span>
        <div className="flex gap-4">
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
  );
}

