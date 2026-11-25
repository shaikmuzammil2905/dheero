"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Layers,
  Palette,
  Scissors,
  Sparkles,
  Package,
  ArrowRight,
} from "lucide-react";
import { GoldOrnamentalDivider, Reveal } from "@/components/MotionPrimitives";
import { useStore } from "@/components/StoreProvider";

const CRAFT_PILLARS = [
  {
    icon: Sparkles,
    title: "1. Product Design",
    desc: "Proportionate sizing and balanced drape tailored specifically for Irumudi and head-covering styles.",
  },
  {
    icon: Layers,
    title: "2. Fabric Selection",
    desc: "Prioritising breathable, skin-friendly comfort suited for long pilgrimage walks and varied weather.",
  },
  {
    icon: Palette,
    title: "3. Colour Selection",
    desc: "Turmeric Yellow, Light Brown, and Maroon Red — selected with respect for traditional devotional palettes.",
  },
  {
    icon: Sparkles,
    title: "4. Marking Design",
    desc: "Distinctive horizontal devotional markings inspired by Kumkum and Gandham, applied with clean precision.",
  },
  {
    icon: Scissors,
    title: "5. Stitching & Finishing",
    desc: "Neat edge finishing and woven border alignment so the cloth sits comfortably without fraying.",
  },
  {
    icon: Package,
    title: "6. Folding, Packaging & QC",
    desc: "Each piece is inspected, neatly folded, and packed cleanly so it arrives pilgrimage-ready.",
  },
];

export default function CraftPage() {
  const { settings } = useStore();

  return (
    <div className="parchment-surface py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Reveal className="text-center max-w-3xl mx-auto space-y-3">
          <GoldOrnamentalDivider label="Our Craft" />
          <h1 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#5A2E0B]">
            Thoughtful Preparation at Every Step
          </h1>
          <p className="text-sm sm:text-base text-[#32170B]/85 leading-relaxed">
            {settings.craft_intro ||
              "Every DHEERO™ Irumudi Rumala is created with attention to proportion, breathable comfort, respectful devotional markings, and neat presentation."}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CRAFT_PILLARS.map((pillar, idx) => (
            <Reveal
              key={pillar.title}
              delay={idx * 0.07}
              className="parchment-card rounded-2xl p-6 space-y-3"
            >
              <div className="w-11 h-11 rounded-xl bg-[#7A0E0E] text-[#D4A017] flex items-center justify-center">
                <pillar.icon className="w-5 h-5" />
              </div>
              <h2 className="font-serif-display text-2xl font-bold text-[#5A2E0B]">
                {pillar.title}
              </h2>
              <p className="text-sm text-[#32170B]/85 leading-relaxed">{pillar.desc}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="parchment-card rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <img
            src="/images/rumala-trio.jpg"
            alt="DHEERO™ Craftsmanship"
            className="rounded-2xl border border-[#D4A017]/50 w-full object-cover aspect-[4/3]"
          />
          <div className="space-y-4">
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#7A0E0E]">
              Quality Checking & Honest Transparency
            </h2>
            <p className="text-sm text-[#32170B]/85 leading-relaxed">
              We believe trust comes from clarity. We never make unverified claims about
              certifications — instead, we focus on consistent stitching, clean folding,
              and honest product specifications updated directly as final fabric batches
              are confirmed.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1F6F3D]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Inspected before dispatch from Khammam, Telangana</span>
            </div>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F26500] hover:bg-[#d85700] text-white font-semibold text-sm shadow-lg"
              >
                Inspect Product & 360° View <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
