import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#1A1A1A] bg-black/50 backdrop-blur-xl py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          © {new Date().getFullYear()} JJJ AI. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="text-xs text-gray-400 hover:text-sky-400 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-xs text-gray-400 hover:text-sky-400 transition-colors"
          >
            Terms &amp; Conditions
          </Link>
          <Link
            href="/refund"
            className="text-xs text-gray-400 hover:text-sky-400 transition-colors"
          >
            Refund &amp; Cancellation
          </Link>
        </div>
      </div>
    </footer>
  );
}

