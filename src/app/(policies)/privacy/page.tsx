export default function PrivacyPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p>
        JJJ AI respects your privacy. This policy explains how we collect, use, and protect your data.
      </p>

      <h2 className="text-xl font-semibold mt-6">1. Information We Collect</h2>
      <ul className="list-disc ml-6">
        <li>Name, email, phone (for account login)</li>
        <li>AI usage data (for service improvement)</li>
        <li>Payment info (via Razorpay — we never store card details)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">2. How We Use Your Data</h2>
      <ul className="list-disc ml-6">
        <li>Provide AI services</li>
        <li>Improve accuracy & performance</li>
        <li>Subscription management</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">3. Data Sharing</h2>
      <p>
        We do not sell your data. We only share data with:
        <br />- Razorpay (payments)
        <br />- Authentication provider
        <br />- Cloud hosting services
      </p>

      <h2 className="text-xl font-semibold mt-6">4. Cookies</h2>
      <p>We use cookies for login and analytics.</p>

      <h2 className="text-xl font-semibold mt-6">5. Account Deletion</h2>
      <p>Users may request account deletion via support@jjjai.com.</p>

      <p className="mt-8">For questions, contact: support@jjjai.com</p>
    </div>
  );
}
