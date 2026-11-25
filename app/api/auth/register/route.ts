import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, mobile, password } = (await req.json()) as {
      name?: string;
      email?: string;
      mobile?: string;
      password?: string;
    };

    if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Name, valid email, and password (min 6 characters) are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile?.trim() || null;

    const db = getDb();
    const existing = db
      .prepare("SELECT id FROM users WHERE lower(email) = ? OR (mobile IS NOT NULL AND mobile = ?)")
      .get(cleanEmail, cleanMobile ?? "");

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email or mobile number already exists." },
        { status: 409 }
      );
    }

    const userId = `usr_${crypto.randomUUID().slice(0, 12)}`;
    const now = new Date().toISOString();
    db.prepare(
      "INSERT INTO users (id, name, email, mobile, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(userId, name.trim(), cleanEmail, cleanMobile, hashPassword(password), "customer", now);

    await setSessionCookie({
      userId,
      email: cleanEmail,
      name: name.trim(),
      role: "customer",
    });

    return NextResponse.json({
      user: {
        id: userId,
        name: name.trim(),
        email: cleanEmail,
        mobile: cleanMobile,
        role: "customer",
      },
    });
  } catch (err) {
    console.error("POST /api/auth/register error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
