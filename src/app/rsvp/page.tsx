import Link from "next/link";
import { createAdminClient } from "@/server/supabaseAdmin";

type Props = { searchParams?: { t?: string; s?: string } };

const VALID = new Set(["yes", "no", "maybe"]);

export default async function RSVP({ searchParams }: Props) {
  const token = (searchParams?.t ?? "").trim();
  const s = (searchParams?.s ?? "").toLowerCase();

  if (!token || !VALID.has(s)) {
    return (
      <Shell>
        <Title>RSVP link error</Title>
        <P>Missing or invalid link. Please tap the RSVP button from your text again.</P>
      </Shell>
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("rsvp_by_token", {
    p_token: token,
    p_status: s,
  });

  if (error) {
    return (
      <Shell>
        <Title>Link invalid or already used</Title>
        <P>That RSVP link isn’t active anymore. If this seems wrong, reply to the text and we’ll resend it.</P>
      </Shell>
    );
  }

  return (
    <Shell>
      <Title>Thanks — RSVP recorded!</Title>
      <P>We marked you as: <b className="capitalize">{s}</b>. See you soon! 🎉</P>
      <Link href="/" className="mt-6 inline-block rounded-xl bg-deep px-5 py-3 text-white">
        Back to The House
      </Link>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen grid place-items-center p-6 bg-sand">
      <div className="w-full max-w-lg bg-white/70 backdrop-blur rounded-2xl shadow-soft p-8 border border-charcoal/10 text-center">
        {children}
      </div>
    </main>
  );
}
function Title({ children }: { children: React.ReactNode }) {
  return <h1 className="font-display text-3xl text-deep mb-3">{children}</h1>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-charcoal">{children}</p>;
}