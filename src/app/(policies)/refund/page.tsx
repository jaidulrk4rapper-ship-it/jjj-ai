// app/refund/page.tsx

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-sky-400">
          Legal
        </p>
        <h1 className="text-3xl font-semibold leading-tight text-slate-50">
          Refund &amp; Cancellation Policy
        </h1>
        <p className="mt-2 text-xs text-slate-400">
          Last updated: {new Date().toLocaleDateString("en-IN")}
        </p>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-200">
          <p>
            This Refund &amp; Cancellation Policy applies to subscriptions
            purchased for JJJ AI Studio ("Service").
          </p>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-50">
              1. Subscription Billing
            </h2>
            <p>
              JJJ AI Pro and other paid plans are billed in advance on a
              recurring basis (monthly, yearly or as otherwise specified on the
              pricing page). Your subscription will automatically renew until
              cancelled.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-50">
              2. Refunds
            </h2>
            <p>
              Fees already paid for an active billing period are generally
              non-refundable. However, if you experience a critical technical
              issue that prevents you from using the Service as advertised, you
              may contact us within <span className="font-semibold">3 days</span>{" "}
              of purchase and we will review your request on a case-by-case
              basis.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-50">
              3. Cancellations
            </h2>
            <p>
              You can cancel your subscription at any time from your account
              settings or by contacting support. After cancellation, you will
              continue to have access to Pro features until the end of the
              current billing period. No further automatic charges will be made
              after that period.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-50">
              4. Trial &amp; Promotional Offers
            </h2>
            <p>
              If we offer free trials or promotional pricing, the specific terms
              for those offers will be mentioned on the website. After the trial
              ends, regular plan charges will apply unless you cancel before the
              renewal date.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-50">
              5. Contact for Billing Support
            </h2>
            <p>
              For any billing, refund or cancellation queries, please contact:
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
              <li>WhatsApp / Phone (optional): +91- 6000375343</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
