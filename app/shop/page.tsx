"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Eye, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { Viewer360 } from "@/components/Viewer360";
import { playTempleGhanta } from "@/lib/sound";

const BENEFITS = [
  "Natural dye-inspired fabric.",
  "Herbal-infused textile concept.",
  "Designed for comfortable skin contact.",
  "Reusable and multipurpose.",
  "Suitable for the devotional journey.",
  "Thoughtfully designed for everyday use.",
];

function ProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialVariantId = searchParams.get("variant");

  const { products, addToCart } = useStore();
  const product = products[0];
  const variants = product?.variants || [];

  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [wearingOpen, setWearingOpen] = useState(false);

  useEffect(() => {
    if (!variants.length) return;
    if (initialVariantId && variants.some((v) => v.id === initialVariantId)) {
      setSelectedVariantId(initialVariantId);
    } else if (!selectedVariantId) {
      setSelectedVariantId(variants[0].id);
    }
  }, [variants, initialVariantId, selectedVariantId]);

  const activeVariant =
    variants.find((v) => v.id === selectedVariantId) || variants[0];

  if (!product || !activeVariant) {
    return null;
  }

  const isYellow = activeVariant.color_name.toLowerCase().includes("yellow");
  const wearingImage = isYellow ? "/images/wear-yellow.png" : "/images/wear-red.png";

  const handleAddToCart = () => {
    playTempleGhanta();
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
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 4000);
  };

  return (
    <div className="bg-[#F8F3E8] py-8 sm:py-12 min-h-[82vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Centerpiece 360° Product Viewer + "See how it looks on you." */}
          <div className="lg:col-span-6 space-y-3">
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

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  playTempleGhanta();
                  setWearingOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#541D25] underline decoration-[#C6A04A] underline-offset-4 hover:text-[#C8242C] transition-colors"
              >
                <Eye className="w-4 h-4 text-[#C8242C]" />
                See how it looks on you.
              </button>
              <span className="text-xs text-[#29231D]/65">
                SKU: {activeVariant.sku}
              </span>
            </div>
          </div>

          {/* Right: Essential Product Details & Add to Cart */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2 border-b border-[#C6A04A]/35 pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#96752D]">
                Devotional Headwear
              </p>
              <h1 className="font-serif-display text-3xl sm:text-5xl font-bold text-[#541D25]">
                {product.name}
              </h1>
              <p className="text-sm sm:text-base text-[#29231D]/85 leading-relaxed">
                {product.description}
              </p>
              <p className="text-3xl font-bold text-[#29231D] pt-2">
                ₹{activeVariant.price}
              </p>
            </div>

            {/* Color Selection (Red & Yellow) */}
            <div className="space-y-2.5">
              <p className="text-sm font-semibold text-[#29231D]">
                Color:{" "}
                <span className="text-[#541D25]">{activeVariant.color_name}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {variants.map((variant) => {
                  const selected = variant.id === activeVariant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => {
                        playTempleGhanta();
                        setSelectedVariantId(variant.id);
                      }}
                      className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-all ${
                        selected
                          ? "border-[#541D25] bg-[#EFE6D5] text-[#541D25] shadow-sm"
                          : "border-[#C6A04A]/45 bg-white/70 text-[#29231D] hover:bg-white"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/20"
                        style={{ backgroundColor: variant.color_hex }}
                      />
                      <span>{variant.color_name}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-[#29231D]/75">
                {activeVariant.marking_description}
              </p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#29231D]">Quantity:</span>
                <div className="inline-flex items-center rounded-full border border-[#C6A04A]/60 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="p-2.5 text-[#541D25]"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(activeVariant.stock || 50, q + 1))
                    }
                    aria-label="Increase quantity"
                    className="p-2.5 text-[#541D25]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-4 px-7 rounded-full bg-[#C8242C] hover:bg-[#a91c23] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart();
                    router.push("/cart");
                  }}
                  className="py-4 px-7 rounded-full border-2 border-[#541D25] text-[#541D25] hover:bg-[#541D25] hover:text-[#F8F3E8] font-semibold text-sm transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>

              {addedFeedback && (
                <div className="p-3 rounded-2xl bg-[#EFE6D5] border border-[#C6A04A]/60 text-xs text-[#541D25] flex items-center justify-between gap-2">
                  <span>
                    Added <strong>{activeVariant.color_name}</strong> ({quantity}) to your
                    cart.
                  </span>
                  <Link href="/cart" className="font-bold text-[#C8242C] underline">
                    Go to Cart →
                  </Link>
                </div>
              )}
            </div>

            {/* Product Benefits (6 concise points) */}
            <div className="ivory-card rounded-2xl p-5 space-y-2.5">
              <h2 className="font-serif-display text-2xl font-bold text-[#541D25]">
                Key Highlights
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#29231D]">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#C8242C] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Essential Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#29231D]/85">
              <div className="p-4 rounded-2xl bg-[#EFE6D5]/60 border border-[#C6A04A]/35 space-y-1">
                <p className="font-bold text-[#541D25]">Care Instructions</p>
                <p>{product.care_instructions}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#EFE6D5]/60 border border-[#C6A04A]/35 space-y-1">
                <p className="font-bold text-[#541D25]">Delivery Information</p>
                <p>Dispatched in 1–2 business days • Pan-India delivery in 3–6 days.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "See how it looks on you." Interactive Panel */}
      <AnimatePresence>
        {wearingOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#29231D]/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setWearingOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl ivory-card rounded-3xl p-5 sm:p-7 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#C6A04A]/35 pb-3">
                <div>
                  <h3 className="font-serif-display text-2xl font-bold text-[#541D25]">
                    How It Looks When Worn — {activeVariant.color_name}
                  </h3>
                  <p className="text-xs text-[#29231D]/75">
                    Switch colours below to preview Red or Yellow on the pilgrimage trail
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWearingOpen(false)}
                  aria-label="Close wearing preview"
                  className="p-2 rounded-full bg-[#541D25]/10 text-[#541D25]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden border border-[#C6A04A]/50 aspect-square bg-[#EFE6D5]">
                <img
                  src={wearingImage}
                  alt={`Devotee wearing DHEERO ${activeVariant.color_name} Irumudi Rumalu`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-center gap-3">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      playTempleGhanta();
                      setSelectedVariantId(v.id);
                    }}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full border-2 text-xs font-semibold ${
                      v.id === activeVariant.id
                        ? "border-[#541D25] bg-[#541D25] text-[#F8F3E8]"
                        : "border-[#C6A04A]/50 bg-white text-[#29231D]"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-white/40"
                      style={{ backgroundColor: v.color_hex }}
                    />
                    {v.color_name}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ProductContent />
    </Suspense>
  );
}
