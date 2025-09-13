import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-charcoal/10 bg-sand">
      <div className="mx-auto max-w-5xl px-4 py-8 grid gap-6 md:grid-cols-3 items-center">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/theHouseLogo.png" alt="The House" width={32} height={32} className="rounded-full" />
          <span className="font-display text-xl text-deep">THE HOUSE</span>
        </Link>

        {/* Nav */}
        <nav className="flex justify-center gap-6 text-sm">
          <Link className="hover:underline" href="/">Home</Link>
          <Link className="hover:underline" href="/about">About</Link>
          <Link className="hover:underline" href="/donate">Donate</Link>
        </nav>

        {/* Legal / note */}
        <div className="text-right text-xs text-charcoal/70">
          <p>© {year} The House · Redding, CA</p>
          <p>SMS consent honored. Reply <b>STOP</b> to opt out.</p>
        </div>
      </div>
    </footer>
  );
}