"use client";

import Image from "next/image";
import { FormEvent } from "react";

export default function Home() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Form submitted:", data);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-sand">
      <div className="w-full max-w-lg bg-white/70 backdrop-blur rounded-2xl shadow-soft p-8 border border-charcoal/10">
        {/* Logo + Title */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Image
            src="/theHouseLogo.png"
            alt="The House logo"
            width={56}
            height={56}
            priority
          />
          <h1 className="font-display text-4xl text-deep">THE HOUSE</h1>
        </div>

        {/* Tagline */}
        <p className="text-center text-lg text-charcoal mb-6">
          Join us weekly at The House in Redding.
        </p>

        {/* Signup form */}
        <form onSubmit={handleSubmit} className="space-y-4" id="signup">
          <input
            type="text"
            name="name"
            placeholder="Your name"
            required
            className="w-full rounded-xl border border-charcoal/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-deep"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            required
            className="w-full rounded-xl border border-charcoal/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-deep"
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="w-full rounded-xl border border-charcoal/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-deep"
          />

          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" name="smsConsent" required className="mt-1" />
            I consent to receive SMS updates (reply STOP to unsubscribe).
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" name="emailConsent" className="mt-1" />
            I consent to receive occasional email updates.
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-deep px-5 py-3 text-white font-medium hover:opacity-90 transition"
          >
            Sign me up
          </button>
        </form>
      </div>
    </main>
  );
}