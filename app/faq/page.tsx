"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MessageCircle, Search, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { GoldOrnamentalDivider, Reveal } from "@/components/MotionPrimitives";

export default function FaqPage() {
  const { faqs, settings } = useStore();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? "faq_1");
  const [filter, setFilter] = useState("");
  const whatsapp = settings.whatsapp || "7207147749";

  const visibleFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(filter.trim().toLowerCase()) ||
      f.answer.toLowerCase().includes(filter.trim().toLowerCase())
  );

  return (
    <div className="parchment-surface py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Scroll Section 1: Header & Search */}
        <Reveal className="text-center space-y-4">
          <GoldOrnamentalDivider label="Support & Answers" />
          <h1 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#5A2E0B]">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-[#5A2E0B]/80 max-w-2xl mx-auto">
            Everything you need to know about the DHEERO™ Irumudi Rumala, colour
            variants, dimensions, wearing styles, care, wholesale orders, and delivery.
          </p>

          <div className="max-w-lg mx-auto relative pt-2">
            <Search className="w-4 h-4 text-[#7A0E0E] absolute left-4 top-5" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter questions (e.g. colour, wholesale, wash, track)..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-[#D4A017]/60 text-sm outline-none focus:border-[#F26500] shadow-sm"
            />
          </div>
        </Reveal>

        {/* Scroll Section 2: Quick Highlights */}
        <Reveal className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Sparkles,
              title: "3 Signature Colours",
              desc: "Turmeric Yellow, Light Brown & Maroon Red — all with thoughtful devotional presentation.",
            },
            {
              icon: Truck,
              title: "Pan-India Dispatch",
              desc: "Ships within 1–2 business days from Khammam, Telangana with order tracking.",
            },
            {
              icon: ShieldCheck,
              title: "Retail & Wholesale",
              desc: "Order single pieces online or request bulk Mandali pricing via WhatsApp.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="parchment-card rounded-2xl p-5 flex items-start gap-3.5"
            >
              <div className="p-2.5 rounded-xl bg-[#7A0E0E] text-[#D4A017] shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif-display text-xl font-bold text-[#5A2E0B]">
                  {item.title}
                </h2>
                <p className="text-xs text-[#32170B]/80 mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </Reveal>

        {/* Scroll Section 3: Expandable FAQ Accordions */}
        <div className="space-y-3">
          {visibleFaqs.length === 0 ? (
            <div className="parchment-card rounded-2xl p-8 text-center text-sm text-[#5A2E0B]">
              No questions matched your filter. Clear the search box to view all{" "}
              {faqs.length} questions.
            </div>
          ) : (
            visibleFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="parchment-card rounded-2xl overflow-hidden transition-shadow"
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
                  >
                    <span className="font-serif-display text-xl sm:text-2xl font-bold text-[#5A2E0B]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#7A0E0E] shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pt-1 text-sm text-[#32170B]/85 leading-relaxed border-t border-[#D4A017]/25">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Scroll Section 4: Policy & Sizing Quick Links */}
        <Reveal className="parchment-card rounded-3xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <Link
            href="/shop"
            className="p-4 rounded-2xl bg-white/75 border border-[#D4A017]/35 hover:border-[#F26500] transition-colors"
          >
            <p className="font-serif-display text-xl font-bold text-[#7A0E0E]">
              Wearing Styles
            </p>
            <p className="text-xs text-[#5A2E0B]/80 mt-1">
              View 5 step-by-step Rumala wrapping styles
            </p>
          </Link>
          <Link
            href="/policies/shipping"
            className="p-4 rounded-2xl bg-white/75 border border-[#D4A017]/35 hover:border-[#F26500] transition-colors"
          >
            <p className="font-serif-display text-xl font-bold text-[#7A0E0E]">
              Shipping Policy
            </p>
            <p className="text-xs text-[#5A2E0B]/80 mt-1">
              Delivery timelines & Pan-India dispatch details
            </p>
          </Link>
          <Link
            href="/policies/returns"
            className="p-4 rounded-2xl bg-white/75 border border-[#D4A017]/35 hover:border-[#F26500] transition-colors"
          >
            <p className="font-serif-display text-xl font-bold text-[#7A0E0E]">
              Returns & Refunds
            </p>
            <p className="text-xs text-[#5A2E0B]/80 mt-1">
              7-day unused item replacement & refund terms
            </p>
          </Link>
        </Reveal>

        {/* Scroll Section 5: Direct Support CTA */}
        <Reveal className="parchment-card rounded-2xl p-6 sm:p-8 text-center space-y-4">
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#7A0E0E]">
            Still have a question or wholesale inquiry?
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/91${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1F6F3D] text-white font-semibold text-sm shadow"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7A0E0E] text-white font-semibold text-sm shadow"
            >
              Contact Us
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
