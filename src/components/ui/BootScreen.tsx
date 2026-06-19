"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";

const BOOT_LINES = [
  "INIT GIRQUELL.SYS",
  "MOUNT /portfolio",
  "LOAD modules · web · mobile · hardware",
  "LINK @DuckHats // studio",
  "RENDER INTERFACE",
];

export default function BootScreen() {
  const { siteSettings } = useStore();
  const overlayRef = useRef<HTMLDivElement>(null);
  const logRef     = useRef<HTMLDivElement>(null);
  const barRef     = useRef<HTMLDivElement>(null);
  const pctRef     = useRef<HTMLSpanElement>(null);
  const statusRef  = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (!siteSettings.boot_sequence) { overlay.style.display = "none"; return; }

    let booted = false;
    try { booted = sessionStorage.getItem("gq_booted") === "1"; } catch {}
    if (booted) { overlay.style.display = "none"; return; }

    const log    = logRef.current;
    const bar    = barRef.current;
    const pct    = pctRef.current;
    const status = statusRef.current;

    let i = 0, p = 0;
    const addLine = () => {
      if (i < BOOT_LINES.length && log) {
        const row = document.createElement("div");
        row.style.animation = "gq-boot-rise .25s ease both";
        row.innerHTML = `<span style="color:var(--ac,#c7f536)">&gt;</span> ${BOOT_LINES[i]} <span style="color:#33362f">..........</span> <span style="color:var(--ac,#c7f536)">OK</span>`;
        log.appendChild(row);
        i++;
      }
    };
    addLine();
    const lineIv = setInterval(addLine, 300);
    const barIv  = setInterval(() => {
      p = Math.min(100, p + Math.random() * 8 + 4);
      if (bar)  bar.style.width = `${p}%`;
      if (pct)  pct.textContent = `${Math.floor(p)}%`;
      if (p >= 100) {
        clearInterval(barIv);
        clearInterval(lineIv);
        while (i < BOOT_LINES.length) addLine();
        if (status) {
          status.textContent = "READY ✓";
          status.style.color = "var(--ac,#c7f536)";
        }
        try { sessionStorage.setItem("gq_booted", "1"); } catch {}
        setTimeout(() => {
          if (overlay) {
            overlay.style.opacity = "0";
            overlay.style.pointerEvents = "none";
          }
          setTimeout(() => { if (overlay) overlay.style.display = "none"; }, 650);
        }, 420);
      }
    }, 190);

    return () => { clearInterval(lineIv); clearInterval(barIv); };
  }, [siteSettings.boot_sequence]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10050,
        background: "#08090a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        padding: 24,
        boxSizing: "border-box",
        transition: "opacity .6s ease",
        overflow: "hidden",
      }}
    >
      {/* scanlines */}
      <div className="animate-gq-scan" style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px)", mixBlendMode: "overlay" }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.6) 100%)" }} />

      {/* wordmark */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="animate-gq-blink" style={{ width: 12, height: 28, background: "var(--ac,#c7f536)", display: "inline-block" }} />
          <span className="animate-gq-glitch" style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: "clamp(30px,6vw,42px)", letterSpacing: "0.03em", color: "#edeee8" }}>GIRQUELL</span>
        </div>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.34em", color: "#7e8178", textTransform: "uppercase" }}>
          DEV.SYS_v2 // BOOT SEQUENCE
        </span>
      </div>

      {/* log */}
      <div ref={logRef} style={{ position: "relative", width: "min(460px,84vw)", minHeight: 128, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: "0.06em", color: "#8a8d86", lineHeight: 2 }} />

      {/* progress */}
      <div style={{ position: "relative", width: "min(460px,84vw)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.22em", color: "#8a8d83", marginBottom: 9, textTransform: "uppercase" }}>
          <span ref={statusRef}>BOOTING…</span>
          <span ref={pctRef}>0%</span>
        </div>
        <div style={{ height: 3, background: "#1c1e1c", overflow: "hidden" }}>
          <div ref={barRef} style={{ height: "100%", width: "0%", background: "var(--ac,#c7f536)", boxShadow: "0 0 10px var(--ac,#c7f536)", transition: "width .25s ease" }} />
        </div>
      </div>

      {/* bottom HUD */}
      <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "0 24px", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.2em", color: "#3a3d3a", textTransform: "uppercase" }}>
        <span>NM·00 // OPERATOR</span>
        <span>41.97°N / 2.78°E</span>
      </div>
    </div>
  );
}
