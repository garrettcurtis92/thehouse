"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { sendSmsUniversal as sendSms } from "@/server/sms"; // from Step 5
import crypto from "node:crypto";

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

function siteUrl() {
  return process.env.SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

// Debug helpers (no secrets in logs)
const DEBUG = process.env.DEBUG_SMS === "true" || process.env.NODE_ENV !== "production";
const dlog = (...args: any[]) => { if (DEBUG) console.log("[sms]", ...args); };
const maskPhone = (p?: string | null) => (p ? String(p).replace(/\d(?=\d{4})/g, "•") : "");
const normalizePhone = (p?: string | null) => {
  if (!p) return "";
  const s = String(p).replace(/[^\d+]/g, "");
  if (/^\d{10}$/.test(s)) return `+1${s}`;
  if (/^\+1\d{10}$/.test(s)) return s;
  return s.startsWith("+") ? s : `+${s}`;
};

// Remove URLs from a message
function stripUrls(input: string) {
  return input.replace(/https?:\/\/\S+/gi, "").replace(/\s{2,}/g, " ").trim();
}

export async function createEventAction(formData: FormData) {
  // optional: simple gate check
  if (cookies().get("thehouse_admin")?.value !== "1") throw new Error("Unauthorized");

  const title = String(formData.get("title") || "").trim();
  const startsAt = String(formData.get("starts_at") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  const sb = adminClient();
  const { data, error } = await sb.from("events").insert([{ title, starts_at: startsAt, location, notes }]).select("id");
  if (error) throw error;
  return { ok: true, id: data![0].id as string };
}

export async function statsAction() {
  const sb = adminClient();
  const [{ count: subs }, { count: active }] = await Promise.all([
    sb.from("subscribers").select("*", { count: "exact", head: true }),
    sb.from("subscribers").select("*", { count: "exact", head: true }).eq("is_active", true).eq("sms_consent", true),
  ]);
  const { data: nextEvent } = await sb
    .from("events")
    .select("id,title,starts_at")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  return { subs: subs ?? 0, active: active ?? 0, nextEvent };
}

export async function previewInvitesAction(eventId: string) {
  const sb = adminClient();
  const { data: subs, error } = await sb
    .from("subscribers")
    .select("id,name,phone")
    .eq("is_active", true)
    .eq("sms_consent", true)
    .order("created_at", { ascending: true })
    .limit(5);
  if (error) throw error;

  const yesUrl = (token: string) => `${siteUrl()}/rsvp?t=${token}&s=yes`;
  const noUrl  = (token: string) => `${siteUrl()}/rsvp?t=${token}&s=no`;

  // fake tokens for preview only
  const messages = (subs ?? []).map((s) => {
    const token = crypto.randomBytes(6).toString("hex");
    const first = (s.name || "friend").split(" ")[0];
    const body =
      `Hey ${first}! The House this week — can you make it? ` +
      `Yes: ${yesUrl(token)}  No: ${noUrl(token)}  Reply STOP to opt out.`;
    return { to: s.phone, body };
  });
  return { sample: messages, count: messages.length };
}

export async function sendInvitesAction(formData: FormData) {
  if (cookies().get("thehouse_admin")?.value !== "1") throw new Error("Unauthorized");

  const eventId = String(formData.get("eventId") || "").trim();
  if (!eventId) throw new Error("Missing eventId");

  const sendToMeOnly = formData.get("sendToMeOnly") === "on";
  const me = normalizePhone(process.env.ADMIN_TEST_NUMBER || "+12089270022");
  const provider = process.env.USE_TEXTBELT === "true" ? "textbelt" : "twilio";
  const allowSend = process.env.SEND_SMS === "true";
  dlog("start", { sendToMeOnly, me: maskPhone(me), allowSend, provider });

  const sb = adminClient();
  const { data: subs, error } = await sb
    .from("subscribers")
    .select("id,name,phone")
    .eq("is_active", true)
    .eq("sms_consent", true)
    .not("phone", "is", null);
  if (error) throw error;

  const base = (subs ?? []).map((s) => ({ ...s, phone: normalizePhone(s.phone as any) }));
  let audience = sendToMeOnly ? base.filter((s) => s.phone === me) : base;
  if (sendToMeOnly && audience.length === 0 && me) {
    dlog("no matching subscriber for ADMIN_TEST_NUMBER; falling back to direct");
    audience = [{ id: -1, name: "Admin", phone: me } as any];
  }
  dlog("audience", { eligible: base.length, target: audience.length, sample: audience.slice(0, 3).map((s) => maskPhone(s.phone)) });

  const yesUrl = (t: string) => `${siteUrl()}/rsvp?t=${t}&s=yes`;
  const noUrl  = (t: string) => `${siteUrl()}/rsvp?t=${t}&s=no`;
  const maybeUrl = (t: string) => `${siteUrl()}/rsvp?t=${t}&s=maybe`;

  if (!allowSend) {
    dlog("SEND_SMS=false; dry-run. Would send to:", audience.map((s) => maskPhone(s.phone)));
    return { ok: true, sent: 0, audience: audience.length, dryRun: true };
  }

  let sent = 0;
  for (const s of audience) {
    // If this is the testing fallback (no subscriber row), skip RSVP DB writes and send a simple test message
    if ((s as any).id === -1) {
      const bodyTest = `Hey! The House is this Friday at 7:30 — are you coming? Reply YES or NO. Reply STOP to opt out.`;
      try {
        await sendSms(s.phone!, bodyTest);
        sent++;
        dlog("sent-test", { to: maskPhone(s.phone) });
      } catch (e: any) {
        dlog("send error (test)", { to: maskPhone(s.phone), error: e?.message });
      }
      continue;
    }

    const { data: rsvpRow, error: rerr } = await sb
      .from("rsvps")
      .upsert(
        { subscriber_id: s.id, event_id: eventId, status: "pending" },
        { onConflict: "subscriber_id,event_id" }
      )
      .select("id")
      .single();
    if (rerr) {
      dlog("rsvp upsert error", { to: maskPhone(s.phone), error: String(rerr?.message || rerr) });
      continue;
    }

    const token = crypto.randomBytes(12).toString("hex");
    try {
      await sb
        .from("rsvp_tokens")
        .insert({ rsvp_id: rsvpRow!.id, token, expires_at: new Date(Date.now() + 14*24*3600*1000).toISOString() });
    } catch (tokErr: any) {
      dlog("token insert error", { to: maskPhone(s.phone), error: String(tokErr?.message || tokErr) });
      continue;
    }

    const first = (s.name || "friend").split(" ")[0];
    const bodyWithLinks =
      `Hey ${first}! The House this week — RSVP:\n` +
      `Yes: ${yesUrl(token)}\n` +
      `No: ${noUrl(token)}\n` +
      `Maybe: ${maybeUrl(token)}\n` +
      `Reply STOP to opt out.`;

    const providerIsTextbelt = provider === "textbelt";
    const allowLinks = providerIsTextbelt ? process.env.SMS_ALLOW_LINKS === "true" : true;
    const body = allowLinks
      ? bodyWithLinks
      : `Hey ${first}! The House this week — are you coming? Reply YES, NO, or MAYBE. Reply STOP to opt out.`;

    try {
      await sendSms(s.phone!, body);
      sent++;
      dlog("sent", { to: maskPhone(s.phone) });
    } catch (e: any) {
      dlog("send error", { to: maskPhone(s.phone), error: e?.message });
    }
  }
  dlog("done", { sent, provider });
  return { ok: true, sent, audience: sendToMeOnly ? "me" : "all", provider };
}