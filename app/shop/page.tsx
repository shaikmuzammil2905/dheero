"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  ChevronRight,
  Feather,
  Home,
  Minus,
  Plus,
  Ruler,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { Viewer360 } from "@/components/Viewer360";
import { StylingDemo } from "@/components/StylingDemo";
import { Reveal } from "@/components/MotionPrimitives";

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialVariantId = searchParams.get("variant");

  const { products, addToCart } = useStore();
  const product = products[0];
  const variants = product?.variants || [];

  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!variants.length) return;
    if (initialVariantId && variants.some((v) => v.id === initialVariantId)) {
      setSelectedVariantId(initialVariantId);
    } else if (!selectedVariantId) {
      setSelectedVariantId(variants[0].id);
    }
  }, [variants, initialVariantId, selectedVariantId]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#D4A017] border-t-[#7A0E0E] animate-spin mx-auto" />
        <p className="text-[#5A2E0B] font-medium">Loading DHEERO™ Irumudi Rumala...</p>
      </div>
    );
  }

  const activeVariant =
    variants.find((v) => v.id === selectedVariantId) || variants[0];

  const handleAddToCart = () => {
    if (!activeVariant) return;
    addToCart({
      productId: product.id,
      productName: product.name,
      variantId: activeVariant.id,
      colorName: activeVariant.color_name,
      colorHex: activeVariant.color_hex,
      sku: activeVariant.sku,
      price: activeVariant.price,
      image: activeVariant.primary_image,
      quantity,
    });
  };

  const handleBuyNow = () => {
    if (!activeVariant) return;
    addToCart({
      productId: product.id,
      productName: product.name,
      variantId: activeVariant.id,
      colorName: activeVariant.color_name,
      colorHex: activeVariant.color_hex,
      sku: activeVariant.sku,
      price: activeVariant.price,
      image: activeVariant.primary_image,
      quantity,
    });
    router.push("/checkout");
  };

  const discountPct =
    product.mrp_price > activeVariant.price
      ? Math.round(((product.mrp_price - activeVariant.price) / product.mrp_price) * 100)
      : 0;

  return (
    <div className="parchment-surface py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#5A2E0B]/75">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-[#7A0E0E]">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-[#7A0E0E]">{product.name}</span>
        </nav>

        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Interactive Gallery & 360 Viewer */}
          <div className="lg:col-span-6">
            <Viewer360
              frames360={activeVariant.frames_360}
              galleryImages={
                activeVariant.gallery_images.length
                  ? activeVariant.gallery_images
                  : [activeVariant.primary_image]
              }
              productName={product.name}
              colorName={activeVariant.color_name}
            />
          </div>

          {/* Right: Product Information & Purchase Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#7A0E0E] text-[#F9F3E6] text-[11px] font-semibold uppercase tracking-wider">
                  {product.product_type}
                </span>
                <span className="text-xs text-[#5A2E0B]/70 font-medium">
                  SKU: {activeVariant.sku}
                </span>
              </div>
              <h1 className="font-serif-display text-3xl sm:text-5xl font-bold text-[#5A2E0B]">
                {product.name}
              </h1>
              <p className="text-sm sm:text-base text-[#32170B]/85 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price Block */}
            <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-[#D4A017]/35">
              <span className="text-3xl sm:text-4xl font-bold text-[#7A0E0E]">
                ₹{activeVariant.price}
              </span>
              {product.mrp_price > activeVariant.price && (
                <span className="text-lg line-through text-[#5A2E0B]/50">
                  ₹{product.mrp_price}
                </span>
              )}
              {discountPct > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#7A0E0E] text-white text-xs font-bold">
                  {discountPct}% OFF
                </span>
              )}
              <span className="ml-auto text-xs font-semibold text-[#1F6F3D]">
                {activeVariant.stock > 0
                  ? `In Stock (${activeVariant.stock} units)`
                  : "Currently Out of Stock"}
              </span>
            </div>

            {/* Colour Variant Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#5A2E0B]">
                  Select Colour:{" "}
                  <span className="text-[#7A0E0E]">{activeVariant.color_name}</span>
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {variants.map((variant) => {
                  const selected = variant.id === activeVariant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`relative p-2 rounded-2xl border-2 text-left transition-all ${
                        selected
                          ? "border-[#F26500] bg-white shadow-md"
                          : "border-[#D4A017]/40 bg-white/70 hover:bg-white"
                      }`}
                    >
                      {selected && (
                        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#F26500] text-white flex items-center justify-center shadow">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                      <img
                        src={variant.primary_image}
                        alt={variant.color_name}
                        className="w-full aspect-square object-cover rounded-xl mb-2"
                      />
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 border border-black/20"
                          style={{ backgroundColor: variant.color_hex }}
                        />
                        <span className="text-xs font-semibold text-[#5A2E0B] truncate">
                          {variant.color_name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-[#7A0E0E] font-medium bg-[#D4A017]/15 px-3 py-2 rounded-xl border border-[#D4A017]/30">
                Devotional Marking: {activeVariant.marking_description}
              </p>
            </div>

            {/* Quantity & Purchase Buttons */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#5A2E0B]">Quantity:</span>
                <div className="inline-flex items-center rounded-xl border border-[#D4A017]/60 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 text-[#5A2E0B] hover:bg-[#F9F3E6]"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(activeVariant.stock || 50, q + 1))
                    }
                    className="p-2.5 text-[#5A2E0B] hover:bg-[#F9F3E6]"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={activeVariant.stock <= 0}
                  onClick={handleAddToCart}
                  className="py-4 px-6 rounded-full bg-[#7A0E0E] hover:bg-[#5f0a0a] disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  ADD TO CART
                </button>
                <button
                  type="button"
                  disabled={activeVariant.stock <= 0}
                  onClick={handleBuyNow}
                  className="py-4 px-6 rounded-full bg-[#F26500] hover:bg-[#d85700] disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01]"
                >
                  <Zap className="w-4 h-4" />
                  BUY NOW
                </button>
              </div>
            </div>

            {/* Fabric, Dimensions & Care Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white/75 border border-[#D4A017]/40 space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#7A0E0E] flex items-center gap-1.5">
                  <Feather className="w-3.5 h-3.5" /> Fabric & Comfort
                </p>
                <p className="text-xs text-[#32170B]/85 leading-relaxed">
                  {product.fabric_summary}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/75 border border-[#D4A017]/40 space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#7A0E0E] flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5" /> Size & Weight
                </p>
                <p className="text-xs text-[#32170B]/85 leading-relaxed">
                  Size: {product.dimensions}
                  <br />
                  Weight: {product.weight}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/75 border border-[#D4A017]/40 space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7A0E0E] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Care Information
              </p>
              <p className="text-xs text-[#32170B]/85 leading-relaxed">
                {product.care_instructions}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              {[
                { icon: Truck, label: "Fast Dispatch" },
                { icon: ShieldCheck, label: "Secure Checkout" },
                { icon: Sparkles, label: "Wholesale Ready" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="p-2.5 rounded-xl bg-[#7A0E0E]/5 border border-[#D4A017]/30 flex flex-col items-center gap-1"
                >
                  <b.icon className="w-4 h-4 text-[#7A0E0E]" />
                  <span className="text-[11px] font-medium text-[#5A2E0B]">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Styling & Wearing Demonstration Section */}
        <Reveal>
          <StylingDemo />
        </Reveal>

        {/* Scroll Section 3: Signature Heritage Details & Packaging */}
        <Reveal className="parchment-card rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A0E0E]">
              Inside Every DHEERO™ Pack
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#5A2E0B]">
              Designed for Devotional Dignity & Comfort
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: "Dedicated Identity",
                desc: "Crafted specifically as a Sabarimala Irumudi Rumala rather than generic multi-purpose cloth.",
              },
              {
                title: "Traditional Markings",
                desc: "Turmeric Yellow features Red Kumkum-inspired marking; Maroon Red features Yellow Gandham-inspired marking.",
              },
              {
                title: "Woven Border Finish",
                desc: "Neat traditional border detailing that frames the drape cleanly in every wearing style.",
              },
              {
                title: "Pilgrimage Packaging",
                desc: "Individually folded, quality-checked, and packed cleanly for personal use or gifting.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-2xl bg-white/80 border border-[#D4A017]/40 space-y-2"
              >
                <h3 className="font-serif-display text-2xl font-bold text-[#7A0E0E]">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#32170B]/85 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Scroll Section 4: Pilgrimage Care & Colour Selection Guide */}
        <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="rounded-3xl overflow-hidden border-2 border-[#D4A017]/50 shadow-xl">
            <img
              src="/images/rumala-trio.jpg"
              alt="DHEERO™ Irumudi Rumala Trio"
              className="w-full h-full object-cover aspect-[4/3]"
            />
          </div>
          <div className="parchment-card rounded-3xl p-6 sm:p-9 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A0E0E]">
              Choosing & Caring
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#5A2E0B]">
              Built for Long Trails & Gentle Care
            </h2>
            <p className="text-sm text-[#32170B]/85 leading-relaxed">
              Whether you choose Turmeric Yellow, Light Brown, or Maroon Red, every
              DHEERO™ Irumudi Rumala is finished for comfortable breathability during
              forest walks and temple queues.
            </p>
            <ul className="space-y-2 text-sm text-[#5A2E0B]">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#F26500] shrink-0 mt-0.5" />
                <span>Gentle hand wash with mild detergent keeps colours vibrant</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#F26500] shrink-0 mt-0.5" />
                <span>Dry in shade and iron on low heat to preserve woven borders</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#F26500] shrink-0 mt-0.5" />
                <span>Fold neatly along the border lines for compact Irumudi packing</span>
              </li>
            </ul>
          </div>
        </Reveal>

        {/* Scroll Section 5: Wholesale Mandali & FAQ CTA */}
        <Reveal className="rounded-3xl bg-[#7A0E0E] text-[#F9F3E6] border-2 border-[#D4A017]/70 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A017]">
              Retail & Wholesale Support
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold">
              Ordering for a Mandali Group or Devotional Store?
            </h2>
            <p className="text-sm text-[#F9F3E6]/85">
              Dheer Eco Essentials fulfils both single-piece retail orders and bulk
              pilgrimage group requirements across India.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-[#F26500] hover:bg-[#d85700] text-white font-semibold text-sm shadow-lg"
            >
              Bulk / Wholesale Inquiry
            </Link>
            <Link
              href="/faq"
              className="px-6 py-3 rounded-full border border-[#D4A017] text-[#F9F3E6] font-semibold text-sm hover:bg-white/10"
            >
              Read FAQs
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#5A2E0B]">
          Loading DHEERO™ Shop...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
