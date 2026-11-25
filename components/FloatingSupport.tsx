"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { useStore } from "./StoreProvider";
import { AmbienceAudio } from "./AmbienceAudio";

export function FloatingSupport() {
  const { settings } = useStore();
  const whatsapp = settings.whatsapp || "7207147749";

  return (
    <div className="fixed bottom-20 md:bottom-5 right-4 z-30 flex flex-col items-end gap-2">
      <AmbienceAudio />
      <a
        href={`https://wa.me/91${whatsapp}?text=${encodeURIComponent(
          "Namaskaram! I need assistance with DHEERO™ Irumudi Rumala."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp Support"
        className="flex items-center gap-2 bg-[#1F6F3D] hover:bg-[#17552E] text-white px-4 py-2.5 rounded-full shadow-xl border border-white/20 text-xs sm:text-sm font-semibold transition-transform hover:scale-105"
      >
        <MessageCircle className="w-4 h-4 shrink-0" />
        <span className="hidden sm:inline">WhatsApp Support</span>
      </a>
    </div>
  );
}
