export default function RefundPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">Refund & Cancellation Policy</h1>

      <h2 className="text-xl font-semibold mt-6">1. Digital Service</h2>
      <p>
        JJJ AI Premium is a digital subscription providing instant access to AI tools.
        Since the service is delivered instantly, refunds are generally not provided.
      </p>

      <h2 className="text-xl font-semibold mt-6">2. Cancellation</h2>
      <p>
        Users may cancel their subscription anytime. Access will continue until the end of the billing period.
      </p>

      <h2 className="text-xl font-semibold mt-6">3. Refund Exceptions</h2>
      <p>
        Refund may be granted only in rare cases such as:
        <br />- Duplicate payment
        <br />- Failed payment but amount debited
      </p>

      <h2 className="text-xl font-semibold mt-6">4. Contact</h2>
      <p>
        For refund queries, email: support@jjjai.com
      </p>
    </div>
  );
}
