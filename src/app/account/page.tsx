import UpgradeToProButton from "@/components/UpgradeToProButton";

export default function AccountPage() {
  // TODO: real user data from auth
  const userId = "demo-sera";
  const email = "sera@dock.ai";
  const plan = "free" as "free" | "pro";

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Account</h1>
          <p className="text-sm text-gray-400">
            Manage your JJJ AI plan and billing.
          </p>
        </div>
        <div className="rounded-full border border-[#1A1A1A] bg-black/80 px-3 py-1 text-xs text-gray-300">
          Plan:{" "}
          <span
            className={`ml-1 rounded-full px-2 py-0.5 text-[10px] ${
              plan === "pro"
                ? "bg-emerald-500 text-black"
                : "bg-gray-700 text-gray-100"
            }`}
          >
            {plan === "pro" ? "JJJ AI Pro" : "JJJ AI Free"}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Free card */}
        <div className="rounded-2xl border border-[#1A1A1A] bg-[#050505] p-5 text-sm text-gray-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Free
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            JJJ AI Free
          </h2>
          <p className="mt-2 text-xs text-gray-400">
            Perfect to try JJJ AI tools:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-gray-300">
            <li>30 AI Chat messages / day</li>
            <li>5 AI Voice clips / day</li>
            <li>5 AI Images / day (future)</li>
          </ul>
          <p className="mt-4 text-xl font-semibold text-white">₹0</p>
        </div>

        {/* Pro card */}
        <div className="rounded-2xl border border-emerald-500/60 bg-[#020617] p-5 text-sm text-gray-200 shadow-[0_0_40px_rgba(16,185,129,0.25)]">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
            Recommended
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            JJJ AI Pro
          </h2>
          <p className="mt-2 text-xs text-gray-400">
            For serious creators, business owners, and power users:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-gray-300">
            <li>1,000+ AI Chat messages / month</li>
            <li>Up to ~300 min AI Voice / month</li>
            <li>High limits on images & tools</li>
            <li>Priority access to new JJJ AI features</li>
          </ul>

          <p className="mt-4 text-2xl font-semibold text-white">
            ₹399
            <span className="text-xs text-gray-400"> / month</span>
          </p>

          <div className="mt-4">
            <UpgradeToProButton userId={userId} userEmail={email} />
          </div>
        </div>
      </div>
    </div>
  );
}

