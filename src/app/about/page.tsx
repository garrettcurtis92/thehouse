import Image from "next/image";

export const metadata = {
  title: "About • The House",
  description: "Our story and what to expect.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen p-6 bg-sand">
      <div className="mx-auto w-full max-w-5xl">
        {/* Hero intro */}
        <section className="bg-white/80 backdrop-blur rounded-2xl shadow-soft border border-charcoal/10 overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="relative h-56 md:h-full">
              <Image
  src="/Mandi-Jason.jpg"
  alt="Mandi & Jason Kelly"
  fill
  className="object-cover object-top"   // or object-center / object-bottom
/>
            </div>
            <div className="p-8">
              <h1 className="font-display text-4xl text-deep mb-3">About The House</h1>
              <p className="text-charcoal/90">
                We’re a weekly Bible study for college athletes hosted by <b>Mandi &amp; JK</b> in Redding.
                We keep it simple: Scripture, community, and real conversation around the table.
              </p>

              {/* Pull quote */}
              <blockquote className="mt-6 border-l-4 border-gold pl-4 text-charcoal/90 italic">
                “Our heart is to make space for athletes to encounter Jesus and one another—without the hype.”
              </blockquote>

              {/* What to expect */}
              <div className="mt-6">
                <h2 className="font-display text-2xl text-deep mb-2">What to expect</h2>
                <ul className="list-disc ml-5 space-y-1 text-charcoal/90">
                  <li>Warm welcome & a quick bite</li>
                  <li>Short Bible reading + discussion</li>
                  <li>Prayer & real conversation</li>
                  <li>Done on time for busy schedules</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Story placeholder */}
        <section className="mt-8 bg-white/80 backdrop-blur rounded-2xl shadow-soft border border-charcoal/10 p-8">
          <h3 className="font-display text-2xl text-deep mb-2">Mandi &amp; Jason’s story</h3>
          <p className="text-charcoal/90">
            (Coming soon) We’ll share how The House started and what God’s been doing. Check back for a short story
            from Mandi &amp; Jason here.
          </p>
        </section>
      </div>
    </main>
  );
}