"use client";

import React, { useRef, useState } from "react";
import { RotateCcw, ZoomIn, ZoomOut, Maximize2, X, MoveHorizontal, Search } from "lucide-react";

interface Viewer360Props {
  frames360: string[];
  galleryImages: string[];
  productName: string;
  colorName: string;
}

/**
 * Interactive 360° Product Viewer + Magnified Fabric & Woven Label Inspection.
 * Supports mouse drag & touch swipe, zoom, reset, and fullscreen modal.
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
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [fullscreen, setFullscreen] = useState(false);
  const [inspectOpen, setInspectOpen] = useState(false);
  const dragStartX = useRef<number | null>(null);

  const safeIndex = Math.min(frameIndex, Math.max(0, activeImages.length - 1));
  const currentSrc = activeImages[safeIndex] || galleryImages[0] || "/images/rumala-maroon.jpg";

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null || activeImages.length <= 1) return;
    const delta = e.clientX - dragStartX.current;
    const stepThreshold = hasGenuine360 ? 14 : 42;
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
    setPan({ x: 0, y: 0 });
  };

  const renderStage = (inModal = false) => (
    <div
      className={`relative select-none overflow-hidden rounded-3xl border border-[#C6A04A]/55 bg-[#EFE6D5] shadow-[0_24px_60px_-20px_rgba(41,35,29,0.22)] ${
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
        onClick={() => {
          if (!inModal) setInspectOpen(true);
        }}
        className="w-full h-full object-cover transition-transform duration-200 cursor-grab active:cursor-grabbing"
        style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)` }}
      />

      {/* Top instruction & controls */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#29231D]/80 text-[#F8F3E8] text-xs font-medium border border-[#C6A04A]/50 backdrop-blur-sm">
          <MoveHorizontal className="w-3.5 h-3.5 text-[#C6A04A]" />
          {hasGenuine360
            ? `Drag to Rotate 360° (${safeIndex + 1}/${frames360.length})`
            : `Drag or Select Angle (${safeIndex + 1}/${activeImages.length})`}
        </span>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.4, Number((z + 0.3).toFixed(2))))}
            aria-label="Zoom in"
            className="p-2 rounded-full bg-[#29231D]/80 text-[#F8F3E8] hover:bg-[#541D25] border border-[#C6A04A]/40"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(1, Number((z - 0.3).toFixed(2))))}
            aria-label="Zoom out"
            className="p-2 rounded-full bg-[#29231D]/80 text-[#F8F3E8] hover:bg-[#541D25] border border-[#C6A04A]/40"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={resetView}
            aria-label="Reset view"
            className="p-2 rounded-full bg-[#29231D]/80 text-[#F8F3E8] hover:bg-[#541D25] border border-[#C6A04A]/40"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {!inModal && (
            <button
              type="button"
              onClick={() => setFullscreen(true)}
              aria-label="Fullscreen view"
              className="p-2 rounded-full bg-[#29231D]/80 text-[#F8F3E8] hover:bg-[#541D25] border border-[#C6A04A]/40"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!inModal && (
        <button
          type="button"
          onClick={() => setInspectOpen(true)}
          className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F8F3E8]/95 text-[#541D25] text-xs font-semibold border border-[#C6A04A]/60 shadow hover:bg-white"
        >
          <Search className="w-3.5 h-3.5 text-[#C8242C]" />
          Tap fabric to inspect weave & label
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      {renderStage(false)}

      {/* Angle Thumbnails */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        {galleryImages.map((img, idx) => (
          <button
            key={`${img}-${idx}`}
            type="button"
            onClick={() => setFrameIndex(idx)}
            className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
              safeIndex === idx
                ? "border-[#C8242C] ring-2 ring-[#C8242C]/25"
                : "border-[#C6A04A]/40 opacity-80 hover:opacity-100"
            }`}
          >
            <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setFullscreen(false)}
        >
          <div className="w-full max-w-4xl space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between text-[#F8F3E8]">
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

      {/* Fabric & Stitched Label Inspection Modal */}
      {inspectOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#29231D]/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setInspectOpen(false)}
        >
          <div
            className="w-full max-w-3xl ivory-card rounded-3xl p-5 sm:p-8 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#C6A04A]/35 pb-3">
              <div>
                <h3 className="font-serif-display text-2xl font-bold text-[#541D25]">
                  Fabric & Label Inspection — {colorName}
                </h3>
                <p className="text-xs text-[#29231D]/75">
                  Magnified weave texture, stitched edge finishing & DHEERO™ woven label
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectOpen(false)}
                className="p-2 rounded-full bg-[#541D25]/10 text-[#541D25]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden border border-[#C6A04A]/50 aspect-square">
                <img
                  src={galleryImages[0] || currentSrc}
                  alt={`${colorName} macro`}
                  className="w-full h-full object-cover scale-125"
                />
              </div>
              <div className="rounded-2xl overflow-hidden border border-[#C6A04A]/50 woven-cotton-texture p-6 flex flex-col justify-center items-center aspect-square">
                <div className="w-full border-t-2 border-b-2 border-dashed border-[#96752D]/40 py-7 flex justify-center">
                  <div className="woven-cotton-texture px-8 py-4 rounded border border-[#C6A04A]/55 shadow-lg">
                    <span className="font-serif-display text-2xl font-bold tracking-[0.14em] text-[#29231D]">
                      DHEERO<sup className="text-xs ml-0.5">™</sup>
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#541D25] mt-4 text-center">
                  Breathable cotton weave with reinforced border stitching & DHEERO™ label
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
