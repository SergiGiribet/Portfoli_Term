"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = (doc.scrollHeight - window.innerHeight) || 1;
      const pct = Math.min(1, Math.max(0, window.scrollY / max)) * 100;
      if (barRef.current) barRef.current.style.width = `${pct.toFixed(2)}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={barRef}
      role="progressbar"
      aria-label="Scroll progress"
      style={{
        position: "fixed",
        top: 0, left: 0,
        height: 2,
        width: "0%",
        background: "var(--ac,#c7f536)",
        boxShadow: "0 0 8px var(--ac,#c7f536)",
        zIndex: 1002,
        transition: "width .08s linear",
        pointerEvents: "none",
      }}
    />
  );
}
