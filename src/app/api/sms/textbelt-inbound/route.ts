import { NextRequest, NextResponse } from "next/server";

// Example body:
// { "fromNumber": "+15551234567", "text": "YES" }
export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => null);
  if (!data?.fromNumber || typeof data.text !== "string") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const phone = data.fromNumber;
  const body  = data.text.trim().toUpperCase();

  // TODO: look up subscriber by phone, find next upcoming event, upsert RSVP
  // await supabase.admin... update rsvps set status = 'yes' | 'no'

  return NextResponse.json({ ok: true });
}