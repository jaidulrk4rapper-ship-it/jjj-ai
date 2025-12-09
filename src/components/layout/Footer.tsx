import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#1A1A1A] bg-black/50 backdrop-blur-xl py-4 sm:py-6 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <span className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
          © {new Date().getFullYear()} JJJ AI Studio. All rights reserved.
        </span>
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
          <Link
            href="/terms"
            className="text-xs sm:text-sm text-gray-400 hover:text-sky-400 transition-colors whitespace-nowrap"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-xs sm:text-sm text-gray-400 hover:text-sky-400 transition-colors whitespace-nowrap"
          >
            Privacy
          </Link>
          <Link
            href="/refund"
            className="text-xs sm:text-sm text-gray-400 hover:text-sky-400 transition-colors whitespace-nowrap"
          >
            Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}

