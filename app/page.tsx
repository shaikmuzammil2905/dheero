"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/MotionPrimitives";
import { playTempleGhanta } from "@/lib/sound";

export default function HomePage() {
  return (
    <div className="bg-[#F8F3E8] text-[#29231D] overflow-hidden">
      {/* HERO SECTION – MINIMAL, DEVOTIONAL, CINEMATIC */}
      <section className="relative min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex items-center bg-[#F8F3E8] py-8 md:py-12">
        {/* Subtle Golden Light Aura */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_45%,rgba(198,160,74,0.20)_0%,rgba(248,243,232,0)_60%)] animate-gold-aura"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Golden Ayyappa Swamy + Red Headscarf Visual (Top on Mobile, Right on Desktop) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6 lg:order-2 flex justify-center"
            >
              <div className="relative w-full max-w-md lg:max-w-lg rounded-3xl overflow-hidden border border-[#C6A04A]/50 shadow-[0_24px_60px_-18px_rgba(84,29,37,0.28)] bg-[#EFE6D5]">
                <img
                  src="/images/ayyappa-hero.png"
                  alt="Lord Ayyappa Swamy in golden tone carrying Irumudi with red DHEERO headscarf"
                  className="w-full h-auto object-cover"
                />
                {/* Subtle golden rim highlight */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#C6A04A]/45 rounded-3xl"
                />
              </div>
            </motion.div>

            {/* Minimal Brand, Product Identification & Telugu Caption */}
            <div className="lg:col-span-6 lg:order-1 text-center lg:text-left space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.65 }}
                className="flex flex-col items-center lg:items-start gap-2"
              >
                <img
                  src="/images/dheero-logo.png"
                  alt="DHEERO"
                  className="h-14 sm:h-16 w-auto object-contain"
                />
                <span className="font-telugu text-sm sm:text-base font-semibold tracking-wider text-[#541D25]">
                  ఇరుముడి రుమాలు
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.95 }}
                className="font-telugu text-3xl sm:text-5xl lg:text-[3.25rem] font-bold text-[#29231D] leading-[1.32]"
              >
                ఇరుముడి కట్టు శబరిమల ఎక్కువ
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.25 }}
                className="pt-2"
              >
                <Link
                  href="/shop"
                  onClick={() => playTempleGhanta()}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#541D25] hover:bg-[#3f141b] text-[#F8F3E8] text-sm font-semibold tracking-wide shadow-md transition-transform hover:scale-[1.02]"
                >
                  <span>Explore ఇరుముడి రుమాలు</span>
                  <ArrowRight className="w-4 h-4 text-[#C6A04A]" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* STORYTELLING CHAPTERS */}
      <div id="our-story" className="scroll-mt-20">
        {/* CHAPTER 1 – THE DEVOTIONAL JOURNEY */}
        <section className="py-12 sm:py-16 bg-[#EFE6D5]/65 border-t border-[#C6A04A]/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <Reveal className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-3xl overflow-hidden border border-[#C6A04A]/50 shadow-xl bg-[#F8F3E8]">
                <img
                  src="/images/ayyappa-tiger.png"
                  alt="Lord Ayyappa Swamy seated majestically"
                  className="w-full h-auto object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-7 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#96752D]">
                Chapter I • The Devotional Journey
              </span>
              <h2 className="font-telugu text-2xl sm:text-4xl font-bold text-[#541D25] leading-snug">
                ప్రతి అడుగులో భక్తి. ప్రతి స్పర్శలో పవిత్రత.
              </h2>
              <p className="text-sm sm:text-base text-[#29231D]/85 leading-relaxed">
                The Irumudi journey is far more than a physical trek. It is a path of
                devotion, self-discipline, and quiet surrender — where every essential
                carried or worn on the journey deserves care, cleanliness, and respect.
              </p>
            </Reveal>
          </div>
        </section>

        {/* CHAPTER 2 – WHY DHEERO? */}
        <section className="py-12 sm:py-16 bg-[#F8F3E8] border-t border-[#C6A04A]/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <Reveal className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#96752D]">
                Chapter II • Why DHEERO
              </span>
              <h2 className="font-telugu text-2xl sm:text-4xl font-bold text-[#541D25] leading-snug">
                మీ యాత్రలో పరిశుభ్రతకు ఒక సహజమైన తోడు.
              </h2>
              <p className="text-sm sm:text-base text-[#29231D]/80 leading-relaxed">
                During long pilgrimage walks, devotees naturally experience perspiration,
                continuous cloth-to-skin contact, and discomfort from ordinary fabrics.
                DHEERO introduces a thoughtfully crafted, naturally dyed, herbal-inspired
                cloth designed to stay comfortable, breathable, and reusable throughout
                your yatra.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {[
                {
                  title: "Sweat Comfort",
                  desc: "Breathable cotton weave suited for warm walks and hill ascents.",
                },
                {
                  title: "Gentle Skin Contact",
                  desc: "Soft finishing made for extended wear around the forehead and head.",
                },
                {
                  title: "Clean & Reusable",
                  desc: "Designed to wash easily and accompany you beyond a single journey.",
                },
                {
                  title: "Respectful Identity",
                  desc: "A meaningful part of your devotional journey, crafted with dignity.",
                },
              ].map((item, idx) => (
                <Reveal
                  key={item.title}
                  delay={idx * 0.06}
                  className="ivory-card rounded-2xl p-5 space-y-1.5"
                >
                  <h3 className="font-serif-display text-xl font-bold text-[#541D25]">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#29231D]/80 leading-relaxed">
                    {item.desc}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CHAPTER 3 – THE NATURAL FABRIC & WOVEN DHEERO LABEL */}
        <section className="py-12 sm:py-16 bg-[#EFE6D5]/70 border-t border-[#C6A04A]/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <Reveal className="lg:col-span-6 space-y-5">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#96752D]">
                Chapter III • The Natural Fabric
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#541D25]">
                Natural Dye Concept & Thoughtful Textile Craft
              </h2>
              <p className="text-sm sm:text-base text-[#29231D]/85 leading-relaxed">
                Every DHEERO ఇరుముడి రుమాలు is conceived around natural-dye and
                herbal-infused textile principles — prioritising breathable comfort,
                clean finishing, and multipurpose everyday reusability.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-[#29231D]">
                {[
                  "Natural dye-inspired palette",
                  "Herbal-infused textile concept",
                  "Comfortable skin contact",
                  "Reusable & multipurpose design",
                ].map((pt) => (
                  <li key={pt} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#C8242C] shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <Link
                  href="/shop"
                  onClick={() => playTempleGhanta()}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C8242C] hover:bg-[#a91c23] text-white text-sm font-semibold shadow-md transition-transform hover:scale-[1.02]"
                >
                  <span>Inspect Product in 360°</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>

            {/* Macro Woven Cotton & Stitched DHEERO Label (inspired by reference) */}
            <Reveal delay={0.1} className="lg:col-span-6 space-y-4">
              <div className="rounded-3xl overflow-hidden border border-[#C6A04A]/60 shadow-xl woven-cotton-texture p-8 sm:p-12">
                <div className="border-t-2 border-b-2 border-dashed border-[#96752D]/35 py-8 flex items-center justify-center">
                  <div className="woven-cotton-texture px-8 sm:px-12 py-5 rounded-md shadow-[0_8px_22px_rgba(41,35,29,0.22)] border border-[#C6A04A]/50 text-center">
                    <span className="font-serif-display text-3xl sm:text-4xl font-bold tracking-[0.14em] text-[#29231D]">
                      DHEERO<sup className="text-sm ml-0.5">™</sup>
                    </span>
                  </div>
                </div>
                <p className="text-center text-xs text-[#541D25]/80 mt-4 font-medium">
                  Macro view — woven cotton texture & stitched DHEERO™ label
                </p>
              </div>

              {/* Subtle Future Architecture Note */}
              <div className="px-4 py-3 rounded-2xl bg-[#F8F3E8]/85 border border-[#C6A04A]/35 text-xs text-[#29231D]/75 text-center">
                Future-ready parent architecture for{" "}
                <strong className="text-[#541D25]">DHEERO Lifestyle Essentials</strong>{" "}
                (headwear, sweat-management, and travel textiles).
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  );
}
