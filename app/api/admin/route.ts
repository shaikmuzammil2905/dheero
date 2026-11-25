import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getAllCollections,
  getDb,
  getFaqs,
  getOrdersWithItems,
  getProductsWithVariants,
  getWebsiteSettings,
} from "@/lib/db";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Admin authentication required." }, { status: 403 });
  }

  const db = getDb();
  const collections = getAllCollections();
  const products = getProductsWithVariants(true);
  const orders = getOrdersWithItems();
  const faqs = getFaqs(true);
  const settings = getWebsiteSettings();
  const customers = db
    .prepare(
      "SELECT id, name, email, mobile, role, created_at FROM users ORDER BY created_at DESC"
    )
    .all();
  const messages = db
    .prepare("SELECT * FROM contact_messages ORDER BY created_at DESC")
    .all();

  const totalSales = orders
    .filter((o) => o.order_status !== "Cancelled" && o.order_status !== "Returned")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const pendingOrders = orders.filter(
    (o) => o.order_status === "Pending" || o.order_status === "Confirmed" || o.order_status === "Processing"
  ).length;

  const completedOrders = orders.filter((o) => o.order_status === "Delivered").length;

  const lowStockVariants = products.flatMap((p) =>
    p.variants.filter((v) => v.is_available === 1 && v.stock < 20)
  );

  return NextResponse.json({
    stats: {
      totalOrders: orders.length,
      totalSales,
      pendingOrders,
      completedOrders,
      lowStockCount: lowStockVariants.length,
    },
    collections,
    products,
    orders,
    faqs,
    settings,
    customers,
    messages,
  });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Admin authentication required." }, { status: 403 });
  }

  try {
    const body = (await req.json()) as { action: string; payload: Record<string, unknown> };
    const db = getDb();
    const p = body.payload || {};

    switch (body.action) {
      case "activate_collection": {
        const colId = String(p.id || "");
        db.prepare("UPDATE collections SET is_active = 0").run();
        db.prepare("UPDATE collections SET is_active = 1, is_published = 1 WHERE id = ?").run(colId);
        return NextResponse.json({ ok: true });
      }

      case "update_collection": {
        db.prepare(
          `UPDATE collections
           SET name = ?, tagline = ?, description = ?, hero_image = ?,
               accent_color = ?, primary_color = ?, bg_color = ?, is_published = ?
           WHERE id = ?`
        ).run(
          String(p.name || ""),
          String(p.tagline || ""),
          String(p.description || ""),
          String(p.hero_image || "/images/hero-sabarimala.jpg"),
          String(p.accent_color || "#F26500"),
          String(p.primary_color || "#7A0E0E"),
          String(p.bg_color || "#F9F3E6"),
          p.is_published ? 1 : 0,
          String(p.id || "")
        );
        return NextResponse.json({ ok: true });
      }

      case "create_collection": {
        const id = `col_${crypto.randomUUID().slice(0, 8)}`;
        const slug = String(p.slug || id).toLowerCase().replace(/[^a-z0-9-]/g, "-");
        db.prepare(
          `INSERT INTO collections (id, slug, name, tagline, description, hero_image, accent_color, primary_color, bg_color, is_active, is_published, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 10)`
        ).run(
          id,
          slug,
          String(p.name || "New Collection"),
          String(p.tagline || ""),
          String(p.description || ""),
          String(p.hero_image || "/images/hero-sabarimala.jpg"),
          String(p.accent_color || "#F26500"),
          String(p.primary_color || "#7A0E0E"),
          String(p.bg_color || "#F9F3E6"),
          p.is_published ? 1 : 0
        );
        return NextResponse.json({ ok: true, id });
      }

      case "update_product": {
        db.prepare(
          `UPDATE products
           SET name = ?, subtitle = ?, description = ?, dimensions = ?, weight = ?,
               fabric_summary = ?, care_instructions = ?, base_price = ?, mrp_price = ?, is_active = ?
           WHERE id = ?`
        ).run(
          String(p.name || ""),
          String(p.subtitle || ""),
          String(p.description || ""),
          String(p.dimensions || ""),
          String(p.weight || ""),
          String(p.fabric_summary || ""),
          String(p.care_instructions || ""),
          Number(p.base_price || 399),
          Number(p.mrp_price || 499),
          p.is_active ? 1 : 0,
          String(p.id || "")
        );
        return NextResponse.json({ ok: true });
      }

      case "update_variant": {
        db.prepare(
          `UPDATE product_variants
           SET color_name = ?, color_hex = ?, marking_description = ?, price = ?, stock = ?,
               is_available = ?, primary_image = ?, gallery_images = ?, frames_360 = ?
           WHERE id = ?`
        ).run(
          String(p.color_name || ""),
          String(p.color_hex || "#F4B400"),
          String(p.marking_description || ""),
          Number(p.price || 399),
          Number(p.stock || 0),
          p.is_available ? 1 : 0,
          String(p.primary_image || "/images/rumala-turmeric.jpg"),
          JSON.stringify(Array.isArray(p.gallery_images) ? p.gallery_images : []),
          JSON.stringify(Array.isArray(p.frames_360) ? p.frames_360 : []),
          String(p.id || "")
        );
        return NextResponse.json({ ok: true });
      }

      case "create_variant": {
        const id = `var_${crypto.randomUUID().slice(0, 8)}`;
        db.prepare(
          `INSERT INTO product_variants (id, product_id, sku, color_name, color_hex, marking_description, price, stock, is_available, primary_image, gallery_images, frames_360, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 10)`
        ).run(
          id,
          String(p.product_id || "prod_irumudi_rumala"),
          String(p.sku || `DHR-${Date.now()}`),
          String(p.color_name || "New Colour"),
          String(p.color_hex || "#333333"),
          String(p.marking_description || ""),
          Number(p.price || 399),
          Number(p.stock || 50),
          p.is_available ? 1 : 0,
          String(p.primary_image || "/images/rumala-trio.jpg"),
          JSON.stringify([String(p.primary_image || "/images/rumala-trio.jpg")]),
          JSON.stringify([])
        );
        return NextResponse.json({ ok: true, id });
      }

      case "update_order": {
        db.prepare(
          "UPDATE orders SET order_status = ?, tracking_number = ?, payment_status = ? WHERE id = ?"
        ).run(
          String(p.order_status || "Pending"),
          p.tracking_number ? String(p.tracking_number) : null,
          String(p.payment_status || "pending"),
          String(p.id || "")
        );
        return NextResponse.json({ ok: true });
      }

      case "update_settings": {
        const entries = Object.entries((p.settings as Record<string, string>) || {});
        const upsert = db.prepare(
          "INSERT INTO website_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
        );
        for (const [k, v] of entries) {
          upsert.run(k, String(v));
        }
        return NextResponse.json({ ok: true });
      }

      case "save_faq": {
        if (p.id) {
          db.prepare("UPDATE faqs SET question = ?, answer = ?, is_active = ? WHERE id = ?").run(
            String(p.question || ""),
            String(p.answer || ""),
            p.is_active ? 1 : 0,
            String(p.id)
          );
        } else {
          const id = `faq_${crypto.randomUUID().slice(0, 8)}`;
          db.prepare(
            "INSERT INTO faqs (id, question, answer, sort_order, is_active) VALUES (?, ?, ?, 99, 1)"
          ).run(id, String(p.question || ""), String(p.answer || ""));
        }
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ error: "Unknown admin action." }, { status: 400 });
    }
  } catch (err) {
    console.error("POST /api/admin error:", err);
    return NextResponse.json({ error: "Admin operation failed." }, { status: 500 });
  }
}
