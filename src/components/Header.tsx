"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const clicks = useRef<number>(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  // Reset mobile menu on route change (best-effort)
  useEffect(() => {
    const onHash = () => setOpen(false);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const secretTap = () => {
    clicks.current += 1;
    // 3 clicks within 1.5s unlock admin link
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => (clicks.current = 0), 1500);

    if (clicks.current >= 3) {
      clicks.current = 0;
      setShowAdmin(true);
      // Hide again after 8 seconds
      setTimeout(() => setShowAdmin(false), 8000);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-sand/80 backdrop-blur border-b border-charcoal/10 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
      <nav className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button onClick={secretTap} aria-label="Home (triple-click for admin)"
                  className="flex items-center gap-2">
            <Image src="/theHouseLogo2.png" alt="The House" width={32} height={32} className="rounded-full" />
            <span className="font-display text-xl tracking-wide text-deep">THE HOUSE</span>
          </button>
        </div>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-6">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/donate">Donate</NavLink>
          {showAdmin && <NavLink href="/admin">Admin</NavLink>}
        </div>

        {/* Mobile hamburger */}
        <button className="sm:hidden rounded-xl border border-charcoal/20 px-3 py-2"
                onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Menu">
          ☰
        </button>
      </nav>

      {/* Mobile sheet */}
      {open && (
        <div className="sm:hidden border-t border-charcoal/10 bg-sand">
          <div className="mx-auto max-w-5xl px-4 py-3 grid gap-3">
            <MobileLink href="/" onClick={() => setOpen(false)}>Home</MobileLink>
            <MobileLink href="/about" onClick={() => setOpen(false)}>About</MobileLink>
            <MobileLink href="/donate" onClick={() => setOpen(false)}>Donate</MobileLink>
            {showAdmin && <MobileLink href="/admin" onClick={() => setOpen(false)}>Admin</MobileLink>}
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-charcoal/90 hover:text-deep transition underline-offset-4 hover:underline"
    >
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-xl bg-white/70 px-4 py-3 border border-charcoal/10 shadow-soft"
    >
      {children}
    </Link>
  );
}