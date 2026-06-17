"use client";

import { useStore } from "@/lib/store";
import { getProjects, getNav } from "@/lib/content";

export default function Work() {
  const { lang, openDetail } = useStore();
  const projects = getProjects(lang);
  const nav = getNav(lang);

  return (
    <section id="work" style={{ position: "relative", background: "#0c0d0c", borderTop: "1px solid #1c1e1c", borderBottom: "1px solid #1c1e1c", scrollMarginTop: 60 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 28px" }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 42, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: "clamp(34px,5vw,68px)", color: "#1c1e1c", lineHeight: 1 }}>*02</span>
          <div>
            <h2 style={{ margin: 0, fontFamily: "'Chakra Petch',sans-serif", fontWeight: 700, fontSize: "clamp(24px,3.4vw,44px)", letterSpacing: "0.02em", color: "#edeee8" }}>{nav.work.toUpperCase()}</h2>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.26em", color: "var(--ac,#c7f536)" }}>選抜作品 // FIELD LOG</span>
          </div>
          <span style={{ flex: 1, height: 1, background: "#1c1e1c", transform: "translateY(-6px)", minWidth: 20 }} />
          <a
            href="https://github.com/SergiGiribet" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.16em", color: "#9a9d96", textDecoration: "none", border: "1px solid #2a2c2a", padding: "8px 12px", whiteSpace: "nowrap", transition: "all .2s" }}
            onMouseEnter={(e) => { const a = e.currentTarget; a.style.color = "#0a0b0a"; a.style.background = "var(--ac,#c7f536)"; a.style.borderColor = "var(--ac,#c7f536)"; }}
            onMouseLeave={(e) => { const a = e.currentTarget; a.style.color = "#9a9d96"; a.style.background = "none"; a.style.borderColor = "#2a2c2a"; }}
          >
            ARCHIVE // ALL REPOS ↗
          </a>
        </div>

        {/* grid */}
        <div className="gq-work-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {projects.map((p, i) => (
            <a
              key={p.no}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { e.preventDefault(); openDetail(i); }}
              style={{ display: "flex", flexDirection: "column", border: "1px solid #2a2c2a", background: "#0e0f0e", textDecoration: "none", color: "inherit", cursor: "pointer", transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s", animation: "gq-rise both linear", animationTimeline: "view()", animationRange: "entry 0% cover 24%" }}
              onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--ac,#c7f536)"; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 0 0 1px var(--ac,#c7f536), 0 18px 44px -22px var(--ac,#c7f536)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = "#2a2c2a"; el.style.transform = ""; el.style.boxShadow = ""; }}
            >
              {/* card header */}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 14px", borderBottom: "1px solid #1c1e1c", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.16em", color: "#8a8d83" }}>
                <span>{p.no} · {p.org}</span>
                <span style={{ color: "var(--ac,#c7f536)" }}>{p.cjk}</span>
              </div>

              {/* image */}
              <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", background: "#0a0b0a" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/${p.img}`} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.12) brightness(0.9)", zIndex: 0 }} />
                <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "var(--ac,#c7f536)", mixBlendMode: "multiply", opacity: 0.4, pointerEvents: "none" }} />
                <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 1px, transparent 1px 3px)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "radial-gradient(130% 100% at 50% 0%, transparent 38%, rgba(0,0,0,0.62))", pointerEvents: "none" }} />
                <span style={{ position: "absolute", top: 8, left: 8, width: 13, height: 13, borderTop: "1px solid var(--ac,#c7f536)", borderLeft: "1px solid var(--ac,#c7f536)", zIndex: 3 }} />
                <span style={{ position: "absolute", bottom: 8, left: 11, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.2em", color: "#dfe2da", zIndex: 3 }}>{p.kind}</span>
                <span style={{ position: "absolute", bottom: 8, right: 11, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.16em", color: "var(--ac,#c7f536)", zIndex: 3 }}>{p.no}</span>
              </div>

              {/* body */}
              <div style={{ padding: "16px 14px 18px" }}>
                <h3 style={{ margin: "0 0 8px", fontFamily: "'Chakra Petch',sans-serif", fontWeight: 700, fontSize: 21, letterSpacing: "0.01em", color: "#edeee8" }}>{p.name}</h3>
                <p style={{ margin: "0 0 16px", fontFamily: "'Chakra Petch',sans-serif", fontWeight: 400, fontSize: 13, lineHeight: 1.5, color: "#8a8d86", minHeight: 38 }}>{p.descL}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                  {p.tags.map((t) => (
                    <span key={t} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a9d96", border: "1px solid #2a2c2a", padding: "4px 8px" }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.16em", color: "var(--ac,#c7f536)" }}>
                  <span>INSPECT</span><span>+</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) { .gq-work-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 620px) { .gq-work-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
