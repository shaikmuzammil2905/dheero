"use client";

import React from "react";
import { AmbienceAudio } from "./AmbienceAudio";

export function FloatingSupport() {
  return (
    <div className="fixed bottom-20 md:bottom-5 right-4 z-40 flex flex-col items-end">
      <AmbienceAudio />
    </div>
  );
}
