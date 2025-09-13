import { NextResponse } from "next/server";
import { sendSms } from "@/server/twilio";

export async function POST(req: Request) {
  try {
    const { to, name } = await req.json();

    if (!to) return NextResponse.json({ error: "Missing 'to'" }, { status: 400 });

    const first = (name || "there").toString().split(" ")[0];

    const body =
      `Hey ${first}! You’re on the list for The House 🙌` +
      ` We’ll text weekly invites + RSVPs. Reply STOP to opt out. Msg&data rates may apply.`;

    const sid = await sendSms(to, body);
    return NextResponse.json({ ok: true, sid });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, error: e?.message ?? "send failed" }, { status: 500 });
  }
}