"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Layers,
  Package,
  Settings,
  Shield,
  ShoppingBag,
  Sparkles,
  Upload,
  Users,
} from "lucide-react";
import type { Collection, FaqItem, Order, Product, ProductVariant } from "@/lib/types";
import { useStore } from "@/components/StoreProvider";

interface AdminData {
  stats: {
    totalOrders: number;
    totalSales: number;
    pendingOrders: number;
    completedOrders: number;
    lowStockCount: number;
  };
  collections: Collection[];
  products: Product[];
  orders: Order[];
  faqs: FaqItem[];
  settings: Record<string, string>;
  customers: Array<{
    id: string;
    name: string;
    email: string;
    mobile: string | null;
    role: string;
    created_at: string;
  }>;
  messages: Array<{
    id: string;
    name: string;
    email: string;
    mobile: string | null;
    subject: string;
    message: string;
    is_wholesale: number;
    created_at: string;
  }>;
}

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Returned",
];

export default function AdminPage() {
  const { refreshStore } = useStore();
  const [tab, setTab] = useState<
    "dashboard" | "products" | "collections" | "orders" | "settings" | "customers"
  >("dashboard");
  const [data, setData] = useState<AdminData | null>(null);
  const [authError, setAuthError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [newVariantColor, setNewVariantColor] = useState("");
  const [newVariantHex, setNewVariantHex] = useState("#1E1B18");
  const [newVariantSku, setNewVariantSku] = useState("");
  const [newVariantMarking, setNewVariantMarking] = useState("");

  const [newColName, setNewColName] = useState("");
  const [newColSlug, setNewColSlug] = useState("");
  const [newColTagline, setNewColTagline] = useState("");

  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadAdmin = async () => {
    try {
      const res = await fetch("/api/admin", { cache: "no-store" });
      if (res.status === 403) {
        setAuthError(true);
        return;
      }
      if (!res.ok) return;
      const json = (await res.json()) as AdminData;
      setData(json);
      setAuthError(false);
    } catch {
      setAuthError(true);
    }
  };

  useEffect(() => {
    loadAdmin();
  }, []);

  const runAction = async (action: string, payload: Record<string, unknown>, msg: string) => {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, payload }),
    });
    if (res.ok) {
      notify(msg);
      await loadAdmin();
      await refreshStore();
    } else {
      const err = await res.json();
      notify(err.error || "Action failed");
    }
  };

  const handleUploadFiles = async (
    files: FileList | null,
    variant: ProductVariant,
    target: "primary" | "frames360"
  ) => {
    if (!files || !files.length) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok || !json.urls?.length) {
      notify("Upload failed");
      return;
    }
    if (target === "primary") {
      await runAction(
        "update_variant",
        {
          ...variant,
          primary_image: json.urls[0],
          gallery_images: [...json.urls, ...variant.gallery_images],
        },
        `Updated photograph for ${variant.color_name}`
      );
    } else {
      await runAction(
        "update_variant",
        {
          ...variant,
          frames_360: json.urls,
        },
        `Uploaded ${json.urls.length} 360° frames for ${variant.color_name}`
      );
    }
  };

  if (authError) {
    return (
      <div className="parchment-surface py-20 px-4 min-h-[75vh] flex items-center justify-center">
        <div className="max-w-md w-full parchment-card rounded-3xl p-8 text-center space-y-4">
          <Shield className="w-12 h-12 text-[#7A0E0E] mx-auto" />
          <h1 className="font-serif-display text-3xl font-bold text-[#5A2E0B]">
            Admin Authentication Required
          </h1>
          <p className="text-sm text-[#5A2E0B]/80">
            Please sign in with an authorised DHEERO™ Admin account to manage products,
            360° frames, collections, orders, and site settings.
          </p>
          <Link
            href="/login"
            className="inline-block px-7 py-3 rounded-full bg-[#F26500] text-white font-semibold text-sm shadow"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="parchment-surface py-20 text-center text-[#5A2E0B]">
        Loading DHEERO™ Admin Console...
      </div>
    );
  }

  const product = data.products[0];

  return (
    <div className="parchment-surface py-8 sm:py-12 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A0E0E]">
              Dheer Eco Essentials
            </span>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#5A2E0B]">
              DHEERO™ Admin Console
            </h1>
          </div>
          {toast && (
            <div className="px-4 py-2 rounded-full bg-[#1F6F3D] text-white text-xs font-semibold flex items-center gap-1.5 shadow">
              <CheckCircle2 className="w-4 h-4" /> {toast}
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: Sparkles },
            { id: "products", label: "Products & 360°", icon: ShoppingBag },
            { id: "collections", label: "Collections", icon: Layers },
            { id: "orders", label: "Orders", icon: Package },
            { id: "settings", label: "Content & Settings", icon: Settings },
            { id: "customers", label: "Customers & Inquiries", icon: Users },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as typeof tab)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                tab === t.id
                  ? "bg-[#7A0E0E] text-[#F9F3E6] shadow"
                  : "bg-white/80 text-[#5A2E0B] border border-[#D4A017]/40 hover:bg-white"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {tab === "dashboard" && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "Total Orders", value: data.stats.totalOrders },
              { label: "Total Sales", value: `₹${data.stats.totalSales}` },
              { label: "Pending Orders", value: data.stats.pendingOrders },
              { label: "Completed", value: data.stats.completedOrders },
              { label: "Low Stock Variants", value: data.stats.lowStockCount },
            ].map((s) => (
              <div key={s.label} className="parchment-card rounded-2xl p-5 space-y-1">
                <p className="text-xs text-[#5A2E0B]/70 font-medium">{s.label}</p>
                <p className="font-serif-display text-3xl font-bold text-[#7A0E0E]">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* PRODUCTS & 360 TAB */}
        {tab === "products" && product && (
          <div className="space-y-6">
            <div className="parchment-card rounded-2xl p-6 space-y-4">
              <h2 className="font-serif-display text-2xl font-bold text-[#7A0E0E]">
                Product Details — {product.name}
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  runAction(
                    "update_product",
                    {
                      id: product.id,
                      name: fd.get("name"),
                      subtitle: fd.get("subtitle"),
                      description: fd.get("description"),
                      dimensions: fd.get("dimensions"),
                      weight: fd.get("weight"),
                      fabric_summary: fd.get("fabric_summary"),
                      care_instructions: fd.get("care_instructions"),
                      base_price: Number(fd.get("base_price")),
                      mrp_price: Number(fd.get("mrp_price")),
                      is_active: true,
                    },
                    "Product details updated"
                  );
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"
              >
                <div>
                  <label className="font-semibold block mb-1">Product Name</label>
                  <input
                    name="name"
                    defaultValue={product.name}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#D4A017]/50"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Subtitle</label>
                  <input
                    name="subtitle"
                    defaultValue={product.subtitle}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#D4A017]/50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="font-semibold block mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={2}
                    defaultValue={product.description}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#D4A017]/50"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Dimensions</label>
                  <input
                    name="dimensions"
                    defaultValue={product.dimensions}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#D4A017]/50"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Weight</label>
                  <input
                    name="weight"
                    defaultValue={product.weight}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#D4A017]/50"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Fabric Summary</label>
                  <input
                    name="fabric_summary"
                    defaultValue={product.fabric_summary}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#D4A017]/50"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Care Instructions</label>
                  <input
                    name="care_instructions"
                    defaultValue={product.care_instructions}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#D4A017]/50"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Base Price (₹)</label>
                  <input
                    name="base_price"
                    type="number"
                    defaultValue={product.base_price}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#D4A017]/50"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">MRP Price (₹)</label>
                  <input
                    name="mrp_price"
                    type="number"
                    defaultValue={product.mrp_price}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#D4A017]/50"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#F26500] text-white font-semibold"
                  >
                    Save Product Specs
                  </button>
                </div>
              </form>
            </div>

            {/* Variants & 360 Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.variants.map((v) => (
                <div key={v.id} className="parchment-card rounded-2xl p-5 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-black/20"
                        style={{ backgroundColor: v.color_hex }}
                      />
                      <h3 className="font-bold text-base text-[#5A2E0B]">{v.color_name}</h3>
                    </div>
                    <span className="text-[11px] font-mono text-[#7A0E0E]">{v.sku}</span>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      runAction(
                        "update_variant",
                        {
                          ...v,
                          color_name: fd.get("color_name"),
                          marking_description: fd.get("marking_description"),
                          price: Number(fd.get("price")),
                          stock: Number(fd.get("stock")),
                          is_available: fd.get("is_available") === "on",
                        },
                        `Updated ${v.color_name}`
                      );
                    }}
                    className="space-y-2"
                  >
                    <input
                      name="color_name"
                      defaultValue={v.color_name}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D4A017]/40"
                    />
                    <input
                      name="marking_description"
                      defaultValue={v.marking_description}
                      placeholder="Devotional marking description"
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D4A017]/40"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        name="price"
                        type="number"
                        defaultValue={v.price}
                        className="px-3 py-1.5 rounded-lg bg-white border border-[#D4A017]/40"
                      />
                      <input
                        name="stock"
                        type="number"
                        defaultValue={v.stock}
                        className="px-3 py-1.5 rounded-lg bg-white border border-[#D4A017]/40"
                      />
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="is_available"
                        defaultChecked={v.is_available === 1}
                      />
                      <span>Visible & Available on Storefront</span>
                    </label>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-full bg-[#7A0E0E] text-white font-semibold"
                    >
                      Save Variant
                    </button>
                  </form>

                  <div className="pt-2 border-t border-[#D4A017]/30 flex flex-wrap gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#D4A017]/60 cursor-pointer hover:bg-[#F9F3E6]">
                      <Upload className="w-3.5 h-3.5 text-[#7A0E0E]" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUploadFiles(e.target.files, v, "primary")}
                      />
                    </label>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#D4A017]/60 cursor-pointer hover:bg-[#F9F3E6]">
                      <Upload className="w-3.5 h-3.5 text-[#F26500]" />
                      <span>Upload 360° Frames ({v.frames_360.length})</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleUploadFiles(e.target.files, v, "frames360")}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Variant */}
            <div className="parchment-card rounded-2xl p-5 space-y-3 text-xs">
              <h3 className="font-bold text-base text-[#7A0E0E]">Add Colour Variant</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  value={newVariantColor}
                  onChange={(e) => setNewVariantColor(e.target.value)}
                  placeholder="Colour Name (e.g. Black)"
                  className="px-3 py-2 rounded-lg bg-white border border-[#D4A017]/40"
                />
                <input
                  value={newVariantSku}
                  onChange={(e) => setNewVariantSku(e.target.value)}
                  placeholder="SKU (e.g. DHR-IRU-BLK-02)"
                  className="px-3 py-2 rounded-lg bg-white border border-[#D4A017]/40"
                />
                <input
                  value={newVariantMarking}
                  onChange={(e) => setNewVariantMarking(e.target.value)}
                  placeholder="Marking details"
                  className="px-3 py-2 rounded-lg bg-white border border-[#D4A017]/40"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newVariantHex}
                    onChange={(e) => setNewVariantHex(e.target.value)}
                    className="h-9 w-12 rounded cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newVariantColor) return;
                      runAction(
                        "create_variant",
                        {
                          product_id: product.id,
                          color_name: newVariantColor,
                          color_hex: newVariantHex,
                          sku: newVariantSku || `DHR-${Date.now()}`,
                          marking_description: newVariantMarking,
                          price: product.base_price,
                          stock: 50,
                          is_available: true,
                        },
                        `Added ${newVariantColor} variant`
                      );
                      setNewVariantColor("");
                      setNewVariantSku("");
                      setNewVariantMarking("");
                    }}
                    className="flex-1 py-2 rounded-full bg-[#F26500] text-white font-semibold"
                  >
                    Add Variant
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COLLECTIONS TAB */}
        {tab === "collections" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.collections.map((c) => (
                <div key={c.id} className="parchment-card rounded-2xl p-5 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif-display text-2xl font-bold text-[#5A2E0B]">
                      {c.name}
                    </h3>
                    {c.is_active === 1 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1F6F3D] text-white font-bold">
                        ACTIVE LIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[#7A0E0E] font-medium">{c.tagline}</p>
                  <p className="text-[#5A2E0B]/80">{c.description}</p>
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      disabled={c.is_active === 1}
                      onClick={() =>
                        runAction(
                          "activate_collection",
                          { id: c.id },
                          `Switched live homepage to ${c.name}`
                        )
                      }
                      className="px-4 py-2 rounded-full bg-[#F26500] disabled:bg-[#1F6F3D] text-white font-semibold"
                    >
                      {c.is_active === 1 ? "Currently Active" : "Activate on Homepage"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="parchment-card rounded-2xl p-5 space-y-3 text-xs">
              <h3 className="font-bold text-base text-[#7A0E0E]">Create New Collection</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  placeholder="Collection Name"
                  className="px-3 py-2 rounded-lg bg-white border border-[#D4A017]/40"
                />
                <input
                  value={newColSlug}
                  onChange={(e) => setNewColSlug(e.target.value)}
                  placeholder="Slug (e.g. saffron-edition)"
                  className="px-3 py-2 rounded-lg bg-white border border-[#D4A017]/40"
                />
                <input
                  value={newColTagline}
                  onChange={(e) => setNewColTagline(e.target.value)}
                  placeholder="Hero Tagline"
                  className="px-3 py-2 rounded-lg bg-white border border-[#D4A017]/40"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newColName) return;
                    runAction(
                      "create_collection",
                      { name: newColName, slug: newColSlug, tagline: newColTagline },
                      `Created ${newColName} collection`
                    );
                    setNewColName("");
                    setNewColSlug("");
                    setNewColTagline("");
                  }}
                  className="py-2 rounded-full bg-[#7A0E0E] text-white font-semibold"
                >
                  Create Collection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === "orders" && (
          <div className="space-y-3">
            {data.orders.length === 0 ? (
              <div className="parchment-card rounded-2xl p-8 text-center text-sm text-[#5A2E0B]/75">
                No orders placed yet.
              </div>
            ) : (
              data.orders.map((order) => (
                <div key={order.id} className="parchment-card rounded-2xl p-5 space-y-3 text-xs">
                  <div className="flex flex-wrap justify-between gap-2">
                    <div>
                      <p className="font-bold text-sm text-[#7A0E0E]">
                        {order.order_number} — ₹{order.total_amount}
                      </p>
                      <p className="text-[#5A2E0B]">
                        {order.customer_name} • {order.customer_mobile} • {order.city},{" "}
                        {order.state} ({order.pincode})
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#32170B] text-[#F9F3E6] h-fit">
                      {order.payment_method.toUpperCase()} ({order.payment_status})
                    </span>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      runAction(
                        "update_order",
                        {
                          id: order.id,
                          order_status: fd.get("order_status"),
                          payment_status: fd.get("payment_status"),
                          tracking_number: fd.get("tracking_number"),
                        },
                        `Updated ${order.order_number}`
                      );
                    }}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-[#D4A017]/30"
                  >
                    <select
                      name="order_status"
                      defaultValue={order.order_status}
                      className="px-3 py-2 rounded-lg bg-white border border-[#D4A017]/40"
                    >
                      {ORDER_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    <select
                      name="payment_status"
                      defaultValue={order.payment_status}
                      className="px-3 py-2 rounded-lg bg-white border border-[#D4A017]/40"
                    >
                      <option value="pending">pending</option>
                      <option value="verified">verified</option>
                      <option value="cod_authorised">cod_authorised</option>
                      <option value="failed">failed</option>
                    </select>
                    <input
                      name="tracking_number"
                      defaultValue={order.tracking_number || ""}
                      placeholder="Tracking Number"
                      className="px-3 py-2 rounded-lg bg-white border border-[#D4A017]/40"
                    />
                    <button
                      type="submit"
                      className="py-2 rounded-full bg-[#F26500] text-white font-semibold"
                    >
                      Update Order
                    </button>
                  </form>
                </div>
              ))
            )}
          </div>
        )}

        {/* SETTINGS & CONTENT TAB */}
        {tab === "settings" && (
          <div className="space-y-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const settingsObj: Record<string, string> = {};
                fd.forEach((v, k) => {
                  settingsObj[k] = String(v);
                });
                runAction(
                  "update_settings",
                  { settings: settingsObj },
                  "Website settings saved"
                );
              }}
              className="parchment-card rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"
            >
              <h2 className="md:col-span-2 font-serif-display text-2xl font-bold text-[#7A0E0E]">
                Storefront, Contact & Shipping Settings
              </h2>
              {[
                ["phone", "Phone Number"],
                ["whatsapp", "WhatsApp Number"],
                ["email", "Support Email"],
                ["shipping_fee", "Shipping Fee (₹)"],
                ["free_shipping_threshold", "Free Shipping Above (₹)"],
                ["cod_enabled", "COD Enabled (1 = Yes, 0 = No)"],
                ["hero_mantra", "Devotional Mantra Banner"],
                ["instagram_url", "Instagram URL"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="font-semibold block mb-1">{label}</label>
                  <input
                    name={key}
                    defaultValue={data.settings[key] || ""}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#D4A017]/40"
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="font-semibold block mb-1">Hero Heading</label>
                <textarea
                  name="hero_heading"
                  rows={2}
                  defaultValue={data.settings.hero_heading || ""}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#D4A017]/40"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#F26500] text-white font-semibold"
                >
                  Save Settings
                </button>
              </div>
            </form>

            {/* Add FAQ */}
            <div className="parchment-card rounded-2xl p-6 space-y-3 text-xs">
              <h3 className="font-bold text-base text-[#7A0E0E]">Add FAQ</h3>
              <input
                value={newFaqQ}
                onChange={(e) => setNewFaqQ(e.target.value)}
                placeholder="Question"
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#D4A017]/40"
              />
              <textarea
                rows={2}
                value={newFaqA}
                onChange={(e) => setNewFaqA(e.target.value)}
                placeholder="Answer"
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#D4A017]/40"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newFaqQ || !newFaqA) return;
                  runAction("save_faq", { question: newFaqQ, answer: newFaqA }, "FAQ added");
                  setNewFaqQ("");
                  setNewFaqA("");
                }}
                className="px-5 py-2 rounded-full bg-[#7A0E0E] text-white font-semibold"
              >
                Add FAQ
              </button>
            </div>
          </div>
        )}

        {/* CUSTOMERS & INQUIRIES TAB */}
        {tab === "customers" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            <div className="parchment-card rounded-2xl p-5 space-y-3">
              <h2 className="font-serif-display text-2xl font-bold text-[#7A0E0E]">
                Registered Users ({data.customers.length})
              </h2>
              {data.customers.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-white/75 border border-[#D4A017]/30 flex justify-between"
                >
                  <div>
                    <p className="font-bold text-[#5A2E0B]">{c.name}</p>
                    <p>
                      {c.email} {c.mobile ? `• ${c.mobile}` : ""}
                    </p>
                  </div>
                  <span className="uppercase font-semibold text-[#7A0E0E]">{c.role}</span>
                </div>
              ))}
            </div>

            <div className="parchment-card rounded-2xl p-5 space-y-3">
              <h2 className="font-serif-display text-2xl font-bold text-[#7A0E0E]">
                Contact & Wholesale Messages ({data.messages.length})
              </h2>
              {data.messages.length === 0 ? (
                <p className="text-[#5A2E0B]/70">No messages yet.</p>
              ) : (
                data.messages.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-white/75 border border-[#D4A017]/30 space-y-1"
                  >
                    <div className="flex justify-between">
                      <p className="font-bold text-[#5A2E0B]">{m.subject}</p>
                      {m.is_wholesale === 1 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#F26500] text-white text-[10px] font-bold">
                          WHOLESALE
                        </span>
                      )}
                    </div>
                    <p className="text-[#7A0E0E]">
                      {m.name} ({m.email} {m.mobile ? `• ${m.mobile}` : ""})
                    </p>
                    <p className="text-[#32170B]/85">{m.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
