// app/privacy/page.tsx

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-sky-400">
          Legal
        </p>
        <h1 className="text-3xl font-semibold leading-tight text-slate-50">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs text-slate-400">
          Last updated: {new Date().toLocaleDateString("en-IN")}
        </p>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-200">
          <p>
            This Privacy Policy describes how JJJ AI Studio ("we", "us", "our")
            collects, uses and protects your information when you use our AI
            tools and website.
          </p>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-50">
              1. Information We Collect
            </h2>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              <li>
                <span className="font-semibold">Account details:</span> name,
                email address and basic profile information.
              </li>
              <li>
                <span className="font-semibold">Usage data:</span> which tools
                you use, timestamps and general analytics.
              </li>
              <li>
                <span className="font-semibold">Payment data:</span> payment
                status and transaction IDs processed by Razorpay or other
                gateways (we do not store full card/UPI details).
              </li>
              <li>
                <span className="font-semibold">Content:</span> prompts and
                outputs may be temporarily processed to run the AI models and
                improve reliability.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-50">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              <li>To create and manage your JJJ AI Studio account.</li>
              <li>To provide AI chat, TTS, STT and image tools.</li>
              <li>To monitor usage, prevent abuse and improve our services.</li>
              <li>To handle billing, invoices and support queries.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-50">
              3. Data Sharing
            </h2>
            <p>
              We may share data with trusted third-party providers only as
              needed to operate the Service, such as:
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
              <li>Cloud hosting and database providers.</li>
              <li>AI model providers (for processing your prompts securely).</li>
              <li>Payment gateways such as Razorpay for subscription billing.</li>
            </ul>
            <p className="mt-2">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-50">
              4. Data Security &amp; Retention
            </h2>
            <p>
              We use industry-standard security practices to protect your data.
              However, no method of transmission or storage is 100% secure.
              We retain data only as long as necessary for the purposes described
              in this Policy or as required by law.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-50">
              5. Your Rights
            </h2>
            <p>
              You may request access, correction or deletion of your personal
              data by contacting us. You can also cancel your subscription at
              any time from your account or by emailing support.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-50">
              6. Contact
            </h2>
            <p>
              For any privacy-related questions or requests, please contact:
            </p>
            <ul className="mt-1 text-sm text-slate-200">
              <li>Email:{" "}
                <a
                  href="mailto:feedback@dailybillkaro.org"
                  className="text-sky-400 underline-offset-2 hover:underline"
                >
                  feedback@dailybillkaro.org
                </a>
              </li>
              <li>Location: Assam, India</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
