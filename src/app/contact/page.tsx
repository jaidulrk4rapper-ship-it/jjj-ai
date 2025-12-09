export const metadata = {
  title: "Contact Us - JJJ AI Studio",
  description: "Contact information for JJJ AI Studio.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-3 py-3 md:px-4 md:py-8 text-slate-200 leading-relaxed overflow-x-hidden">
      <div className="max-w-sm mx-auto w-full md:max-w-none">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">Contact Us</h1>

        <p className="mb-3 md:mb-4 text-sm">
          For any support, billing or general queries related to JJJ AI Studio,
          feel free to contact us using the details below.
        </p>

        <h2 className="text-base md:text-lg lg:text-xl font-semibold mt-4 md:mt-6 mb-2">Support Email</h2>
        <p className="mb-3 md:mb-4 text-sm">feedback@dailybillkaro.org</p>

        <h2 className="text-base md:text-lg lg:text-xl font-semibold mt-4 md:mt-6 mb-2">Phone / WhatsApp</h2>
        <p className="mb-3 md:mb-4 text-sm">+91-6000375343</p>

        <h2 className="text-base md:text-lg lg:text-xl font-semibold mt-4 md:mt-6 mb-2">Location</h2>
        <p className="text-sm">Assam, India</p>
      </div>
    </main>
  );
}

