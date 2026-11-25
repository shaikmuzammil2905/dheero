import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb, getOrdersWithItems, getWebsiteSettings } from "@/lib/db";

interface CheckoutItemInput {
  variantId: string;
  quantity: number;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please log in to view orders." }, { status: 401 });
  }
  const orders = getOrdersWithItems(session.userId);
  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const body = (await req.json()) as {
      customerName?: string;
      customerEmail?: string;
      customerMobile?: string;
      shippingAddress?: string;
      city?: string;
      district?: string;
      state?: string;
      pincode?: string;
      paymentMethod?: "razorpay" | "cod";
      notes?: string;
      items?: CheckoutItemInput[];
    };

    if (
      !body.customerName?.trim() ||
      !body.customerEmail?.trim() ||
      !body.customerMobile?.trim() ||
      !body.shippingAddress?.trim() ||
      !body.city?.trim() ||
      !body.district?.trim() ||
      !body.state?.trim() ||
      !body.pincode?.trim() ||
      !body.items?.length
    ) {
      return NextResponse.json(
        { error: "Please complete all delivery fields and ensure your cart is not empty." },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(body.pincode.trim())) {
      return NextResponse.json({ error: "Please enter a valid 6-digit PIN code." }, { status: 400 });
    }

    if (!/^\d{10}$/.test(body.customerMobile.replace(/\D/g, "").slice(-10))) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    const db = getDb();
    const settings = getWebsiteSettings();
    const paymentMethod = body.paymentMethod === "cod" ? "cod" : "razorpay";

    if (paymentMethod === "cod" && settings.cod_enabled !== "1") {
      return NextResponse.json(
        { error: "Cash on Delivery is currently disabled by store administration." },
        { status: 400 }
      );
    }

    let subtotal = 0;
    const resolvedItems: Array<{
      productId: string;
      variantId: string;
      productName: string;
      colorName: string;
      sku: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }> = [];

    for (const item of body.items) {
      const qty = Math.max(1, Math.min(50, Math.floor(Number(item.quantity) || 1)));
      const row = db
        .prepare(
          `SELECT v.id as variant_id, v.product_id, v.sku, v.color_name, v.price, v.stock, v.is_available,
                  p.name as product_name, p.is_active as product_active
           FROM product_variants v
           JOIN products p ON p.id = v.product_id
           WHERE v.id = ?`
        )
        .get(item.variantId) as
        | {
            variant_id: string;
            product_id: string;
            sku: string;
            color_name: string;
            price: number;
            stock: number;
            is_available: number;
            product_name: string;
            product_active: number;
          }
        | undefined;

      if (!row || row.is_available !== 1 || row.product_active !== 1) {
        return NextResponse.json(
          { error: "One or more selected variants are currently unavailable." },
          { status: 400 }
        );
      }

      if (row.stock < qty) {
        return NextResponse.json(
          { error: `Insufficient stock for ${row.color_name} (${row.stock} left).` },
          { status: 400 }
        );
      }

      const lineTotal = row.price * qty;
      subtotal += lineTotal;
      resolvedItems.push({
        productId: row.product_id,
        variantId: row.variant_id,
        productName: row.product_name,
        colorName: row.color_name,
        sku: row.sku,
        quantity: qty,
        unitPrice: row.price,
        totalPrice: lineTotal,
      });
    }

    const baseShipping = Number(settings.shipping_fee ?? 59);
    const freeThreshold = Number(settings.free_shipping_threshold ?? 999);
    const shippingFee = subtotal >= freeThreshold ? 0 : baseShipping;
    const totalAmount = subtotal + shippingFee;

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (paymentMethod === "razorpay" && (!razorpayKeyId || !razorpayKeySecret)) {
      return NextResponse.json(
        {
          error:
            "Online payment gateway (Razorpay) credentials are not configured on the server yet. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET, or select Cash on Delivery if enabled.",
          gatewayNotConfigured: true,
        },
        { status: 400 }
      );
    }

    const orderId = `ord_${crypto.randomUUID().slice(0, 12)}`;
    const orderNumber = `DHR-${new Date().getFullYear()}-${crypto
      .randomInt(100000, 999999)
      .toString()}`;
    const now = new Date().toISOString();

    let razorpayOrderId: string | null = null;
    if (paymentMethod === "razorpay" && razorpayKeyId && razorpayKeySecret) {
      const authHeader = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString("base64");
      const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount * 100,
          currency: "INR",
          receipt: orderNumber,
          notes: {
            brand: "DHEERO",
            order_number: orderNumber,
          },
        }),
      });

      if (!rzpRes.ok) {
        const errText = await rzpRes.text();
        console.error("Razorpay order creation failed:", errText);
        return NextResponse.json(
          { error: "Unable to initiate payment gateway order. Please try again." },
          { status: 502 }
        );
      }
      const rzpData = (await rzpRes.json()) as { id: string };
      razorpayOrderId = rzpData.id;
    }

    const paymentStatus = paymentMethod === "cod" ? "cod_authorised" : "pending";
    const orderStatus = paymentMethod === "cod" ? "Confirmed" : "Pending";

    db.prepare(
      `INSERT INTO orders (
        id, order_number, user_id, customer_name, customer_email, customer_mobile,
        shipping_address, city, district, state, pincode, subtotal, shipping_fee,
        total_amount, payment_method, payment_status, payment_reference, order_status, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      orderId,
      orderNumber,
      session?.userId ?? null,
      body.customerName.trim(),
      body.customerEmail.trim(),
      body.customerMobile.trim(),
      body.shippingAddress.trim(),
      body.city.trim(),
      body.district.trim(),
      body.state.trim(),
      body.pincode.trim(),
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod,
      paymentStatus,
      razorpayOrderId,
      orderStatus,
      body.notes?.trim() ?? null,
      now
    );

    const insertItem = db.prepare(
      `INSERT INTO order_items (
        id, order_id, product_id, variant_id, product_name, color_name, sku, quantity, unit_price, total_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const decStock = db.prepare(
      "UPDATE product_variants SET stock = MAX(0, stock - ?) WHERE id = ?"
    );

    for (const item of resolvedItems) {
      insertItem.run(
        `oi_${crypto.randomUUID().slice(0, 10)}`,
        orderId,
        item.productId,
        item.variantId,
        item.productName,
        item.colorName,
        item.sku,
        item.quantity,
        item.unitPrice,
        item.totalPrice
      );
      if (paymentMethod === "cod") {
        decStock.run(item.quantity, item.variantId);
      }
    }

    return NextResponse.json({
      orderId,
      orderNumber,
      totalAmount,
      paymentMethod,
      paymentStatus,
      orderStatus,
      razorpayOrderId,
      razorpayKeyId: paymentMethod === "razorpay" ? razorpayKeyId : null,
    });
  } catch (err) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
