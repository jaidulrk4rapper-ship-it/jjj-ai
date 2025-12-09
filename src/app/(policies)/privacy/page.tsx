export const metadata = {
  title: "Privacy Policy - JJJ AI Studio",
  description: "Privacy Policy for JJJ AI Studio.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 text-slate-200 leading-relaxed overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-2 text-sm sm:text-base">Last updated: 9/12/2025</p>

      <p className="mb-4 text-sm sm:text-base">
        This Privacy Policy describes how JJJ AI Studio ("we", "us", "our")
        collects, uses and protects your information when you use our AI tools
        and website.
      </p>

      <h2 className="text-lg sm:text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <p className="mb-2 text-sm sm:text-base">
        <strong>Account details:</strong> name, email address and basic profile
        information.
      </p>
      <p className="mb-2">
        <strong>Usage data:</strong> which tools you use, timestamps and general
        analytics.
      </p>
      <p className="mb-2">
        <strong>Payment data:</strong> payment status and transaction IDs
        processed by Razorpay or other gateways (we do not store full card/UPI
        details).
      </p>
      <p className="mb-4">
        <strong>Content:</strong> prompts and outputs may be temporarily
        processed to run the AI models and improve reliability.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>To create and manage your JJJ AI Studio account.</li>
        <li>To provide AI chat, TTS, STT and image tools.</li>
        <li>To monitor usage, prevent abuse and improve our services.</li>
        <li>To handle billing, invoices and support queries.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Sharing</h2>
      <p className="mb-4">
        We may share data with trusted third-party providers only as needed to
        operate the Service, such as cloud hosting, AI model providers and
        payment gateways such as Razorpay. We do not sell your personal
        information to third parties.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Security &amp; Retention</h2>
      <p className="mb-4">
        We use industry-standard security practices to protect your data, but no
        method of transmission or storage is 100% secure. We retain data only as
        long as necessary for the purposes described in this Policy or as
        required by law.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Rights</h2>
      <p className="mb-4">
        You may request access, correction or deletion of your personal data by
        contacting us. You can also cancel your subscription at any time from
        your account or by emailing support.
      </p>

      <h2 className="text-lg sm:text-xl font-semibold mt-6 mb-2">6. Contact</h2>
      <p className="text-sm sm:text-base">
        Email: feedback@dailybillkaro.org
        <br />
        Location: Assam, India
      </p>
    </main>
  );
}
