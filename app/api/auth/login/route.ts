import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { setSessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { identifier, password } = (await req.json()) as {
      identifier?: string;
      password?: string;
    };

    if (!identifier?.trim() || !password) {
      return NextResponse.json(
        { error: "Please enter your email or mobile number and password." },
        { status: 400 }
      );
    }

    const cleanId = identifier.trim().toLowerCase();
    const db = getDb();
    const user = db
      .prepare("SELECT * FROM users WHERE lower(email) = ? OR mobile = ? LIMIT 1")
      .get(cleanId, identifier.trim()) as
      | {
          id: string;
          name: string;
          email: string;
          mobile: string | null;
          password_hash: string;
          role: "customer" | "admin";
        }
      | undefined;

    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json(
        { error: "Invalid email/mobile or password." },
        { status: 401 }
      );
    }

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("POST /api/auth/login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
