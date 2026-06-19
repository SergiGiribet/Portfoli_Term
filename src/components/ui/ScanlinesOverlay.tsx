"use client";

import { useStore } from "@/lib/store";

export default function ScanlinesOverlay() {
  const { siteSettings } = useStore();
  if (!siteSettings.scanlines) return null;
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9998, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.022) 0 1px, transparent 1px 3px)",
        animation: "gq-scan 8s linear infinite",
        mixBlendMode: "overlay",
      }}
    />
  );
}
