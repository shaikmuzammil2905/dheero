"use client";

/**
 * Plays a realistic, resonant brass temple Ghanta (bell) naad using Web Audio API.
 * Safe to call on any user interaction (product click, variant click, Add to Cart).
 */
export function playTempleGhanta() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.85, now);
    master.connect(ctx.destination);

    // Brass bell partials (fundamental + metallic inharmonic overtones)
    const partials: Array<{ freq: number; amp: number; decay: number }> = [
      { freq: 432, amp: 0.45, decay: 3.4 },
      { freq: 864, amp: 0.28, decay: 2.6 },
      { freq: 1188, amp: 0.2, decay: 2.0 },
      { freq: 1728, amp: 0.14, decay: 1.5 },
      { freq: 2310, amp: 0.09, decay: 1.0 },
    ];

    partials.forEach(({ freq, amp, decay }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(amp, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + decay + 0.05);
    });

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 3800);
  } catch {
    // Ignore audio errors if blocked
  }
}

/**
 * Speaks "Swamiye Saranam Ayyappa" in a clear, loud, reverent human voice
 * using the Web Speech API, paired with a gentle temple ghanta chime.
 */
export function playSwamiyeSaranamAyyappa() {
  if (typeof window === "undefined") return;
  playTempleGhanta();

  if (!("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("Swamiye Saranam Ayyappa");
    utterance.volume = 1.0;
    utterance.rate = 0.85;
    utterance.pitch = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => /en-IN|hi-IN|ta-IN|te-IN|ml-IN/i.test(v.lang)) ||
      voices.find((v) => /natural|google|rishi|prabhat|heera/i.test(v.name)) ||
      voices[0];
    if (preferred) {
      utterance.voice = preferred;
    }

    // Slight delay so the ghanta strike opens the phrase
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 220);
  } catch {
    // Ignore speech synthesis errors
  }
}
