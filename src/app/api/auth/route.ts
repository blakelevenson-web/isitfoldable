import { NextRequest, NextResponse } from "next/server";

const ADMIN_USER = "Blake Levenson";
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "I like pizza";
const ADMIN_EMAIL = "admin@foldable.com";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, username, password, email } = body;

  if (action === "login") {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const res = NextResponse.json({ ok: true, username: ADMIN_USER });
      res.cookies.set("admin_session", "authenticated", {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      });
      return res;
    }
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  if (action === "recover") {
    if (email?.toLowerCase() === ADMIN_EMAIL) {
      return NextResponse.json({
        ok: true,
        message: `Recovery Success!\nUser: ${ADMIN_USER}\nPass: ${ADMIN_PASS}`,
      });
    }
    return NextResponse.json({ error: "Email not found." }, { status: 404 });
  }

  if (action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete("admin_session");
    return res;
  }

  if (action === "check") {
    const cookie = req.cookies.get("admin_session");
    if (cookie?.value === "authenticated") {
      return NextResponse.json({ authenticated: true, username: ADMIN_USER });
    }
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
