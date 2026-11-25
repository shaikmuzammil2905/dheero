import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { hashPassword } from "./auth";
import type { Collection, FaqItem, Order, Product, ProductVariant } from "./types";

function resolveDbPath(): string {
  const localDir = path.join(process.cwd(), "data");
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    const probe = path.join(localDir, ".write-test");
    fs.writeFileSync(probe, "1");
    fs.unlinkSync(probe);
    return path.join(localDir, "dheero.db");
  } catch {
    const tmpDir = path.join(os.tmpdir(), "dheero-data");
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    return path.join(tmpDir, "dheero.db");
  }
}

let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (dbInstance) return dbInstance;
  const dbPath = resolveDbPath();
  const db = new DatabaseSync(dbPath);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  initSchema(db);
  seedIfEmpty(db);
  dbInstance = db;
  return db;
}

function initSchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      mobile TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS collections (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      tagline TEXT NOT NULL,
      description TEXT NOT NULL,
      hero_image TEXT NOT NULL,
      accent_color TEXT NOT NULL,
      primary_color TEXT NOT NULL,
      bg_color TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 0,
      is_published INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      seo_title TEXT,
      seo_description TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      collection_id TEXT NOT NULL REFERENCES collections(id),
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      description TEXT NOT NULL,
      product_type TEXT NOT NULL,
      category TEXT NOT NULL,
      target_audience TEXT NOT NULL,
      dimensions TEXT NOT NULL,
      weight TEXT NOT NULL,
      fabric_summary TEXT NOT NULL,
      care_instructions TEXT NOT NULL,
      base_price INTEGER NOT NULL,
      mrp_price INTEGER NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS product_variants (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL REFERENCES products(id),
      sku TEXT UNIQUE NOT NULL,
      color_name TEXT NOT NULL,
      color_hex TEXT NOT NULL,
      marking_description TEXT NOT NULL,
      price INTEGER NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      is_available INTEGER NOT NULL DEFAULT 1,
      primary_image TEXT NOT NULL,
      gallery_images TEXT NOT NULL,
      frames_360 TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS addresses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      full_name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      address_line TEXT NOT NULL,
      city TEXT NOT NULL,
      district TEXT NOT NULL,
      state TEXT NOT NULL,
      pincode TEXT NOT NULL,
      is_default INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      user_id TEXT REFERENCES users(id),
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_mobile TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      city TEXT NOT NULL,
      district TEXT NOT NULL,
      state TEXT NOT NULL,
      pincode TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      shipping_fee INTEGER NOT NULL,
      total_amount INTEGER NOT NULL,
      payment_method TEXT NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'pending',
      payment_reference TEXT,
      order_status TEXT NOT NULL DEFAULT 'Pending',
      tracking_number TEXT,
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL REFERENCES orders(id),
      product_id TEXT NOT NULL REFERENCES products(id),
      variant_id TEXT NOT NULL REFERENCES product_variants(id),
      product_name TEXT NOT NULL,
      color_name TEXT NOT NULL,
      sku TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price INTEGER NOT NULL,
      total_price INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS faqs (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS website_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      mobile TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      is_wholesale INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);
}

function seedIfEmpty(db: DatabaseSync) {
  const existingUser = db.prepare("SELECT id FROM users LIMIT 1").get();
  if (!existingUser) {
    const now = new Date().toISOString();
    db.prepare(
      "INSERT INTO users (id, name, email, mobile, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(
      "usr_admin_dheero",
      "L. Sai Chand (DHEER)",
      "admin@dheero.in",
      "7207147749",
      hashPassword("Dheero@2026"),
      "admin",
      now
    );

    db.prepare(
      "INSERT INTO users (id, name, email, mobile, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(
      "usr_demo_devotee",
      "Arjun Swamy",
      "devotee@dheero.in",
      "9876543210",
      hashPassword("Swami@123"),
      "customer",
      now
    );
  }

  const existingCollection = db.prepare("SELECT id FROM collections LIMIT 1").get();
  if (!existingCollection) {
    const insertCol = db.prepare(`
      INSERT INTO collections (id, slug, name, tagline, description, hero_image, accent_color, primary_color, bg_color, is_active, is_published, sort_order, seo_title, seo_description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertCol.run(
      "col_devotional",
      "devotional",
      "Devotional Collection",
      "A Journey of Faith. A Tradition of Devotion.",
      "Thoughtfully designed devotional headwear and essentials inspired by the sacred Sabarimala pilgrimage.",
      "/images/hero-sabarimala.jpg",
      "#F26500",
      "#7A0E0E",
      "#F9F3E6",
      1,
      1,
      1,
      "DHEERO™ | Devotional Headwear & Irumudi Rumala",
      "Thoughtfully designed essentials for the sacred Sabarimala journey. Explore the DHEERO™ Irumudi Rumala."
    );

    insertCol.run(
      "col_heritage",
      "heritage",
      "Heritage Scarves",
      "Woven Stories of Indian Craft.",
      "Timeless Indian heritage scarves crafted with traditional motifs and breathable natural-feel fabrics.",
      "/images/rumala-trio.jpg",
      "#D4A017",
      "#5A2E0B",
      "#F9F3E6",
      0,
      0,
      2,
      "DHEERO™ | Heritage Scarves Collection",
      "Traditional Indian heritage scarves by DHEERO™."
    );

    insertCol.run(
      "col_biker",
      "biker",
      "Biker & Rider",
      "Ride With Courage. Built for the Road.",
      "Helmet-compatible biker headscarves and bandanas engineered for breathability, grip, and road comfort.",
      "/images/hero-sabarimala.jpg",
      "#F26500",
      "#1E1B18",
      "#F5F2EB",
      0,
      0,
      3,
      "DHEERO™ | Biker Headwear & Bandanas",
      "Motorcycle lifestyle headscarves and bandanas by DHEERO™."
    );

    insertCol.run(
      "col_sports",
      "sports",
      "Sports Headwear",
      "Focus. Endurance. Motion.",
      "Lightweight, sweat-wicking athletic headscarves and headbands designed for high-intensity training.",
      "/images/hero-sabarimala.jpg",
      "#F26500",
      "#0F3D3E",
      "#F7F7F5",
      0,
      0,
      4,
      "DHEERO™ | Sports Headwear",
      "Performance sports headwear by DHEERO™."
    );

    insertCol.run(
      "col_lifestyle",
      "lifestyle",
      "Everyday Lifestyle",
      "Identity in Every Fold.",
      "Versatile everyday bandanas and saffron-inspired cultural wraps for modern Indian lifestyles.",
      "/images/rumala-trio.jpg",
      "#F26500",
      "#5A2E0B",
      "#F9F3E6",
      0,
      0,
      5,
      "DHEERO™ | Everyday Lifestyle Bandanas",
      "Everyday lifestyle bandanas and cultural wraps by DHEERO™."
    );
  }

  const existingProduct = db.prepare("SELECT id FROM products LIMIT 1").get();
  if (!existingProduct) {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO products (
        id, collection_id, slug, name, subtitle, description, product_type, category,
        target_audience, dimensions, weight, fabric_summary, care_instructions,
        base_price, mrp_price, is_active, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      "prod_irumudi_rumala",
      "col_devotional",
      "irumudi-rumala",
      "DHEERO™ Irumudi Rumala",
      "Dedicated Devotional Headwear for Ayyappa Swamy Devotees",
      "A thoughtfully designed devotional rumala for Ayyappa Swamy devotees, bringing together traditional inspiration, comfortable fabric and distinctive product presentation.",
      "Devotional Headwear",
      "Irumudi Rumala",
      "Adult male Ayyappa devotees",
      "Standard (Final dimensions to be confirmed)",
      "To be confirmed after final fabric selection",
      "Comfort-focused breathable fabric (Final fabric selection to be confirmed)",
      "Hand wash recommended with mild detergent. Dry in shade. Iron on low heat. Do not bleach. Do not dry clean.",
      399,
      499,
      1,
      now
    );

    const insertVariant = db.prepare(`
      INSERT INTO product_variants (
        id, product_id, sku, color_name, color_hex, marking_description,
        price, stock, is_available, primary_image, gallery_images, frames_360, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertVariant.run(
      "var_turmeric_yellow",
      "prod_irumudi_rumala",
      "DHR-IRU-YLW-01",
      "Turmeric Yellow",
      "#F4B400",
      "Red Kumkum-inspired horizontal marking",
      399,
      120,
      1,
      "/images/rumala-turmeric.jpg",
      JSON.stringify([
        "/images/rumala-turmeric.jpg",
        "/images/rumala-trio.jpg",
        "/images/rumala-brown.jpg",
        "/images/rumala-maroon.jpg",
      ]),
      JSON.stringify([]),
      1
    );

    insertVariant.run(
      "var_light_brown",
      "prod_irumudi_rumala",
      "DHR-IRU-BRN-01",
      "Light Brown",
      "#9E6B43",
      "Devotional marking design to be finalised (editable via Admin)",
      399,
      85,
      1,
      "/images/rumala-brown.jpg",
      JSON.stringify([
        "/images/rumala-brown.jpg",
        "/images/rumala-trio.jpg",
        "/images/rumala-turmeric.jpg",
        "/images/rumala-maroon.jpg",
      ]),
      JSON.stringify([]),
      2
    );

    insertVariant.run(
      "var_maroon_red",
      "prod_irumudi_rumala",
      "DHR-IRU-MRN-01",
      "Maroon Red",
      "#7A0E0E",
      "Yellow Gandham-inspired horizontal marking",
      399,
      95,
      1,
      "/images/rumala-maroon.jpg",
      JSON.stringify([
        "/images/rumala-maroon.jpg",
        "/images/rumala-trio.jpg",
        "/images/rumala-turmeric.jpg",
        "/images/rumala-brown.jpg",
      ]),
      JSON.stringify([]),
      3
    );

    insertVariant.run(
      "var_black_optional",
      "prod_irumudi_rumala",
      "DHR-IRU-BLK-01",
      "Black (Optional Future)",
      "#1E1B18",
      "Optional future variant — devotional marking to be finalised in Admin",
      399,
      0,
      0,
      "/images/rumala-trio.jpg",
      JSON.stringify(["/images/rumala-trio.jpg"]),
      JSON.stringify([]),
      4
    );
  }

  const existingFaq = db.prepare("SELECT id FROM faqs LIMIT 1").get();
  if (!existingFaq) {
    const insertFaq = db.prepare(
      "INSERT INTO faqs (id, question, answer, sort_order, is_active) VALUES (?, ?, ?, ?, ?)"
    );
    const faqs = [
      [
        "faq_1",
        "What is DHEERO Irumudi Rumala?",
        "DHEERO™ Irumudi Rumala is a dedicated devotional headwear cloth thoughtfully designed for Ayyappa Swamy devotees, combining traditional-inspired colour combinations, distinctive horizontal devotional markings, and comfortable fabric presentation.",
        1,
      ],
      [
        "faq_2",
        "What colour options are available?",
        "Our initial launch offers three signature variants: Turmeric Yellow (with a Red Kumkum-inspired horizontal marking), Light Brown, and Maroon Red (with a Yellow Gandham-inspired horizontal marking). Additional colours such as Black may be introduced via the admin catalogue.",
        2,
      ],
      [
        "faq_3",
        "How do I choose a colour?",
        "You may choose the colour that best aligns with your personal preference, group tradition, or comfort during your pilgrimage journey. All variants feature the same thoughtful DHEERO™ sizing and finishing.",
        3,
      ],
      [
        "faq_4",
        "What are the product dimensions?",
        "The DHEERO™ Irumudi Rumala is crafted in a Standard size suited for traditional head covering and Irumudi wrapping styles. Final exact dimensions will be updated on the product page once confirmed.",
        4,
      ],
      [
        "faq_5",
        "How do I wear the rumala?",
        "You can wear it in multiple ways — as a traditional head covering, forehead-style wrapping, full-head coverage, side and ear coverage, or neatly folded. Step-by-step styling demonstrations are available on the product page.",
        5,
      ],
      [
        "faq_6",
        "How do I care for the fabric?",
        "We recommend gentle hand washing with mild detergent, drying in shade, and ironing on low heat. Avoid bleach or harsh dry cleaning to preserve the woven border and devotional markings.",
        6,
      ],
      [
        "faq_7",
        "How can I place an order?",
        "Visit the DHEERO™ Irumudi Rumala product page, select your preferred colour variant and quantity, click Add to Cart or Buy Now, and complete your delivery and payment details at checkout.",
        7,
      ],
      [
        "faq_8",
        "Do you offer wholesale orders?",
        "Yes! DHEERO™ (Dheer Eco Essentials) supports both retail and wholesale/bulk orders for pilgrim groups, Sabarimala Mandali committees, and devotional stores. Use our Contact page or WhatsApp Support (+91 7207147749) for bulk inquiries.",
        8,
      ],
      [
        "faq_9",
        "How can I track my order?",
        "Once your order is confirmed and shipped, you can track its live status (Pending, Confirmed, Processing, Shipped, Out for Delivery, Delivered) in your My Account dashboard or by contacting WhatsApp Support with your Order ID.",
        9,
      ],
      [
        "faq_10",
        "What is your return and refund policy?",
        "Unused, unwashed products in their original packaging are eligible for return or replacement within 7 days of delivery in case of transit damage or manufacturing defects. Please review our Return & Refund Policy pages for full terms.",
        10,
      ],
      [
        "faq_11",
        "How can I contact customer support?",
        "Reach us anytime via Phone or WhatsApp at +91 7207147749, or email dheergopichand@gmail.com. Our team at Khammam, Telangana responds promptly to all retail and wholesale queries.",
        11,
      ],
    ];
    for (const [id, q, a, order] of faqs) {
      insertFaq.run(id, q, a, order, 1);
    }
  }

  const existingSetting = db.prepare("SELECT key FROM website_settings LIMIT 1").get();
  if (!existingSetting) {
    const insertSetting = db.prepare("INSERT INTO website_settings (key, value) VALUES (?, ?)");
    const defaults: Record<string, string> = {
      business_name: "Dheer Eco Essentials",
      brand_name: "DHEERO™",
      owner_name: "L. Sai Chand (DHEER)",
      phone: "7207147749",
      whatsapp: "7207147749",
      email: "dheergopichand@gmail.com",
      address: "P No. 60, Teacher's Colony, Yedulapuram, Khammam – 507003, Telangana, India",
      gst: "36ACMPL5503H",
      shipping_fee: "59",
      free_shipping_threshold: "999",
      cod_enabled: "1",
      razorpay_enabled: "1",
      instagram_url: "https://instagram.com",
      hero_heading: "A Journey of Faith.\nA Tradition of Devotion.",
      hero_subheading: "DHEERO™ – Thoughtfully designed essentials for the sacred journey.",
      hero_mantra: "Swamiye Saranam Ayyappa",
      about_intro:
        "DHEERO™ is a genuine Indian brand dedicated to thoughtfully designed headwear inspired by Indian tradition, comfort and contemporary lifestyle.",
      craft_intro:
        "Every DHEERO™ Irumudi Rumala is created with attention to proportion, breathable comfort, respectful devotional markings, and neat presentation.",
    };
    for (const [k, v] of Object.entries(defaults)) {
      insertSetting.run(k, v);
    }
  }
}

export function getWebsiteSettings(): Record<string, string> {
  const db = getDb();
  const rows = db.prepare("SELECT key, value FROM website_settings").all() as Array<{
    key: string;
    value: string;
  }>;
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export function getActiveCollection(): Collection {
  const db = getDb();
  const active = db
    .prepare("SELECT * FROM collections WHERE is_active = 1 LIMIT 1")
    .get() as unknown as Collection | undefined;
  if (active) return active;
  return db
    .prepare("SELECT * FROM collections ORDER BY sort_order ASC LIMIT 1")
    .get() as unknown as Collection;
}

export function getAllCollections(): Collection[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM collections ORDER BY sort_order ASC")
    .all() as unknown as Collection[];
}

export function getProductsWithVariants(includeInactive = false): Product[] {
  const db = getDb();
  const sql = includeInactive
    ? "SELECT * FROM products ORDER BY created_at ASC"
    : "SELECT * FROM products WHERE is_active = 1 ORDER BY created_at ASC";
  const products = db.prepare(sql).all() as Array<Omit<Product, "variants">>;

  const variantStmt = db.prepare(
    "SELECT * FROM product_variants WHERE product_id = ? ORDER BY sort_order ASC"
  );

  return products.map((p) => {
    const rawVariants = variantStmt.all(p.id) as Array<
      Omit<ProductVariant, "gallery_images" | "frames_360"> & {
        gallery_images: string;
        frames_360: string;
      }
    >;
    const variants: ProductVariant[] = rawVariants
      .filter((v) => includeInactive || v.is_available === 1)
      .map((v) => ({
        ...v,
        gallery_images: JSON.parse(v.gallery_images || "[]"),
        frames_360: JSON.parse(v.frames_360 || "[]"),
      }));
    return { ...p, variants };
  });
}

export function getFaqs(includeInactive = false): FaqItem[] {
  const db = getDb();
  const sql = includeInactive
    ? "SELECT * FROM faqs ORDER BY sort_order ASC"
    : "SELECT * FROM faqs WHERE is_active = 1 ORDER BY sort_order ASC";
  return db.prepare(sql).all() as unknown as FaqItem[];
}

export function getOrdersWithItems(userId?: string): Order[] {
  const db = getDb();
  const orders = (
    userId
      ? db
          .prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC")
          .all(userId)
      : db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all()
  ) as unknown as Order[];

  const itemStmt = db.prepare("SELECT * FROM order_items WHERE order_id = ?");
  return orders.map((o) => ({
    ...o,
    items: itemStmt.all(o.id) as unknown as Order["items"],
  }));
}
