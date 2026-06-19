"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useStore } from "@/lib/store";

export default function Hero() {
  const t = useTranslations();
  const { siteSettings } = useStore();

  const [clock, setClock] = useState("--:--:-- UTC");
  const [photoUrl, setPhotoUrl] = useState("/images/subject.jpg");
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then(r => r.json())
      .then((d: { photo?: string | null } | null) => { if (d?.photo) setPhotoUrl(d.photo); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, "0");
      setClock(`${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} UTC`);
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const img = imgRef.current;
    if (!img || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let raf: number;
    const onMove = (e: MouseEvent) => {
      const p = img.parentElement; if (!p) return;
      const r = p.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
    };
    const loop = () => {
      cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07;
      if (imgRef.current) imgRef.current.style.transform = `scale(1.1) translate(${(cx * -3.4).toFixed(2)}%,${(cy * -3.4).toFixed(2)}%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); };
  }, []);

  return (
    <section id="top" style={{ position: "relative", minHeight: "100vh", boxSizing: "border-box", padding: "96px 28px 40px", display: "flex", flexDirection: "column", justifyContent: "center", scrollMarginTop: 60 }}>
      {/* top HUD strip */}
      <div style={{ position: "absolute", top: 66, left: 28, right: 28, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.2em", color: "#7e8178", textTransform: "uppercase" }}>
        <span>PORTFOLIO_FILE // NM·00</span>
        <span className="gq-hud-mid" style={{ color: "var(--ac,#c7f536)" }}>— MULTIPLATFORM —</span>
        <span>{siteSettings.coords}</span>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", position: "relative" }}>
        {/* corner brackets */}
        <div style={{ position: "absolute", top: -14, left: -10, width: 24, height: 24, borderTop: "2px solid var(--ac,#c7f536)", borderLeft: "2px solid var(--ac,#c7f536)" }} />
        <div style={{ position: "absolute", top: -14, right: -10, width: 24, height: 24, borderTop: "1px solid #3a3d3a", borderRight: "1px solid #3a3d3a" }} />
        <div style={{ position: "absolute", bottom: -14, left: -10, width: 24, height: 24, borderBottom: "1px solid #3a3d3a", borderLeft: "1px solid #3a3d3a" }} />
        <div style={{ position: "absolute", bottom: -14, right: -10, width: 24, height: 24, borderBottom: "1px solid #3a3d3a", borderRight: "1px solid #3a3d3a" }} />

        <div className="gq-hero-grid" style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 40, alignItems: "center" }}>
          {/* LEFT */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.24em", color: "#8a8d83", textTransform: "uppercase" }}>
              <span style={{ color: "var(--ac,#c7f536)" }}>●</span>
              <span>OPERATOR // 開発者</span>
              <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg,#2a2c2a,transparent)" }} />
            </div>

            <h1 className="animate-gq-glitch" style={{ margin: 0, fontFamily: "'Archivo Black',sans-serif", fontSize: "clamp(58px,11vw,168px)", lineHeight: 0.82, letterSpacing: "-0.03em", color: "#edeee8", cursor: "default" }}>
              {siteSettings.display_name}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
              <span style={{ width: 42, height: 6, background: "var(--ac,#c7f536)", display: "inline-block" }} />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, letterSpacing: "0.3em", color: "#b8bbb2" }}>{siteSettings.sub_name}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "var(--violet,#9d8dff)" }}>夕</span>
            </div>

            <p style={{ margin: "26px 0 0", fontFamily: "'JetBrains Mono',monospace", fontSize: "clamp(13px,1.5vw,17px)", letterSpacing: "0.12em", color: "#8a8d86" }}>
              「 {siteSettings.slogan} 」
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 30 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#cfd2ca", border: "1px solid #2a2c2a", padding: "7px 12px" }}>{t("hero.developer")}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#cfd2ca", border: "1px solid #2a2c2a", padding: "7px 12px" }}>{t("hero.student")}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#0a0b0a", background: "var(--ac,#c7f536)", padding: "7px 12px", fontWeight: 700 }}>{t("hero.founder")}</span>
            </div>
          </div>

          {/* RIGHT: photo card */}
          <div>
            <div style={{ position: "relative", aspectRatio: "3/4", border: "1px solid #2a2c2a", overflow: "hidden", background: "#0a0b0a", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 16 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img ref={imgRef} src={photoUrl} alt={siteSettings.sub_name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 28%", filter: "grayscale(1) contrast(1.12) brightness(0.92)", transform: "scale(1.08)", willChange: "transform", zIndex: 0 }} />
              <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "var(--ac,#c7f536)", mixBlendMode: "multiply", opacity: 0.42, pointerEvents: "none" }} />
              <div className="animate-gq-vdrift" style={{ position: "absolute", inset: 0, zIndex: 2, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 1px, transparent 1px 3px)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "radial-gradient(120% 100% at 50% 0%, transparent 42%, rgba(0,0,0,0.6))", pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 20%, transparent 38%, transparent 66%, rgba(0,0,0,0.62) 100%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: 10, left: 10, width: 16, height: 16, borderTop: "2px solid var(--ac,#c7f536)", borderLeft: "2px solid var(--ac,#c7f536)", zIndex: 3 }} />
              <div style={{ position: "absolute", bottom: 10, right: 10, width: 16, height: 16, borderBottom: "1px solid var(--ac,#c7f536)", borderRight: "1px solid var(--ac,#c7f536)", zIndex: 3 }} />
              <div style={{ position: "relative", zIndex: 3, display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.18em", color: "#cdd0c8" }}>
                <span>SUBJECT // 主体</span><span>NM·00</span>
              </div>
              <div style={{ position: "relative", zIndex: 3, display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.16em", color: "#cdd0c8" }}>
                <span>RES_2160 · MONO</span>
                <span style={{ color: "var(--ac,#c7f536)" }}>夕 02</span>
              </div>
            </div>
            <div style={{ border: "1px solid #2a2c2a", borderTop: "none", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.16em", color: "#8a8d86" }}>
              <span>SYS.CLOCK</span>
              <span style={{ color: "var(--ac,#c7f536)" }}>{clock}</span>
            </div>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="animate-gq-float" style={{ position: "absolute", bottom: 22, left: "50%", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.3em", color: "#7e8178" }}>
        <span>{t("ui.scroll")}</span>
        <span style={{ color: "var(--ac,#c7f536)" }}>↓</span>
      </div>

      <style>{`
        @media (max-width: 860px) { .gq-hero-grid { grid-template-columns: 1fr !important; gap: 30px !important; } }
        @media (max-width: 620px) { .gq-hud-mid { display: none !important; } }
      `}</style>
    </section>
  );
}
