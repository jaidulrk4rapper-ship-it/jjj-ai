import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 mt-12 py-6 text-sm text-slate-400 w-full overflow-x-hidden">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
        <span className="text-xs sm:text-sm">© {new Date().getFullYear()} JJJ AI Studio</span>
        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
          <a href="/contact" className="hover:underline whitespace-nowrap">
            Contact Us
          </a>
          <a href="/terms" className="hover:underline whitespace-nowrap">
            Terms &amp; Conditions
          </a>
          <a href="/privacy" className="hover:underline whitespace-nowrap">
            Privacy Policy
          </a>
          <a href="/refund" className="hover:underline whitespace-nowrap">
            Refund &amp; Cancellation Policy
          </a>
        </div>
      </div>
    </footer>
  );
}

