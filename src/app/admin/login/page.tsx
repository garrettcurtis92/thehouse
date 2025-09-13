"use client";

import { useState, FormEvent } from "react";

export default function AdminLogin() {
  const [msg, setMsg] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") || "");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) window.location.href = "/admin";
    else setMsg("Incorrect password.");
  };

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-sand">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white/70 rounded-2xl shadow-soft p-6 border border-charcoal/10">
        <h1 className="font-display text-3xl text-deep mb-4 text-center">Admin Login</h1>
        <input name="password" type="password" placeholder="Admin password"
          className="w-full rounded-xl border border-charcoal/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-deep" />
        <button className="mt-4 w-full rounded-xl bg-deep px-5 py-3 text-white">Enter</button>
        {msg && <p className="mt-3 text-sm text-red-700">{msg}</p>}
      </form>
    </main>
  );
}