export default function RefundPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-slate-100">
      <h1 className="text-3xl font-semibold mb-6">Refund &amp; Cancellation Policy</h1>
      <p className="mb-4 text-sm text-slate-300">
        This policy applies to subscriptions purchased for JJJ AI Studio ("Service").
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Subscriptions</h2>
      <p className="text-sm text-slate-300 mb-2">
        JJJ AI Pro is billed on a recurring basis (monthly or yearly). Once a billing
        cycle has started, fees already paid for that cycle are generally non-refundable.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Refunds</h2>
      <p className="text-sm text-slate-300 mb-2">
        If you face any technical issue that prevents you from using the Service
        properly, you can contact us within 3 days of purchase at
        {' '}<a href="mailto:support@jjjai.com" className="text-sky-400">
          support@jjjai.com
        </a>{' '}
        and we will review refund requests on a case-by-case basis.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Cancellation</h2>
      <p className="text-sm text-slate-300 mb-2">
        You can cancel your subscription at any time from your account settings or by
        contacting support. After cancellation, you will continue to have access until
        the end of the current billing period.
      </p>
    </main>
  );
}
