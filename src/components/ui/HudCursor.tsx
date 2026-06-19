"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";

export default function HudCursor() {
  const { siteSettings } = useStore();
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!siteSettings.hud_cursor) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const st = document.createElement("style");
    st.textContent = "* { cursor: none !important; }";
    document.head.appendChild(st);

    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let rx = tx, ry = ty;
    let hovering = false;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX; ty = e.clientY;
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate(${tx}px,${ty}px) translate(-50%,-50%)`;
        dot.style.opacity = "1";
      }
      const hov = !!(e.target as Element)?.closest?.("a, button");
      if (hov !== hovering) {
        hovering = hov;
        const ring = ringRef.current;
        if (ring) {
          ring.style.width  = hov ? "40px" : "26px";
          ring.style.height = hov ? "40px" : "26px";
          ring.style.borderColor = hov
            ? "var(--pink,#ff2d8e)"
            : "var(--ac,#c7f536)";
        }
      }
    };

    const loop = () => {
      rx += (tx - rx) * 0.22;
      ry += (ty - ry) * 0.22;
      const ring = ringRef.current;
      if (ring) {
        ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
        ring.style.opacity = "1";
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      st.remove();
    };
  }, [siteSettings.hud_cursor]);

  return (
    <>
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: 26, height: 26,
          border: "1px solid var(--ac,#c7f536)",
          borderRadius: "50%",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 10060,
          transition: "width .18s ease, height .18s ease, border-color .18s ease, opacity .4s",
        }}
      />
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: 5, height: 5,
          background: "var(--ac,#c7f536)",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 10061,
          transition: "opacity .4s",
        }}
      />
    </>
  );
}
