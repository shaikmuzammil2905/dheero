import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb, getOrdersWithItems } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const db = getDb();
  const user = db
    .prepare("SELECT id, name, email, mobile, role, created_at FROM users WHERE id = ?")
    .get(session.userId);

  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const addresses = db
    .prepare("SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC")
    .all(session.userId);

  const orders = getOrdersWithItems(session.userId);

  return NextResponse.json({ user, addresses, orders });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    full_name?: string;
    mobile?: string;
    address_line?: string;
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
  };

  if (
    !body.full_name?.trim() ||
    !body.mobile?.trim() ||
    !body.address_line?.trim() ||
    !body.city?.trim() ||
    !body.district?.trim() ||
    !body.state?.trim() ||
    !body.pincode?.trim()
  ) {
    return NextResponse.json({ error: "All address fields are required." }, { status: 400 });
  }

  const db = getDb();
  const id = `adr_${crypto.randomUUID().slice(0, 10)}`;
  db.prepare(
    `INSERT INTO addresses (id, user_id, full_name, mobile, address_line, city, district, state, pincode, is_default)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`
  ).run(
    id,
    session.userId,
    body.full_name.trim(),
    body.mobile.trim(),
    body.address_line.trim(),
    body.city.trim(),
    body.district.trim(),
    body.state.trim(),
    body.pincode.trim()
  );

  return NextResponse.json({ ok: true, id });
}
