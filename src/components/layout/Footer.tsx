import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#1A1A1A] bg-black/50 backdrop-blur-xl py-2 sm:py-3 md:py-4 lg:py-6 px-2 sm:px-3 md:px-4 lg:px-6 flex-shrink-0">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
        <span className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-gray-400 text-center sm:text-left">
          © {new Date().getFullYear()} JJJ AI Studio
        </span>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 flex-wrap justify-center">
          <Link
            href="/terms"
            className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-gray-400 hover:text-sky-400 transition-colors whitespace-nowrap"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-gray-400 hover:text-sky-400 transition-colors whitespace-nowrap"
          >
            Privacy
          </Link>
          <Link
            href="/refund"
            className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-gray-400 hover:text-sky-400 transition-colors whitespace-nowrap"
          >
            Refund
          </Link>
        </div>
      </div>
    </footer>
  );
}

