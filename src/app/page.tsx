"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { normalizeUSPhone } from "@/lib/phone";

export default function Home() {
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const phoneRaw = String(fd.get("phone") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const smsConsent = fd.get("smsConsent") === "on";
    const emailConsent = fd.get("emailConsent") === "on";
    const phone = normalizeUSPhone(phoneRaw);
    try {
      const { error } = await supabase.from("subscribers").insert([{
        name, phone, email: email || null, sms_consent: smsConsent, email_consent: emailConsent,
      }]);
      if (error) {
        if (String(error.message).toLowerCase().includes("duplicate key")) {
          setStatus({ ok: true, msg: "You’re already on the list—thanks!" });
        } else throw error;
      } else {
        setStatus({ ok: true, msg: "Thanks! You’re on the list. Watch for texts." });
        (e.target as HTMLFormElement).reset();
      }
    } catch (err: any) {
      console.error(err);
      setStatus({ ok: false, msg: "Hmm, that didn’t go through. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById("signup");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
  <main className="min-h-screen">
      {/* Background with mobile parallax simulation. On desktop it stays fixed visually. */}
      <div
        id="hero-bg"
        aria-hidden
        className="fixed inset-0 -z-10 bg-[center_55%] bg-cover bg-no-repeat pointer-events-none will-change-transform"
        style={{ backgroundImage: "url('/thehousehero2.png')" }}
      />

  {/* HERO */}
  <section className="hero-noise relative min-h-screen flex items-start sm:items-center justify-center overflow-hidden pt-24 sm:pt-0">
    {/* Removed dark gradient to let photo show through */}

        {/* Hero content card */}
        <div className="relative z-10 w-full max-w-2xl sm:max-w-3xl px-4 sm:px-6 translate-y-2 sm:translate-y-0">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft border border-white/30 p-6 sm:p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image src="/theHouseLogo.png" alt="The House" width={56} height={56} className="rounded-full" />
              <h1 className="font-display text-4xl sm:text-5xl text-deep tracking-wide">THE HOUSE</h1>
            </div>
            <p className="text-charcoal/90 text-lg sm:text-xl">
              College athletes gathering weekly to study the Bible at The House in Redding.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={scrollToForm}
                className="rounded-xl bg-deep text-white px-6 py-3 font-medium hover:opacity-90 transition"
              >
                Get updates & RSVP by text
              </button>
              <a
                href="/about"
                className="rounded-xl border border-charcoal/20 bg-white px-6 py-3 font-medium hover:bg-white/90 transition"
              >
                What to expect
              </a>
            </div>

            <div className="mt-4 text-xs text-charcoal/70">
              We’ll text about once a week. Reply <b>STOP</b> to opt out.
            </div>
          </div>
        </div>
      </section>

      {/* Content Wrapper after hero with sand background and subtle top fade */}
      <div className="relative bg-sand">
        <div className="pointer-events-none absolute -top-24 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-sand" />
      {/* SIGNUP CARD */}
      <section id="signup" className="py-16 px-6">
        <div className="mx-auto w-full max-w-xl bg-white/90 backdrop-blur rounded-2xl shadow-soft p-8 border border-charcoal/10">
          <h2 className="font-display text-3xl text-deep text-center mb-2">Sign up</h2>
          <p className="text-center text-charcoal/80 mb-6">Get weekly invites & one-tap RSVPs.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text" name="name" placeholder="Your name" required
              className="w-full rounded-xl border border-charcoal/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-deep"
            />
            <input
              type="tel" name="phone" placeholder="Phone number" required
              className="w-full rounded-xl border border-charcoal/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-deep"
            />
            <input
              type="email" name="email" placeholder="Email address (optional)"
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
              disabled={loading}
              className="w-full rounded-xl bg-deep px-5 py-3 text-white font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Sign me up"}
            </button>
          </form>

          {status && (
            <div
              className={`mt-4 text-sm rounded-xl px-4 py-3 ${
                status.ok ? "bg-gold/20 text-charcoal" : "bg-red-50 text-red-700"
              }`}
            >
              {status.msg}
            </div>
          )}
        </div>
  </section>
  </div>
    </main>
  );
}

// Parallax effect: directly manipulate DOM after component definition to avoid re-rendering.
// We place it here so it runs client-side only (file is already "use client").
if (typeof window !== "undefined") {
  // Singleton setup guard
  if (!(window as any).__heroParallaxSetup) {
    (window as any).__heroParallaxSetup = true;
    const setup = () => {
      if (window.innerWidth >= 640) return; // mobile only
      const el = document.getElementById("hero-bg");
      if (!el) return;
      let ticking = false;
  const maxShift = 260; // increased limit to reveal more of the photo
      const onScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const y = window.scrollY;
            // Move image slightly slower (parallax). Negative to reveal lower portion gradually.
            const translate = Math.max(-y * 0.35, -maxShift);
            el.style.transform = `translateY(${translate}px)`;
            ticking = false;
          });
          ticking = true;
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    };
    if (document.readyState === "complete" || document.readyState === "interactive") setup();
    else window.addEventListener("DOMContentLoaded", setup);
  }
}