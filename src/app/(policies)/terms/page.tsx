// app/terms/page.tsx

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-sky-400">
          Legal
        </p>
        <h1 className="text-3xl font-semibold leading-tight text-slate-50">
          Terms &amp; Conditions
        </h1>
        <p className="mt-2 text-xs text-slate-400">
          Last updated: {new Date().toLocaleDateString("en-IN")}
        </p>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-200">
          <p>
            JJJ AI Studio ("<span className="font-semibold">we</span>",
            "<span className="font-semibold">us</span>", "
            <span className="font-semibold">our</span>") is an online AI tools
            platform operated by Jahidul Islam Sk. By accessing or using JJJ AI
            Studio, you ("<span className="font-semibold">you</span>", "
            <span className="font-semibold">user</span>") agree to be bound by
            these Terms and our Privacy Policy.
          </p>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-50">
              1. Use of Service
            </h2>
            <p>
              You may use the platform only for lawful purposes. You are
              responsible for the prompts and content you generate using
              our AI tools. You agree not to use the Service to generate illegal,
              harmful, abusive or hateful content or to violate any applicable
              law or regulation.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-50">
              2. Accounts &amp; Subscriptions
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account and for all activities under your login. Paid plans such
              as <span className="font-semibold">JJJ AI Pro</span> are billed in
              advance on a recurring basis (monthly or yearly, depending on your
              chosen plan). Access to premium tools is available only while an
              active subscription is in place.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-50">
              3. Payments
            </h2>
            <p>
              All payments are processed securely via trusted payment gateways
              such as Razorpay. We do not store your full card or UPI details on
              our servers. Pricing and plan details shown on the website may be
              updated from time to time.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-50">
              4. Intellectual Property
            </h2>
            <p>
              The JJJ AI Studio name, branding, UI, and underlying software are
              our intellectual property. You may not copy, resell or reverse
              engineer the platform. You retain rights to your own input and
              generated content, subject to any applicable model/provider terms.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-50">
              5. Suspension &amp; Termination
            </h2>
            <p>
              We may suspend or terminate access to the Service at any time in
              case of misuse, suspected fraud, non-payment or violation of these
              Terms. In such cases, remaining access for the current billing
              period may be withdrawn at our discretion.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-50">
              6. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. The latest version
              will always be available on this page. Continued use of the
              Service after changes means you accept the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-50">
              7. Contact
            </h2>
            <p>
              For any questions regarding these Terms &amp; Conditions, please
              contact:
            </p>
            <ul className="mt-1 text-sm text-slate-200">
              <li>JJJ AI Studio – Daily Bill Karo Team</li>
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
