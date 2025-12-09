export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-slate-100">
      <h1 className="text-3xl font-semibold mb-6">Terms &amp; Conditions</h1>
      <p className="mb-4 text-sm text-slate-300">
        JJJ AI Studio ("we", "us", "our") is an online AI tools platform operated by
        Jahidul Islam Sk. By accessing or using JJJ AI Studio, you agree to these Terms
        and our Privacy Policy.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Use of Service</h2>
      <p className="text-sm text-slate-300 mb-2">
        You agree to use the platform only for lawful purposes. You are responsible for
        the content you generate using AI tools on this website.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Accounts &amp; Billing</h2>
      <p className="text-sm text-slate-300 mb-2">
        Paid plans such as JJJ AI Pro are billed in advance on a recurring basis
        (monthly or yearly, depending on the plan selected). Access to premium tools is
        provided only while an active subscription is in place.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Prohibited Use</h2>
      <p className="text-sm text-slate-300 mb-2">
        You must not use JJJ AI Studio to generate illegal, harmful, hateful or abusive
        content, or to violate any applicable law or regulation.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
      <p className="text-sm text-slate-300">
        For any questions about these Terms, please contact us at
        {' '}<a href="mailto:support@jjjai.com" className="text-sky-400">
          support@jjjai.com
        </a>.
      </p>
    </main>
  );
}
