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

export async function sendInvitesAction(eventId: string) {
  if (cookies().get("thehouse_admin")?.value !== "1") throw new Error("Unauthorized");

  const sb = adminClient();
  const { data: subs, error } = await sb
    .from("subscribers")
    .select("id,name,phone")
    .eq("is_active", true)
    .eq("sms_consent", true);
  if (error) throw error;

  const yesUrl = (t: string) => `${siteUrl()}/rsvp?t=${t}&s=yes`;
  const noUrl  = (t: string) => `${siteUrl()}/rsvp?t=${t}&s=no`;
  const maybeUrl = (t: string) => `${siteUrl()}/rsvp?t=${t}&s=maybe`;

  let sent = 0;
  for (const s of subs ?? []) {
    // upsert RSVP row
    const { data: rsvpRow, error: rerr } = await sb
      .from("rsvps")
      .upsert(
        { subscriber_id: s.id, event_id: eventId, status: "pending" },
        { onConflict: "subscriber_id,event_id" }
      )
      .select("id")
      .single();
    if (rerr) continue;

    // mint fresh token
    const token = crypto.randomBytes(12).toString("hex");
    await sb.from("rsvp_tokens").insert({ rsvp_id: rsvpRow!.id, token, expires_at: new Date(Date.now() + 14*24*3600*1000).toISOString() });

    const first = (s.name || "friend").split(" ")[0];
    const body =
      `Hey ${first}! The House this week — RSVP:\n` +
      `Yes: ${yesUrl(token)}\n` +
      `No: ${noUrl(token)}\n` +
      `Maybe: ${maybeUrl(token)}\n` +
      `Reply STOP to opt out.`;

    if (process.env.SEND_SMS === "true") {
      try {
        await sendSms(s.phone!, body);
        sent++;
      } catch (e) {
        console.error("SMS fail", s.phone, e);
      }
    }
  }
  return { ok: true, sent };
}