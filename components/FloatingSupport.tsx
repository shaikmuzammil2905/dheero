"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { useStore } from "./StoreProvider";
import { AmbienceAudio } from "./AmbienceAudio";

/**
 * Floating WhatsApp Popup Widget.
 * Shows ONLY the clean WhatsApp icon button (no inline phone number or "WhatsApp Support" label).
 * Clicking opens an interactive popup card to start a WhatsApp chat.
 */
export function FloatingSupport() {
  const { settings } = useStore();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("Namaskaram! I would like to know more about DHEERO™ Irumudi Rumala.");
  const whatsapp = settings.whatsapp || "7207147749";

  const handleOpenChat = (e: React.FormEvent) => {
    e.preventDefault();
    const url = `https://wa.me/91${whatsapp}?text=${encodeURIComponent(msg.trim())}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <div className="fixed bottom-20 md:bottom-5 right-4 z-40 flex flex-col items-end gap-2.5">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-72 sm:w-80 parchment-card rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4A017]/70"
          >
            <div className="bg-[#1F6F3D] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold text-sm">DHEERO™ Quick Chat</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat popup"
                className="p-1 rounded-full hover:bg-white/15"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleOpenChat} className="p-4 space-y-3">
              <p className="text-xs text-[#5A2E0B]/85 leading-relaxed">
                Have a question about Irumudi Rumala colours, sizing, or bulk Mandali
                orders? Send us a quick message:
              </p>
              <textarea
                rows={3}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#D4A017]/50 text-xs text-[#32170B] outline-none focus:border-[#1F6F3D]"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#1F6F3D] hover:bg-[#17552E] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow"
              >
                <Send className="w-3.5 h-3.5" /> Start Chat on WhatsApp
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AmbienceAudio />

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open WhatsApp chat popup"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1F6F3D] hover:bg-[#17552E] text-white flex items-center justify-center shadow-2xl border-2 border-[#D4A017]/80 transition-transform hover:scale-105"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
