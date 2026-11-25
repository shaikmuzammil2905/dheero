"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Check,
  Compass,
  Feather,
  Layers,
  Play,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { GoldOrnamentalDivider, Reveal } from "@/components/MotionPrimitives";
import { BrandStory30s } from "@/components/BrandStory30s";

const COMPARISON_ROWS = [
  {
    feature: "Product Identity",
    ordinary: "General-purpose cloth",
    dheero: "Dedicated devotional product",
  },
  {
    feature: "Design",
    ordinary: "Depends on available cloth",
    dheero: "Thoughtfully designed combinations",
  },
  {
    feature: "Colour Options",
    ordinary: "Depends on availability",
    dheero: "Signature selectable variants",
  },
  {
    feature: "Marking",
    ordinary: "Depends on cloth",
    dheero: "Distinctive devotional marking",
  },
  {
    feature: "Branding",
    ordinary: "Usually unbranded",
    dheero: "DHEERO™ identity",
  },
  {
    feature: "Presentation",
    ordinary: "Varies",
    dheero: "Thoughtful product presentation",
  },
];

const JOURNEY_STEPS = [
  {
    title: "The Hills & Forest Pathways",
    text: "Stepping onto the shaded trails of Sabarimala, every step carries quiet focus and discipline.",
    image: "/images/hero-sabarimala.jpg",
  },
  {
    title: "The Sacred Pamba & Preparation",
    text: "Preparing the Irumudi bundle with care, simplicity, and respect for time-honoured custom.",
    image: "/images/rumala-trio.jpg",
  },
  {
    title: "Walking Together in Faith",
    text: "Devotees supporting one another in unity, comfort, and shared devotion along the ascent.",
    image: "/images/login-bg.jpg",
  },
];

