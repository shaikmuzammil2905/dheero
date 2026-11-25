"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward, Sparkles, ArrowRight } from "lucide-react";

interface Scene {
  id: number;
  durationMs: number;
  tag: string;
  title: string;
  caption: string;
  bgGradient: string;
  visualType: "forest" | "obstacle" | "courage" | "cloth" | "markings" | "identity";
}

const SCENES: Scene[] = [
  {
    id: 1,
    durationMs: 5000,
    tag: "Scene I • The Sacred Forest",
    title: "Sunlight Enters the Quiet Grove",
    caption:
      "Through mist-covered hills and gentle leaves, a pilgrim's inner journey begins in stillness and faith.",
    bgGradient: "from-[#1A2F1D] via-[#283B22] to-[#32170B]",
    visualType: "forest",
  },
  {
    id: 2,
    durationMs: 5000,
    tag: "Scene II • The Inner Challenge",
    title: "Shadows of Ego, Anger & Doubt",
    caption:
      "Every seeker faces unseen obstacles along the path — negativity, pride, and restlessness.",
    bgGradient: "from-[#1A1210] via-[#32170B] to-[#4A1212]",
    visualType: "obstacle",
  },
  {
    id: 3,
    durationMs: 5000,
    tag: "Scene III • The Spirit of DHEER",
    title: "Courage & Self-Discipline Rise",
    caption:
      "Inspired by timeless devotion, discipline transforms hesitation into quiet, unwavering strength.",
    bgGradient: "from-[#32170B] via-[#5A2E0B] to-[#7A0E0E]",
    visualType: "courage",
  },
  {
    id: 4,
    durationMs: 5000,
    tag: "Scene IV • The Flowing Cloth",
    title: "Earthy Textures, Thoughtful Craft",
    caption:
      "Natural-feeling fabric woven with dignity and comfort, shaped for the sacred journey ahead.",
    bgGradient: "from-[#5A2E0B] via-[#7A0E0E] to-[#9E4B0A]",
    visualType: "cloth",
  },
  {
    id: 5,
    durationMs: 5000,
    tag: "Scene V • Signature Markings",
    title: "Gandham • Vibhuti • Kumkum",
    caption:
      "Three horizontal markings — saffron, sacred white, and crimson — honouring heritage with grace.",
    bgGradient: "from-[#32170B] via-[#7A0E0E] to-[#32170B]",
    visualType: "markings",
  },
  {
    id: 6,
    durationMs: 5000,
    tag: "Scene VI • DHEERO™ Identity",
    title: "THE COURAGE IS WITHIN YOU.",
    caption: "DHEERO™ — A Journey of Faith. A Tradition of Devotion.",
    bgGradient: "from-[#F9F3E6] via-[#F7ECDA] to-[#F2E2C4]",
    visualType: "identity",
  },
];

export function BrandStory30s({ onExplore }: { onExplore?: () => void }) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (sceneIdx >= SCENES.length - 1) {
      const stopTimer = setTimeout(() => setPlaying(false), 4800);
      return () => clearTimeout(stopTimer);
    }
    const timer = setTimeout(() => {
      setSceneIdx((prev) => Math.min(SCENES.length - 1, prev + 1));
    }, SCENES[sceneIdx].durationMs);
    return () => clearTimeout(timer);
  }, [playing, sceneIdx]);

  const current = SCENES[sceneIdx];
  const isLightScene = current.visualType === "identity";
  const progressPct = ((sceneIdx + 1) / SCENES.length) * 100;

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-[#D4A017]/60 shadow-2xl bg-[#1E1008]">
      <div
        className={`relative min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-6 sm:p-10 bg-gradient-to-br ${current.bgGradient} transition-colors duration-1000`}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 z-10">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border ${
              isLightScene
                ? "bg-[#7A0E0E] text-[#F9F3E6] border-[#D4A017]"
                : "bg-black/35 text-[#D4A017] border-[#D4A017]/50"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {current.tag}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="px-3.5 py-1.5 rounded-full bg-[#F26500] hover:bg-[#d85700] text-white text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {playing ? "Pause" : sceneIdx === 0 ? "Play 30s Story" : "Resume"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSceneIdx(0);
                setPlaying(true);
              }}
              aria-label="Replay story"
              className="p-2 rounded-full bg-black/30 text-[#F9F3E6] hover:bg-black/50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            {sceneIdx < SCENES.length - 1 && (
              <button
                type="button"
                onClick={() => {
                  setSceneIdx(SCENES.length - 1);
                  setPlaying(false);
                }}
                className="px-3 py-1.5 rounded-full bg-black/30 text-[#F9F3E6] hover:bg-black/50 text-xs flex items-center gap-1"
              >
                Skip <SkipForward className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scene Center Visual */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.7 }}
            className="my-auto py-8 text-center max-w-2xl mx-auto space-y-5 z-10"
          >
            {current.visualType === "markings" && (
              <div className="w-48 mx-auto space-y-2.5 py-2">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6 }}
                  className="h-2.5 rounded-full bg-[#F26500] shadow-[0_0_16px_rgba(242,101,0,0.7)]"
                />
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="h-2.5 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.7)]"
                />
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="h-2.5 rounded-full bg-[#DC2626] shadow-[0_0_16px_rgba(220,38,38,0.7)]"
                />
              </div>
            )}

            {current.visualType === "cloth" && (
              <div className="flex justify-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#F4B400] border-2 border-[#D4A017] shadow-lg" />
                <span className="w-10 h-10 rounded-full bg-[#9E6B43] border-2 border-[#D4A017] shadow-lg" />
                <span className="w-10 h-10 rounded-full bg-[#7A0E0E] border-2 border-[#D4A017] shadow-lg" />
              </div>
            )}

            {current.visualType === "identity" && (
              <motion.img
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7 }}
                src="/images/dheero-logo.png"
                alt="DHEERO™"
                className="h-20 sm:h-24 w-auto mx-auto"
              />
            )}

            <h3
              className={`font-serif-display text-3xl sm:text-5xl font-bold leading-tight ${
                isLightScene ? "text-[#7A0E0E]" : "text-[#F9F3E6]"
              }`}
            >
              {current.title}
            </h3>

            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isLightScene ? "text-[#5A2E0B]" : "text-[#F9F3E6]/85"
              }`}
            >
              {current.caption}
            </p>

            {current.visualType === "identity" && (
              <div className="pt-2">
                <Link
                  href="/shop"
                  onClick={onExplore}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#F26500] hover:bg-[#d85700] text-white font-semibold text-sm shadow-xl transition-transform hover:scale-105"
                >
                  EXPLORE THE COLLECTION <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Progress & Scene Dots */}
        <div className="space-y-3 z-10">
          <div className="h-1.5 w-full rounded-full bg-black/25 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D4A017] to-[#F26500] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              {SCENES.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSceneIdx(idx)}
                  aria-label={`Jump to scene ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === sceneIdx
                      ? "w-7 bg-[#F26500]"
                      : "w-2.5 bg-[#D4A017]/50 hover:bg-[#D4A017]"
                  }`}
                />
              ))}
            </div>
            <span className={isLightScene ? "text-[#5A2E0B]/80" : "text-[#F9F3E6]/70"}>
              Scene {sceneIdx + 1} of {SCENES.length} (~30s Experience)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
