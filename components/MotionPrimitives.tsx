"use client";

import React from "react";
import { motion } from "framer-motion";

export function Reveal({
  children,
  delay = 0,
  className = "",
  y = 24,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GoldOrnamentalDivider({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.7 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`flex items-center justify-center gap-3 my-2 ${className}`}
    >
      <span className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent to-[#D4A017]" />
      {label ? (
        <span className="px-4 py-1 rounded-full bg-[#7A0E0E] text-[#F9F3E6] text-xs tracking-[0.2em] uppercase font-semibold border border-[#D4A017]/60">
          {label}
        </span>
      ) : (
        <span className="text-[#D4A017] text-lg leading-none" aria-hidden="true">
          ✦
        </span>
      )}
      <span className="h-[1px] w-16 sm:w-28 bg-gradient-to-l from-transparent to-[#D4A017]" />
    </motion.div>
  );
}
