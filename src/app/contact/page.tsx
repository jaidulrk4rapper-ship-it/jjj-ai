export const metadata = {
  title: "Contact Us - JJJ AI Studio",
  description: "Contact information for JJJ AI Studio.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 text-slate-200 leading-relaxed overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Contact Us</h1>

      <p className="mb-4 text-sm sm:text-base">
        For any support, billing or general queries related to JJJ AI Studio,
        feel free to contact us using the details below.
      </p>

      <h2 className="text-lg sm:text-xl font-semibold mt-6 mb-2">Support Email</h2>
      <p className="mb-4 text-sm sm:text-base">feedback@dailybillkaro.org</p>

      <h2 className="text-lg sm:text-xl font-semibold mt-6 mb-2">Phone / WhatsApp</h2>
      <p className="mb-4 text-sm sm:text-base">+91-6000375343</p>

      <h2 className="text-lg sm:text-xl font-semibold mt-6 mb-2">Location</h2>
      <p className="text-sm sm:text-base">Assam, India</p>
    </main>
  );
}

