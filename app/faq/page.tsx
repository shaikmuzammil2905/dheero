"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MessageCircle } from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { GoldOrnamentalDivider, Reveal } from "@/components/MotionPrimitives";

export default function FaqPage() {
  const { faqs, settings } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);
  const whatsapp = settings.whatsapp || "7207147749";

  return (
    <div className="parchment-surface py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Reveal className="text-center space-y-3">
          <GoldOrnamentalDivider label="Support & Answers" />
          <h1 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#5A2E0B]">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-[#5A2E0B]/80">
            Everything you need to know about the DHEERO™ Irumudi Rumala, variants,
            sizing, care, wholesale orders, and delivery.
          </p>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((faq) => {
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
          })}
        </div>

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
