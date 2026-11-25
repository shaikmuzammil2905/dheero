import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = (await req.json()) as {
      orderId?: string;
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Payment verification secret not configured." },
        { status: 500 }
      );
    }

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification fields." },
        { status: 400 }
      );
    }

    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const valid =
      expectedSig.length === razorpay_signature.length &&
      crypto.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(razorpay_signature));

    if (!valid) {
      const db = getDb();
      db.prepare("UPDATE orders SET payment_status = 'failed' WHERE id = ?").run(orderId);
      return NextResponse.json({ error: "Payment signature verification failed." }, { status: 400 });
    }

    const db = getDb();
    const order = db
      .prepare("SELECT id, payment_status FROM orders WHERE id = ? AND payment_reference = ?")
      .get(orderId, razorpay_order_id) as { id: string; payment_status: string } | undefined;

    if (!order) {
      return NextResponse.json({ error: "Order reference mismatch." }, { status: 404 });
    }

    if (order.payment_status !== "verified") {
      db.prepare(
        "UPDATE orders SET payment_status = 'verified', order_status = 'Confirmed', payment_reference = ? WHERE id = ?"
      ).run(razorpay_payment_id, orderId);

      const items = db
        .prepare("SELECT variant_id, quantity FROM order_items WHERE order_id = ?")
        .all(orderId) as Array<{ variant_id: string; quantity: number }>;

      const decStock = db.prepare(
        "UPDATE product_variants SET stock = MAX(0, stock - ?) WHERE id = ?"
      );
      for (const item of items) {
        decStock.run(item.quantity, item.variant_id);
      }
    }

    return NextResponse.json({ verified: true, orderId });
  } catch (err) {
    console.error("POST /api/payments/verify error:", err);
    return NextResponse.json({ error: "Verification error" }, { status: 500 });
  }
}
