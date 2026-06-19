"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useStore } from "@/lib/store";
import { imgSrc } from "@/lib/imgSrc";

export default function DetailPanel() {
  const t = useTranslations();
  const { lang, detailProject: p, closeDetail } = useStore();

  useEffect(() => {
    if (!p) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeDetail(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [p, closeDetail]);

  if (!p) return null;

  const longL = lang === "CAT" ? p.long_cat : lang === "ES" ? p.long_es : p.long_en;

  return (
    <div
      onClick={closeDetail}
      style={{ position: "fixed", inset: 0, zIndex: 10020, background: "rgba(5,6,5,0.72)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, boxSizing: "border-box" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", width: "100%", maxWidth: 720, maxHeight: "88vh", overflow: "auto", background: "#0c0d0c", border: "1px solid #2a2c2a", boxShadow: "0 30px 90px -30px rgba(0,0,0,0.9)", animation: "gq-rise .25s ease both" }}
      >
        {/* sticky header */}
        <div style={{ position: "sticky", top: 0, zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", background: "#0c0d0c", borderBottom: "1px solid #2a2c2a", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.18em", color: "#8a8d83" }}>
          <span>{p.no} · {p.org} <span style={{ color: "var(--ac,#c7f536)" }}>{p.cjk}</span></span>
          <button
            onClick={closeDetail}
            style={{ background: "none", border: "1px solid #2a2c2a", cursor: "pointer", padding: "4px 9px", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.16em", color: "#cfd2ca", transition: "all .2s" }}
            onMouseEnter={(e) => { const b = e.currentTarget; b.style.color = "#0a0b0a"; b.style.background = "var(--pink,#ff2d8e)"; b.style.borderColor = "var(--pink,#ff2d8e)"; }}
            onMouseLeave={(e) => { const b = e.currentTarget; b.style.color = "#cfd2ca"; b.style.background = "none"; b.style.borderColor = "#2a2c2a"; }}
          >{t("ui.close")} ✕</button>
        </div>

        {/* hero image */}
        <div style={{ position: "relative", aspectRatio: "16/8", overflow: "hidden", background: "#0a0b0a" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgSrc(p.img)} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.12) brightness(0.9)", zIndex: 0 }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "var(--ac,#c7f536)", mixBlendMode: "multiply", opacity: 0.38 }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 1px, transparent 1px 3px)" }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "radial-gradient(130% 100% at 50% 0%, transparent 36%, rgba(0,0,0,0.7))" }} />
          <span style={{ position: "absolute", bottom: 10, left: 14, zIndex: 3, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.2em", color: "#dfe2da" }}>{p.kind}</span>
        </div>

        {/* body */}
        <div style={{ padding: "22px 22px 26px" }}>
          <h3 style={{ margin: "0 0 14px", fontFamily: "'Archivo Black',sans-serif", fontSize: "clamp(26px,4vw,40px)", lineHeight: 1, letterSpacing: "-0.01em", color: "#edeee8" }}>{p.name}</h3>
          <p style={{ margin: "0 0 22px", fontFamily: "'Chakra Petch',sans-serif", fontSize: "clamp(15px,1.8vw,18px)", lineHeight: 1.65, color: "#cfd2ca" }}>{longL}</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 22 }}>
            {([["ui.role", p.role], ["ui.year", p.year]] as const).map(([key, val]) => (
              <div key={key} style={{ border: "1px solid #2a2c2a", padding: "11px 14px" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83", marginBottom: 4 }}>{t(key)}</div>
                <div style={{ fontFamily: "'Chakra Petch',sans-serif", fontWeight: 600, fontSize: 15, color: "#e8e9e4" }}>{val}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 24 }}>
            {p.tags.map((tag) => (
              <span key={tag} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "#cfd2ca", border: "1px solid #2a2c2a", padding: "5px 9px" }}>{tag}</span>
            ))}
          </div>

          <a
            href={p.href} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 18px", background: "var(--ac,#c7f536)", color: "#0a0b0a", textDecoration: "none", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: "0.18em", fontWeight: 700, textTransform: "uppercase", transition: "background .2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--ac,#c7f536)"; }}
          >{t("ui.openRepo")} ↗</a>
        </div>
      </div>
    </div>
  );
}
