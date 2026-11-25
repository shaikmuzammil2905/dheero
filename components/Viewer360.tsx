"use client";

import React, { useRef, useState } from "react";
import { RotateCcw, ZoomIn, ZoomOut, Maximize2, X, MoveHorizontal } from "lucide-react";

interface Viewer360Props {
  frames360: string[];
  galleryImages: string[];
  productName: string;
  colorName: string;
}

/**
 * Interactive 360° Product Viewer + Angle Gallery.
 * Supports true 24-36 frame drag/swipe rotation when `frames360` are uploaded.
 * Never fakes 360° rotation by spinning a single flat image.
 */
export function Viewer360({
  frames360,
  galleryImages,
  productName,
  colorName,
}: Viewer360Props) {
  const hasGenuine360 = frames360.length >= 8;
  const activeImages = hasGenuine360 ? frames360 : galleryImages;

  const [frameIndex, setFrameIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [mode360, setMode360] = useState(hasGenuine360);
  const dragStartX = useRef<number | null>(null);

  const safeIndex = Math.min(frameIndex, Math.max(0, activeImages.length - 1));
  const currentSrc = activeImages[safeIndex] || galleryImages[0] || "/images/rumala-turmeric.jpg";

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null || activeImages.length <= 1) return;
    const delta = e.clientX - dragStartX.current;
    const stepThreshold = hasGenuine360 ? 14 : 45;
    if (Math.abs(delta) >= stepThreshold) {
      const dir = delta > 0 ? 1 : -1;
      setFrameIndex((prev) => (prev + dir + activeImages.length) % activeImages.length);
      dragStartX.current = e.clientX;
    }
  };

  const handlePointerUp = () => {
    dragStartX.current = null;
  };

  const resetView = () => {
    setFrameIndex(0);
    setZoom(1);
  };

  const renderStage = (inModal = false) => (
    <div
      className={`relative select-none overflow-hidden rounded-2xl border-2 border-[#D4A017]/50 bg-[#1F120A] ${
        inModal ? "h-[72vh] w-full" : "aspect-square w-full"
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: "pan-y" }}
    >
      <img
        src={currentSrc}
        alt={`${productName} - ${colorName}`}
        draggable={false}
        className="w-full h-full object-cover transition-transform duration-200 cursor-grab active:cursor-grabbing"
        style={{ transform: `scale(${zoom})` }}
      />

      {/* Top instruction badge */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#32170B]/85 text-[#F9F3E6] text-xs font-medium border border-[#D4A017]/50 backdrop-blur-sm">
          <MoveHorizontal className="w-3.5 h-3.5 text-[#F26500]" />
          {hasGenuine360 && mode360
            ? `Drag to Explore 360° (${safeIndex + 1}/${frames360.length})`
            : `Drag or Click Thumbnails (${safeIndex + 1}/${activeImages.length})`}
        </span>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.2, Number((z + 0.25).toFixed(2))))}
            aria-label="Zoom in"
            className="p-2 rounded-full bg-[#32170B]/85 text-[#F9F3E6] hover:bg-[#7A0E0E] border border-[#D4A017]/40"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(1, Number((z - 0.25).toFixed(2))))}
            aria-label="Zoom out"
            className="p-2 rounded-full bg-[#32170B]/85 text-[#F9F3E6] hover:bg-[#7A0E0E] border border-[#D4A017]/40"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={resetView}
            aria-label="Reset rotation and zoom"
            className="p-2 rounded-full bg-[#32170B]/85 text-[#F9F3E6] hover:bg-[#7A0E0E] border border-[#D4A017]/40"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {!inModal && (
            <button
              type="button"
              onClick={() => setFullscreen(true)}
              aria-label="Fullscreen product view"
              className="p-2 rounded-full bg-[#32170B]/85 text-[#F9F3E6] hover:bg-[#7A0E0E] border border-[#D4A017]/40"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!hasGenuine360 && (
        <div className="absolute bottom-3 left-3 right-3 bg-[#32170B]/85 backdrop-blur-sm text-[#F9F3E6] text-[11px] px-3 py-2 rounded-xl border border-[#D4A017]/40">
          360° interactive sequence ready — upload 24–36 angle photographs per colour in the
          Admin Panel to activate full turntable rotation.
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      {hasGenuine360 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setMode360(true);
              setFrameIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ${
              mode360
                ? "bg-[#7A0E0E] text-white"
                : "bg-[#F9F3E6] border border-[#D4A017]/50 text-[#5A2E0B]"
            }`}
          >
            360° Turntable View
          </button>
          <button
            type="button"
            onClick={() => {
              setMode360(false);
              setFrameIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ${
              !mode360
                ? "bg-[#7A0E0E] text-white"
                : "bg-[#F9F3E6] border border-[#D4A017]/50 text-[#5A2E0B]"
            }`}
          >
            Photo Gallery
          </button>
        </div>
      )}

      {renderStage(false)}

      {/* Horizontal Thumbnail Strip */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        {galleryImages.map((img, idx) => (
          <button
            key={`${img}-${idx}`}
            type="button"
            onClick={() => {
              setMode360(false);
              setFrameIndex(idx);
            }}
            className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
              !mode360 && safeIndex === idx
                ? "border-[#F26500] ring-2 ring-[#F26500]/30"
                : "border-[#D4A017]/40 opacity-80 hover:opacity-100"
            }`}
          >
            <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Fullscreen Lightbox Popup */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setFullscreen(false)}
        >
          <div
            className="w-full max-w-4xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between text-[#F9F3E6]">
              <p className="font-serif-display text-xl font-bold">
                {productName} — {colorName}
              </p>
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderStage(true)}
          </div>
        </div>
      )}
    </div>
  );
}
