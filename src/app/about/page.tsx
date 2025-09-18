import Image from "next/image";
import FadeIn from "@/components/FadeIn";

export const metadata = {
  title: "About • The House",
  description: "Our story and what to expect.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen p-6 bg-sand">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        {/* Hero intro */}
        <FadeIn as="section" className="bg-white/80 backdrop-blur rounded-2xl shadow-soft border border-charcoal/10 overflow-hidden" y={28}>
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
                We’re a weekly Bible study for college athletes hosted by <b>JK &amp; Mandi</b> in Redding.
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
        </FadeIn>

        {/* Story placeholder */}
        <FadeIn as="section" className="bg-white/80 backdrop-blur rounded-2xl shadow-soft border border-charcoal/10 p-8" delay={120} y={28}>
          <h3 className="font-display text-2xl text-deep mb-2">JK &amp; Mandi's story</h3>
          <p className="text-charcoal/90">
            (Coming soon) We’ll share how The House started and what God’s been doing. Check back for a short story
            from Mandi &amp; JK here.
          </p>
        </FadeIn>
      </div>
    </main>
  );
}