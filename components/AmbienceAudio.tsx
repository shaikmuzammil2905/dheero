"use client";

import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Optional Devotional Ambience Audio Widget.
 * OFF by default. Synthesizes gentle temple bell resonance + soft Pamba breeze
 * using the Web Audio API only after explicit user click — zero copyrighted audio.
 */
export function AmbienceAudio() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const bellTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAudio = () => {
    if (bellTimerRef.current) {
      clearInterval(bellTimerRef.current);
      bellTimerRef.current = null;
    }
    if (ctxRef.current) {
      ctxRef.current.close().catch(() => {});
      ctxRef.current = null;
    }
    masterGainRef.current = null;
    setPlaying(false);
  };

  const triggerBell = (ctx: AudioContext, master: GainNode) => {
    const now = ctx.currentTime;
    const freqs = [528, 1056, 1584];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.14 / (idx + 1), now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 4.3);
    });
  };

  const startAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const master = ctx.createGain();
      master.gain.value = volume;
      master.connect(ctx.destination);

      // Soft warm forest/river drone
      const drone = ctx.createOscillator();
      const droneGain = ctx.createGain();
      drone.type = "sine";
      drone.frequency.value = 136.1; // calm Om resonance frequency
      droneGain.gain.value = 0.05;
      drone.connect(droneGain);
      droneGain.connect(master);
      drone.start();

      triggerBell(ctx, master);
      bellTimerRef.current = setInterval(() => triggerBell(ctx, master), 7500);

      ctxRef.current = ctx;
      masterGainRef.current = master;
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => stopAudio();
  }, []);

  return (
    <div className="flex items-center gap-2 bg-[#32170B]/90 text-[#F9F3E6] border border-[#D4A017]/50 rounded-full px-3 py-1.5 shadow-lg backdrop-blur-md">
      <button
        type="button"
        onClick={() => (playing ? stopAudio() : startAudio())}
        className="flex items-center gap-1.5 text-xs font-medium"
        title={playing ? "Mute Devotional Ambience" : "Play Gentle Temple Bell Ambience"}
      >
        {playing ? (
          <Volume2 className="w-4 h-4 text-[#F26500]" />
        ) : (
          <VolumeX className="w-4 h-4 text-[#D4A017]" />
        )}
        <span className="hidden sm:inline">
          {playing ? "Ambience On" : "Ambience Off"}
        </span>
      </button>
      {playing && (
        <input
          type="range"
          min={0.05}
          max={0.8}
          step={0.05}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Ambience volume"
          className="w-14 accent-[#F26500] cursor-pointer"
        />
      )}
    </div>
  );
}
