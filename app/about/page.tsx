"use client";

import React from "react";
import Link from "next/link";
import { Compass, Feather, HeartHandshake, Leaf, Sparkles, ArrowRight } from "lucide-react";
import { GoldOrnamentalDivider, Reveal } from "@/components/MotionPrimitives";
import { useStore } from "@/components/StoreProvider";

const STORY_CARDS = [
  {
    icon: Leaf,
    title: "OUR STORY",
    body: "Born from an appreciation of Indian spiritual and cultural traditions, DHEERO aims to create thoughtfully designed headwear for diverse identities.",
  },
  {
    icon: Compass,
    title: "OUR APPROACH",
    body: "We focus on product functionality, practical design, comfort and thoughtful presentation.",
  },
  {
    icon: Feather,
    title: "COMFORT AND CRAFT",
    body: "We prioritise carefully selected materials, comfortable finishing and useful design.",
  },
  {
    icon: HeartHandshake,
    title: "RESPECT FOR TRADITION",
    body: "We respect the diverse traditions, customs and sentiments associated with Indian culture.",
  },
];

export default function AboutPage() {
  const { settings } = useStore();

  return (
    <div className="parchment-surface">
      {/* Sabarimala Pilgrimage Hero (Reference 3 & 8) */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-[#2A1409]">
        <img
          src="/images/hero-sabarimala.jpg"
          alt="Sabarimala Pilgrimage"
          className="absolute inset-0 w-full h-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E1008]/70 via-[#32170B]/55 to-[#F9F3E6]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="inline-block px-5 py-1.5 rounded-full bg-[#7A0E0E] text-[#F9F3E6] text-xs font-semibold tracking-[0.2em] uppercase border border-[#D4A017]/60">
            About Us
          </span>
          <h1 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#F9F3E6] drop-shadow-lg">
            A Journey of Faith.
            <br />A Tradition of Devotion.
          </h1>
          <p className="text-sm sm:text-lg text-[#F9F3E6]/90 max-w-2xl mx-auto leading-relaxed">
            {settings.about_intro ||
              "DHEERO™ is a genuine Indian brand dedicated to thoughtfully designed headwear inspired by Indian tradition, comfort and contemporary lifestyle."}
          </p>
        </div>
      </section>

      {/* Four Story Cards */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GoldOrnamentalDivider label="Our Ethos" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {STORY_CARDS.map((card, idx) => (
            <Reveal
              key={card.title}
              delay={idx * 0.08}
              className="parchment-card rounded-2xl p-6 text-center space-y-4"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-[#7A0E0E] text-[#D4A017] flex items-center justify-center border-2 border-[#D4A017]/60 shadow">
                <card.icon className="w-6 h-6" />
              </div>
              <h2 className="font-serif-display text-2xl font-bold text-[#5A2E0B]">
                {card.title}
              </h2>
              <p className="text-sm text-[#32170B]/85 leading-relaxed">{card.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What We Offer Banner (Reference 8) */}
      <section className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="rounded-3xl bg-[#7A0E0E] text-[#F9F3E6] border-2 border-[#D4A017]/70 p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-2xl">
          <div className="md:col-span-5">
            <img
              src="/images/rumala-trio.jpg"
              alt="DHEERO™ Irumudi Rumala"
              className="rounded-2xl border border-[#D4A017]/50 w-full object-cover aspect-[4/3]"
            />
          </div>
          <div className="md:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#D4A017]">
              <Sparkles className="w-4 h-4" /> What We Offer
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold">
              DHEERO™ Irumudi Rumala
            </h2>
            <p className="text-sm sm:text-base text-[#F9F3E6]/90 leading-relaxed">
              Our first launch collection is dedicated to Ayyappa Swamy devotees who value
              a dedicated, comfortable, and well-presented rumala for their sacred Irumudi
              journey — with a scalable brand vision extending to heritage, biker, sports,
              and everyday lifestyle headwear.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F26500] hover:bg-[#d85700] text-white font-semibold text-sm shadow-lg"
            >
              Explore Irumudi Rumala <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Vision & Important Note */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Reveal className="parchment-card rounded-2xl p-6 sm:p-8 text-center space-y-3">
          <h3 className="font-serif-display text-3xl font-bold text-[#5A2E0B]">
            Our Vision
          </h3>
          <p className="text-sm sm:text-base text-[#32170B]/85 max-w-2xl mx-auto leading-relaxed">
            To become a trusted Indian headwear and scarf brand under{" "}
            <strong>Dheer Eco Essentials</strong>, serving devotees, heritage enthusiasts,
            riders, and athletes with authenticity and care. Physical retail presence is
            planned for 2027.
          </p>
          <p className="text-xs text-[#7A0E0E] pt-2">
            Disclaimer: DHEERO™ is an independent brand and is not officially affiliated
            with or endorsed by the Sabarimala temple or its administration.
          </p>
        </Reveal>

        {/* Scroll Section 5: Scalable Brand Architecture & Future Collections */}
        <Reveal className="parchment-card rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A0E0E]">
              Built for 365 Days & Beyond
            </span>
            <h3 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#5A2E0B]">
              One Parent Brand. Diverse Cultural Expressions.
            </h3>
            <p className="text-sm text-[#32170B]/80">
              While our inaugural launch is dedicated exclusively to Ayyappa devotees,
              DHEERO™ is architected to grow thoughtfully across Indian headwear traditions.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            {[
              { title: "Devotional", status: "Active Launch", desc: "Sabarimala Irumudi Rumala & pilgrimage essentials." },
              { title: "Heritage Scarves", status: "Future Roadmap", desc: "Traditional Indian weaves & cultural motifs." },
              { title: "Biker & Rider", status: "Future Roadmap", desc: "Helmet-compatible bandanas for road comfort." },
              { title: "Sports & Lifestyle", status: "Future Roadmap", desc: "Breathable everyday wraps & athletic headwear." },
            ].map((col) => (
              <div
                key={col.title}
                className="p-4 rounded-2xl bg-white/80 border border-[#D4A017]/40 space-y-1.5"
              >
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#7A0E0E]/10 text-[#7A0E0E] text-[10px] font-bold uppercase">
                  {col.status}
                </span>
                <h4 className="font-serif-display text-xl font-bold text-[#5A2E0B]">
                  {col.title}
                </h4>
                <p className="text-xs text-[#32170B]/80">{col.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
