const donateUrl = process.env.NEXT_PUBLIC_DONATE_URL || "#";
import FadeIn from "@/components/FadeIn";

export const metadata = {
  title: "Donate • The House",
  description: "Support The House through Pathway Church’s giving page.",
};

export default function DonatePage() {
  return (
    <main className="min-h-screen grid place-items-center p-6 bg-sand">
      <FadeIn className="w-full max-w-2xl" as="div" y={24}>
      <div className="bg-white/90 backdrop-blur rounded-2xl shadow-soft p-8 border border-charcoal/10 text-center">
        <h1 className="font-display text-4xl text-deep mb-2">Donate</h1>
        <p className="text-charcoal/90">
          Giving is processed securely by <b>Pathway Church</b>. On the next page, please choose
          <b> “JK & Mandi Kelly (The House/Shasta College)”</b> from the fund list so your gift is directed to our college athletes ministry.
        </p>

        <a
          href={donateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-xl bg-deep px-6 py-3 text-white font-medium hover:opacity-90 transition"
        >
          Give through Pathway Church
        </a>

        <div className="mt-6 text-left text-sm bg-sand rounded-xl p-4 border border-charcoal/10">
          <h2 className="font-display text-xl text-deep mb-1">Before you give</h2>
          <ul className="list-disc ml-5 space-y-1 text-charcoal/90">
            <li>Choose the fund labeled <b>The House</b>.</li>
            <li>One-time or recurring gifts are available on Pathway’s page.</li>
            <li>Receipts and tax documentation come directly from Pathway Church.</li>
          </ul>
        </div>

        <p className="mt-4 text-xs text-charcoal/70">
          Questions? Reach out to Mandi &amp; Jason at our weekly gathering. Thank you for supporting student-athletes!
        </p>
      </div>
      </FadeIn>
    </main>
  );
}