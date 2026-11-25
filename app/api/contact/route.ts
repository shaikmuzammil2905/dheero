import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, mobile, subject, message, isWholesale } = (await req.json()) as {
      name?: string;
      email?: string;
      mobile?: string;
      subject?: string;
      message?: string;
      isWholesale?: boolean;
    };

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, subject, and message are required." },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = `msg_${crypto.randomUUID().slice(0, 10)}`;
    db.prepare(
      `INSERT INTO contact_messages (id, name, email, mobile, subject, message, is_wholesale, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      name.trim(),
      email.trim(),
      mobile?.trim() ?? null,
      subject.trim(),
      message.trim(),
      isWholesale ? 1 : 0,
      new Date().toISOString()
    );

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("POST /api/contact error:", err);
    return NextResponse.json({ error: "Failed to submit message" }, { status: 500 });
  }
}
