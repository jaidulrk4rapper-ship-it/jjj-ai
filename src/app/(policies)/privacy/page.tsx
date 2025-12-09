export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-slate-100">
      <h1 className="text-3xl font-semibold mb-6">Privacy Policy</h1>
      <p className="mb-4 text-sm text-slate-300">
        This Privacy Policy explains how JJJ AI Studio ("we", "us", "our") collects,
        uses and protects your personal information.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
      <p className="text-sm text-slate-300 mb-2">
        We may collect your name, email address, usage statistics and payment details
        (processed securely by our payment partners such as Razorpay). We do not store
        full card or UPI details on our servers.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Data</h2>
      <p className="text-sm text-slate-300 mb-2">
        Your data is used to create and manage your account, provide AI tools,
        personalize your experience, prevent abuse, and comply with legal obligations.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Data Security</h2>
      <p className="text-sm text-slate-300 mb-2">
        We use industry-standard security practices and trusted third-party providers
        (such as cloud hosting and payment gateways) to protect your data.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
      <p className="text-sm text-slate-300">
        For any privacy-related questions, please email us at
        {' '}<a href="mailto:support@jjjai.com" className="text-sky-400">
          support@jjjai.com
        </a>.
      </p>
    </main>
  );
}