export default function HomePage() {
  const { activeCollection, products, settings } = useStore();
  const product = products[0];
  const variants = product?.variants || [];
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [storyModalOpen, setStoryModalOpen] = useState(false);

  const selectedVariant = variants[selectedIdx] || variants[0];
  const isDevotional = !activeCollection || activeCollection.slug === "devotional";

  const heroHeading =
    activeCollection?.slug === "devotional"
      ? settings.hero_heading || "A Journey of Faith.\nA Tradition of Devotion."
      : activeCollection?.tagline || "A Journey of Faith.\nA Tradition of Devotion.";

  const heroSub =
    activeCollection?.slug === "devotional"
      ? settings.hero_subheading ||
        "DHEERO™ – Thoughtfully designed essentials for the sacred journey."
      : activeCollection?.description ||
        "Thoughtfully designed headwear and lifestyle essentials.";

  return (
    <div className="overflow-hidden">
      {/* SECTION 2: CINEMATIC HERO */}
      <section className="relative min-h-[78vh] sm:min-h-[86vh] flex items-center justify-center overflow-hidden bg-[#1E1008]">
        {/* Mobile Hero Image (Bright Portrait Sabarimala View) */}
        <img
          src={
            activeCollection?.slug === "devotional"
              ? "/images/hero-sabarimala-mobile.jpg"
              : activeCollection?.hero_image || "/images/hero-sabarimala-mobile.jpg"
          }
          alt={activeCollection?.name || "Sabarimala Pilgrimage"}
          className="md:hidden absolute inset-0 w-full h-full object-cover object-center animate-hero-drift brightness-105"
        />
        {/* Desktop Hero Image (HD Widescreen Sabarimala View) */}
        <img
          src={
            activeCollection?.slug === "devotional"
              ? "/images/hero-sabarimala.png"
              : activeCollection?.hero_image || "/images/hero-sabarimala.png"
          }
          alt={activeCollection?.name || "Sabarimala Pilgrimage"}
          className="hidden md:block absolute inset-0 w-full h-full object-cover animate-hero-drift"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E1008]/25 via-[#32170B]/15 to-[#1E1008]/55 md:from-[#1E1008]/45 md:via-[#32170B]/20 md:to-[#1E1008]/65" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,23,11,0.34)_0%,transparent_64%)]" />

        {/* Subtle Saffron Flag Motion Accent */}
        <div className="hidden lg:block absolute top-10 left-10 pointer-events-none animate-flag-flutter opacity-90">
          <div className="px-4 py-1.5 rounded-full bg-[#32170B]/75 border border-[#D4A017]/70 text-[#F9F3E6] text-xs tracking-widest uppercase shadow-lg">
            {activeCollection?.name || "Devotional Collection"}
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 py-14">
          {/* Centered Transparent Logo with Soft Luminous Halo */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-block rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(255,250,235,0.92)_0%,rgba(255,250,235,0.45)_55%,transparent_78%)] px-8 py-3"
          >
            <img
              src="/images/dheero-logo.png"
              alt="DHEERO™"
              className="h-20 sm:h-24 w-auto mx-auto drop-shadow-[0_4px_14px_rgba(50,23,11,0.35)]"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12 }}
            className="font-serif-display text-4xl sm:text-6xl lg:text-7xl font-bold text-[#F9F3E6] leading-[1.08] drop-shadow-[0_4px_20px_rgba(0,0,0,0.65)] whitespace-pre-line"
          >
            {heroHeading}
          </motion.h1>

          <GoldOrnamentalDivider />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-base sm:text-xl text-[#F9F3E6]/95 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow"
          >
            {heroSub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#F26500] hover:bg-[#d85700] text-white font-semibold text-sm sm:text-base tracking-wide shadow-[0_10px_30px_rgba(242,101,0,0.45)] transition-transform hover:scale-105"
            >
              <span>
                {isDevotional ? "EXPLORE IRUMUDI RUMALA" : "EXPLORE COLLECTION"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => setStoryModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#32170B]/80 hover:bg-[#32170B] text-[#F9F3E6] border border-[#D4A017]/70 font-medium text-sm sm:text-base backdrop-blur-sm transition-colors"
            >
              <Play className="w-4 h-4 text-[#F26500]" />
              <span>Watch 30s Brand Story</span>
            </button>
          </motion.div>

          {isDevotional && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="pt-3"
            >
              <span className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#7A0E0E]/90 border border-[#D4A017]/70 text-[#F9F3E6] font-serif-display text-lg sm:text-xl tracking-wide shadow-lg">
                <span className="text-[#D4A017]">✦</span>
                {settings.hero_mantra || "Swamiye Saranam Ayyappa"}
                <span className="text-[#D4A017]">✦</span>
              </span>
            </motion.div>
          )}
        </div>
      </section>

      {/* 4 GRAND FEATURE HIGHLIGHTS STRIP */}
      <section className="parchment-surface border-b-2 border-[#D4A017]/45">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {[
              {
                icon: Layers,
                title: "Single Product Focus",
                sub: "Dedicated Irumudi Rumala crafted with purpose",
              },
              {
                icon: Award,
                title: "Traditional Quality",
                sub: "Thoughtful • Respectful • Neat Finish",
              },
              {
                icon: Compass,
                title: "For Your Sacred Journey",
                sub: "Designed for Sabarimala Pilgrims",
              },
              {
                icon: Truck,
                title: "Pan-India Delivery",
                sub: "Safe • Reliable • On Time Dispatch",
              },
            ].map((item, idx) => (
              <Reveal
                key={item.title}
                delay={idx * 0.08}
                className="parchment-card rounded-2xl p-6 flex items-center gap-4 border-2 border-[#D4A017]/50 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#7A0E0E] text-[#D4A017] flex items-center justify-center shrink-0 border border-[#D4A017]/60 shadow-md">
                  <item.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-serif-display font-bold text-xl sm:text-2xl text-[#5A2E0B] leading-tight">
                    {item.title}
                  </p>
                  <p className="text-xs sm:text-sm text-[#7A0E0E]/85 mt-1 font-medium">
                    {item.sub}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: PRODUCT INTRODUCTION */}
      <section className="py-16 sm:py-20 parchment-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <Reveal className="space-y-5">
              <span className="inline-block px-4 py-1 rounded-full bg-[#7A0E0E] text-[#F9F3E6] text-xs font-semibold uppercase tracking-[0.2em]">
                Introducing DHEERO™
              </span>
              <h2 className="font-serif-display text-3xl sm:text-5xl font-bold text-[#5A2E0B] leading-tight">
                More Than a Rumala. A Thoughtful Expression of Devotion.
              </h2>
              <p className="text-sm sm:text-base text-[#32170B]/85 leading-relaxed">
                Created for Ayyappa Swamy devotees who value comfort, neat presentation,
                and traditional inspiration, the DHEERO™ Irumudi Rumala brings dedicated
                product identity to a cherished pilgrimage essential.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  "Dedicated devotional product identity",
                  "Traditional-inspired colour combinations",
                  "Distinctive horizontal devotional markings",
                  "Comfort-focused breathable fabric",
                  "Thoughtful folding & presentation",
                  "Available in Retail & Wholesale",
                ].map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-sm text-[#5A2E0B]"
                  >
                    <Check className="w-4 h-4 text-[#F26500] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#7A0E0E] hover:bg-[#5f0a0a] text-[#F9F3E6] font-semibold text-sm shadow-lg transition-transform hover:scale-105"
                >
                  DISCOVER THE RUMALA <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4A017]/60 shadow-2xl">
                <img
                  src="/images/rumala-trio.jpg"
                  alt="DHEERO™ Irumudi Rumala Collection"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#32170B]/90 via-[#32170B]/40 to-transparent p-5 text-[#F9F3E6]">
                  <p className="font-serif-display text-xl font-bold">
                    Turmeric Yellow • Light Brown • Maroon Red
                  </p>
                  <p className="text-xs text-[#F9F3E6]/80">
                    Crafted with traditional borders and respectful devotional markings
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SECTION 4: SIGNATURE COLLECTION (SINGLE PRODUCT WITH SELECTABLE VARIANTS) */}
      {product && selectedVariant && (
        <section className="py-14 sm:py-20 bg-[#F4E9D5]/35 backdrop-blur-[1px] border-y border-[#D4A017]/35">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center max-w-2xl mx-auto space-y-2 mb-10">
              <GoldOrnamentalDivider label="Signature Launch" />
              <h2 className="font-serif-display text-3xl sm:text-5xl font-bold text-[#5A2E0B]">
                {product.name}
              </h2>
              <p className="text-sm sm:text-base text-[#5A2E0B]/80">
                Select a colour variant below to preview its photograph, devotional
                marking, and live availability.
              </p>
            </Reveal>

            <Reveal className="parchment-card rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative rounded-2xl overflow-hidden border border-[#D4A017]/50 aspect-square bg-[#1E1008]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedVariant.id}
                    src={selectedVariant.primary_image}
                    alt={`${product.name} - ${selectedVariant.color_name}`}
                    initial={{ opacity: 0.4, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.4 }}
                    transition={{ duration: 0.35 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#32170B]/85 text-[#F9F3E6] text-xs font-semibold border border-[#D4A017]/50">
                  SKU: {selectedVariant.sku}
                </span>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#7A0E0E] font-semibold">
                    {product.category} • {product.product_type}
                  </p>
                  <h3 className="font-serif-display text-3xl font-bold text-[#5A2E0B] mt-1">
                    {selectedVariant.color_name}
                  </h3>
                  <p className="text-sm text-[#7A0E0E] font-medium mt-1">
                    {selectedVariant.marking_description}
                  </p>
                </div>

                <p className="text-sm text-[#32170B]/85 leading-relaxed">
                  {product.description}
                </p>

                {/* Colour Variant Cards */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#5A2E0B]">
                    Choose Colour Variant
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {variants.map((variant, idx) => (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedIdx(idx)}
                        className={`p-2 rounded-xl border-2 text-left transition-all ${
                          idx === selectedIdx
                            ? "border-[#F26500] bg-white shadow-md"
                            : "border-[#D4A017]/35 bg-white/60 hover:bg-white"
                        }`}
                      >
                        <img
                          src={variant.primary_image}
                          alt={variant.color_name}
                          className="w-full aspect-square object-cover rounded-lg mb-1.5"
                        />
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded-full shrink-0 border border-black/20"
                            style={{ backgroundColor: variant.color_hex }}
                          />
                          <span className="text-[11px] font-semibold text-[#5A2E0B] truncate">
                            {variant.color_name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-3xl font-bold text-[#7A0E0E]">
                    ₹{selectedVariant.price}
                  </span>
                  {product.mrp_price > selectedVariant.price && (
                    <span className="text-base line-through text-[#5A2E0B]/50">
                      ₹{product.mrp_price}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-[#1F6F3D] bg-[#1F6F3D]/10 px-2.5 py-0.5 rounded-full">
                    {selectedVariant.stock > 0
                      ? `In Stock (${selectedVariant.stock} available)`
                      : "Out of Stock"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href={`/shop?variant=${selectedVariant.id}`}
                    className="flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#F26500] hover:bg-[#d85700] text-white font-semibold text-sm shadow-lg transition-transform hover:scale-[1.02]"
                  >
                    VIEW PRODUCT & 360° <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* SECTION 6: THE 30-SECOND DHEERO BRAND STORY */}
      <section className="py-16 sm:py-20 parchment-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Reveal className="text-center max-w-2xl mx-auto space-y-2">
            <GoldOrnamentalDivider label="Brand Storytelling" />
            <h2 className="font-serif-display text-3xl sm:text-5xl font-bold text-[#5A2E0B]">
              DHEERO — The Spirit of Courage Within You
            </h2>
            <p className="text-sm sm:text-base text-[#5A2E0B]/80">
              DHEER (courage) + HERO. Experience our 30-second visual journey from the
              quiet forest to the spirit of devotion.
            </p>
          </Reveal>
          <Reveal>
            <BrandStory30s />
          </Reveal>
        </div>
      </section>

      {/* SECTION 7: THE MEANING OF THE SACRED JOURNEY */}
      <section className="py-16 sm:py-20 bg-[#32170B] text-[#F9F3E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A017]">
              Pilgrimage Reflections
            </span>
            <h2 className="font-serif-display text-3xl sm:text-5xl font-bold text-[#F9F3E6]">
              Every Journey Begins With Faith.
            </h2>
            <p className="text-sm sm:text-base text-[#F9F3E6]/80">
              A journey shaped by devotion, discipline, simplicity and the spirit of
              togetherness.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {JOURNEY_STEPS.map((step, i) => (
              <Reveal
                key={step.title}
                delay={i * 0.12}
                className="rounded-2xl overflow-hidden bg-[#462110] border border-[#D4A017]/40 flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 space-y-2 flex-1">
                  <h3 className="font-serif-display text-2xl font-bold text-[#D4A017]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#F9F3E6]/85 leading-relaxed">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: WHY CHOOSE DHEERO? */}
      <section className="py-16 sm:py-20 parchment-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <GoldOrnamentalDivider label="Why DHEERO™" />
            <h2 className="font-serif-display text-3xl sm:text-5xl font-bold text-[#5A2E0B]">
              Thoughtful Craft in Every Detail
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Sparkles,
                title: "Thoughtful Design",
                desc: "Designed specifically as a devotional headwear essential rather than a generic piece of cloth.",
              },
              {
                icon: Award,
                title: "Traditional Inspiration",
                desc: "Colour tones and horizontal markings respectfully inspired by Gandham, Vibhuti, and Kumkum.",
              },
              {
                icon: Feather,
                title: "Comfort-Focused Fabric",
                desc: "Prioritising soft, breathable comfort suited for warm days and cool hill mornings.",
              },
              {
                icon: ShieldCheck,
                title: "Carefully Presented",
                desc: "Neatly folded, branded, and packaged with care for personal use or respectful gifting.",
              },
            ].map((card, i) => (
              <Reveal
                key={card.title}
                delay={i * 0.08}
                className="parchment-card rounded-2xl p-6 space-y-3 hover:-translate-y-1 transition-transform"
              >
                <div className="w-12 h-12 rounded-xl bg-[#7A0E0E] text-[#D4A017] flex items-center justify-center shadow">
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif-display text-2xl font-bold text-[#5A2E0B]">
                  {card.title}
                </h3>
                <p className="text-sm text-[#5A2E0B]/80 leading-relaxed">{card.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: ORDINARY RUMALA VS DHEERO RUMALA */}
      <section className="py-14 sm:py-20 bg-[#F4E9D5]/35 backdrop-blur-[1px] border-t border-[#D4A017]/35">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Reveal className="text-center space-y-2">
            <GoldOrnamentalDivider label="Comparison" />
            <h2 className="font-serif-display text-3xl sm:text-5xl font-bold text-[#5A2E0B]">
              Ordinary Rumala vs DHEERO™ Rumala
            </h2>
            <p className="text-sm text-[#5A2E0B]/80">
              A respectful comparison of product focus and presentation. Traditional cloth
              remains deeply respected; DHEERO™ simply offers a dedicated alternative.
            </p>
          </Reveal>

          <Reveal className="parchment-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#7A0E0E] text-[#F9F3E6]">
                    <th className="p-4 font-serif-display text-lg font-bold">Feature</th>
                    <th className="p-4 font-serif-display text-lg font-bold">
                      Ordinary / Unbranded Rumala
                    </th>
                    <th className="p-4 font-serif-display text-lg font-bold text-[#D4A017]">
                      DHEERO™ Irumudi Rumala
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4A017]/30 text-sm">
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.feature} className="hover:bg-white/50">
                      <td className="p-4 font-semibold text-[#5A2E0B]">{row.feature}</td>
                      <td className="p-4 text-[#5A2E0B]/75">{row.ordinary}</td>
                      <td className="p-4 font-semibold text-[#7A0E0E]">{row.dheero}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 30-Second Story Popup Modal */}
      <AnimatePresence>
        {storyModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setStoryModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl space-y-3"
            >
              <div className="flex items-center justify-between text-[#F9F3E6]">
                <p className="font-serif-display text-xl font-bold">
                  DHEERO™ — The Spirit of Courage Within You
                </p>
                <button
                  type="button"
                  onClick={() => setStoryModalOpen(false)}
                  aria-label="Close brand story popup"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <BrandStory30s onExplore={() => setStoryModalOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
