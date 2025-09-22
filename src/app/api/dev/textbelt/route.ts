import { NextRequest, NextResponse } from "next/server";
import { sendViaTextbelt } from "@/server/textbelt";

export async function POST(req: NextRequest) {
  const { to, message } = await req.json();
  if (!to || !message) {
    return NextResponse.json({ ok: false, error: "to and message required" }, { status: 400 });
  }
  try {
    const id = await sendViaTextbelt(to, message);
    return NextResponse.json({ ok: true, id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}