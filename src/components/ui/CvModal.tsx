"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useStore } from "@/lib/store";
import { getCv } from "@/lib/content";

export default function CvModal() {
  const t = useTranslations("cv");
  const { lang, cvOpen, setCvOpen, accent } = useStore();
  const cv = getCv(lang);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cvOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setCvOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [cvOpen, setCvOpen]);

  const downloadCv = () => {
    const panel = panelRef.current;
    if (!panel) return;

    const printAcc = { Lime: "#4a9e00", Pink: "#c41e6a", Violet: "#5a3fd6" }[accent] ?? "#4a9e00";
    const clone = panel.cloneNode(true) as HTMLElement;
    clone.id = "gq-cv-print";

    clone.querySelector(".gq-cv-actions")?.remove();

    // Walk every element and rewrite inline styles for a light print theme.
    // We check the raw inline style string directly — getComputedStyle is
    // unreliable on off-screen clones before the browser has painted them.
    [clone, ...Array.from(clone.querySelectorAll<HTMLElement>("*"))].forEach((el) => {
      const s = el.getAttribute("style") ?? "";

      // Strip dark-theme chrome
      el.style.background = "transparent";
      el.style.backgroundColor = "transparent";
      el.style.boxShadow = "none";
      el.style.textShadow = "none";
      el.style.backdropFilter = "none";
      el.style.animation = "none";

      // Hairline borders → light grey
      if (s.includes("border")) el.style.borderColor = "#d4d4d4";

      // Text colours: accent → printAcc+bold, everything else → dark ink.
      // In the dark theme every non-accent inline colour is a light shade
      // (#edeee8, #cfd2ca, #9a9d96, #8a8d83 …) so we can safely invert all.
      if (s.includes("color")) {
        if (s.includes("var(--ac")) {
          el.style.color = printAcc;
          el.style.fontWeight = "700";
        } else {
          el.style.color = "#1e2118";
        }
      }
    });

    // White paper background on the root clone
    clone.style.background = "#ffffff";
    clone.style.color = "#1e2118";

    const holder = document.createElement("div");
    holder.id = "gq-print-holder";
    holder.style.cssText = "position:fixed; left:-99999px; top:0; width:860px; background:#fff;";
    holder.appendChild(clone);
    document.body.appendChild(holder);
    document.body.classList.add("gq-printing");

    const prev = document.title;
    document.title = cv.file;
    const cleanup = () => {
      document.title = prev;
      holder.remove();
      document.body.classList.remove("gq-printing");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
    setTimeout(cleanup, 2000);
  };

  if (!cvOpen) return null;

  const SectionHeader = ({ label }: { label: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.22em", color: "var(--ac,#c7f536)" }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: "#1c1e1c" }} />
    </div>
  );

  return (
    <div
      onClick={() => setCvOpen(false)}
      style={{ position: "fixed", inset: 0, zIndex: 10025, background: "rgba(5,6,5,0.8)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", boxSizing: "border-box", overflowY: "auto" }}
    >
      <div
        ref={panelRef}
        id="gq-cv"
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", width: "100%", maxWidth: 860, background: "#0c0d0c", border: "1px solid #2a2c2a", boxShadow: "0 30px 90px -30px rgba(0,0,0,0.9)", animation: "gq-rise .25s ease both" }}
      >
        {/* sticky header */}
        <div className="gq-cv-actions" style={{ position: "sticky", top: 0, zIndex: 3, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "13px 18px", background: "rgba(12,13,12,0.97)", borderBottom: "1px solid #2a2c2a", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.18em", color: "#8a8d83" }}>
          <span>{cv.title} <span style={{ color: "var(--ac,#c7f536)" }}>{cv.sub}</span></span>
          <div style={{ display: "flex", gap: 9 }}>
            <button
              onClick={downloadCv}
              style={{ background: "var(--ac,#c7f536)", border: "1px solid var(--ac,#c7f536)", cursor: "pointer", padding: "7px 13px", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.16em", fontWeight: 700, color: "#0a0b0a", transition: "all .2s" }}
              onMouseEnter={(e) => { const b = e.currentTarget; b.style.background = "#fff"; b.style.borderColor = "#fff"; }}
              onMouseLeave={(e) => { const b = e.currentTarget; b.style.background = "var(--ac,#c7f536)"; b.style.borderColor = "var(--ac,#c7f536)"; }}
            >
              {t("download")} ↓
            </button>
            <button
              onClick={() => setCvOpen(false)}
              style={{ background: "none", border: "1px solid #2a2c2a", cursor: "pointer", padding: "7px 11px", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.16em", color: "#cfd2ca", transition: "all .2s" }}
              onMouseEnter={(e) => { const b = e.currentTarget; b.style.color = "#0a0b0a"; b.style.background = "var(--pink,#ff2d8e)"; b.style.borderColor = "var(--pink,#ff2d8e)"; }}
              onMouseLeave={(e) => { const b = e.currentTarget; b.style.color = "#cfd2ca"; b.style.background = "none"; b.style.borderColor = "#2a2c2a"; }}
            >
              {t("close")} ✕
            </button>
          </div>
        </div>

        <div style={{ padding: "30px 30px 34px" }}>
          {/* identity */}
          <div style={{ borderBottom: "1px solid #1c1e1c", paddingBottom: 22, marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontFamily: "'Archivo Black',sans-serif", fontSize: "clamp(28px,5vw,46px)", lineHeight: 0.95, letterSpacing: "-0.02em", color: "#edeee8" }}>{cv.name}</h2>
            <p style={{ margin: "11px 0 16px", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: "0.08em", color: "var(--ac,#c7f536)" }}>「 {cv.tagline} 」</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 18, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: "0.04em", color: "#9a9d96" }}>
              <span>◷ {cv.location}</span>
              <span>✆ {cv.phone}</span>
              <span>✉ {cv.email}</span>
            </div>
          </div>

          {/* profile */}
          <div style={{ marginBottom: 26 }}>
            <SectionHeader label={t("profile")} />
            <p style={{ margin: 0, fontFamily: "'Chakra Petch',sans-serif", fontSize: 15, lineHeight: 1.62, color: "#cfd2ca" }}>{cv.profile}</p>
          </div>

          {/* experience + education */}
          <div className="gq-cv-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 26 }}>
            <div>
              <SectionHeader label={t("exp")} />
              {cv.experience.map((e, i) => (
                <div key={i} style={{ marginBottom: 15 }}>
                  <div style={{ fontFamily: "'Chakra Petch',sans-serif", fontWeight: 700, fontSize: 15, color: "#e8e9e4" }}>{e.role}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: "0.06em", color: "var(--ac,#c7f536)" }}>{e.org}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.04em", color: "#8a8d83", marginTop: 2 }}>{e.meta}</div>
                </div>
              ))}
            </div>
            <div>
              <SectionHeader label={t("edu")} />
              {cv.education.map((e, i) => (
                <div key={i} style={{ marginBottom: 15 }}>
                  <div style={{ fontFamily: "'Chakra Petch',sans-serif", fontWeight: 700, fontSize: 15, color: "#e8e9e4" }}>{e.role}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: "0.06em", color: "var(--ac,#c7f536)" }}>{e.org}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.04em", color: "#8a8d83", marginTop: 2 }}>{e.meta}</div>
                </div>
              ))}
            </div>
          </div>

          {/* volunteering */}
          <div style={{ marginBottom: 26 }}>
            <SectionHeader label={t("vol")} />
            <div style={{ fontFamily: "'Chakra Petch',sans-serif", fontWeight: 700, fontSize: 15, color: "#e8e9e4" }}>
              {cv.volunteering.role} · <span style={{ color: "var(--ac,#c7f536)", fontWeight: 500 }}>{cv.volunteering.org}</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.04em", color: "#8a8d83", margin: "2px 0 8px" }}>{cv.volunteering.meta}</div>
            <p style={{ margin: 0, fontFamily: "'Chakra Petch',sans-serif", fontSize: 14, lineHeight: 1.55, color: "#9a9d96" }}>{cv.volunteering.desc}</p>
          </div>

          {/* skills */}
          <div style={{ marginBottom: 26 }}>
            <SectionHeader label={t("skills")} />
            {cv.skills.map((s) => (
              <div key={s.k} style={{ display: "flex", gap: 14, padding: "9px 0", borderBottom: "1px solid #161816" }}>
                <span style={{ flex: "0 0 128px", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.14em", color: "#8a8d83" }}>{s.k}</span>
                <span style={{ fontFamily: "'Chakra Petch',sans-serif", fontSize: 14, color: "#d6d8d1" }}>{s.v}</span>
              </div>
            ))}
          </div>

          {/* languages */}
          <div>
            <SectionHeader label={t("langs")} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {cv.languages.map((l) => (
                <span key={l.k} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: "0.06em", color: "#cfd2ca", border: "1px solid #2a2c2a", padding: "7px 12px" }}>
                  {l.k} · <span style={{ color: "var(--ac,#c7f536)" }}>{l.v}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 620px) { .gq-cv-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
