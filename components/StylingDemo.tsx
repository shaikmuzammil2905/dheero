"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

const STYLES = [
  {
    id: "traditional",
    title: "Traditional Head Covering",
    summary: "Balanced crown drape with devotional marking centered on the forehead.",
    image: "/images/rumala-turmeric.jpg",
    steps: [
      "Unfold the rumala cleanly and align the horizontal devotional marking at the front edge.",
      "Place evenly over the crown so both sides drape comfortably past the ears.",
      "Gather the ends neatly at the nape and secure with a gentle double-fold or knot.",
    ],
  },
  {
    id: "forehead",
    title: "Forehead-Style Wrapping",
    summary: "Streamlined wrap focusing on sweat absorption and steady grip while walking.",
    image: "/images/rumala-maroon.jpg",
    steps: [
      "Fold the rumala diagonally into a broad band.",
      "Center the devotional marking across the forehead.",
      "Wrap around the temples and tie comfortably at the back of the head.",
    ],
  },
  {
    id: "full-head",
    title: "Full-Head Coverage",
    summary: "Complete sun and dust protection for long forest treks and afternoon queues.",
    image: "/images/rumala-brown.jpg",
    steps: [
      "Spread the full cloth over the head with extra length toward the back.",
      "Tuck the front border cleanly above the brow line.",
      "Bring both side tails across the back and tuck securely for wind resistance.",
    ],
  },
  {
    id: "side-ear",
    title: "Side & Ear Coverage",
    summary: "Warmth and comfort during early morning hill ascents and cool breezes.",
    image: "/images/rumala-trio.jpg",
    steps: [
      "Drape the cloth slightly lower over both ears.",
      "Cross the ends beneath the occipital ridge without tight pressure.",
      "Tie softly at the back so the ears stay covered comfortably.",
    ],
  },
  {
    id: "folded",
    title: "Neatly Folded Traditional Appearance",
    summary: "Respectful shoulder drape or folded Irumudi presentation.",
    image: "/images/rumala-turmeric.jpg",
    steps: [
      "Fold lengthwise into thirds so the woven border and horizontal marking remain visible.",
      "Rest neatly over the shoulder or alongside your Irumudi essentials.",
      "Keep dry and clean until ready for wearing.",
    ],
  },
];

export function StylingDemo() {
  const [selectedId, setSelectedId] = useState(STYLES[0].id);
  const active = STYLES.find((s) => s.id === selectedId) || STYLES[0];

  return (
    <section className="parchment-card rounded-3xl p-6 sm:p-10 space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A0E0E]">
          Wearing & Styling Guide
        </span>
        <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#5A2E0B]">
          One Rumala. Different Ways to Wear.
        </h2>
        <p className="text-sm text-[#5A2E0B]/80">
          Explore practical, comfortable ways devotees wear and carry the DHEERO™ Irumudi
          Rumala throughout the pilgrimage.
        </p>
      </div>

      {/* Clickable Style Selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {STYLES.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => setSelectedId(style.id)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              selectedId === style.id
                ? "bg-[#7A0E0E] text-[#F9F3E6] shadow-md border border-[#D4A017]"
                : "bg-white/80 text-[#5A2E0B] border border-[#D4A017]/40 hover:bg-[#D4A017]/15"
            }`}
          >
            {style.title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2"
        >
          <div className="rounded-2xl overflow-hidden border border-[#D4A017]/50 aspect-[4/3] bg-[#32170B]/10">
            <img
              src={active.image}
              alt={active.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#7A0E0E]">
              {active.title}
            </h3>
            <p className="text-sm text-[#5A2E0B]/85">{active.summary}</p>
            <ol className="space-y-2.5">
              {active.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#32170B]">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-[#F26500] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#D4A017]/10 border border-[#D4A017]/35 text-xs text-[#5A2E0B]/85">
        <Info className="w-4 h-4 text-[#7A0E0E] shrink-0 mt-0.5" />
        <span>
          Note: These demonstrations are practical styling suggestions for comfort and neat
          presentation, not compulsory religious practices.
        </span>
      </div>
    </section>
  );
}
