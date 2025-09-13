import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();
  if (password !== process.env.ADMIN_PASS) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("thehouse_admin", "1", {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8h
  });
  return res;
}