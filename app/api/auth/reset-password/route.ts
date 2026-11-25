import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { identifier, newPassword } = (await req.json()) as {
      identifier?: string;
      newPassword?: string;
    };

    if (!identifier?.trim() || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Provide your registered email/mobile and a new password (min 6 chars)." },
        { status: 400 }
      );
    }

    const db = getDb();
    const user = db
      .prepare("SELECT id, role FROM users WHERE lower(email) = ? OR mobile = ? LIMIT 1")
      .get(identifier.trim().toLowerCase(), identifier.trim()) as
      | { id: string; role: string }
      | undefined;

    if (!user) {
      return NextResponse.json(
        { error: "No account found with that email or mobile number." },
        { status: 404 }
      );
    }

    if (user.role === "admin") {
      return NextResponse.json(
        { error: "Admin passwords must be rotated securely by the owner." },
        { status: 403 }
      );
    }

    db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(
      hashPassword(newPassword),
      user.id
    );

    return NextResponse.json({
      ok: true,
      message: "Password updated successfully. You may now log in.",
    });
  } catch (err) {
    console.error("POST /api/auth/reset-password error:", err);
    return NextResponse.json({ error: "Password reset failed" }, { status: 500 });
  }
}
