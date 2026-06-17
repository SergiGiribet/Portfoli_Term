"use client";

import { useStore } from "@/lib/store";
import { getBio, getNav } from "@/lib/content";
import { content } from "@/lib/content";

export default function Profile() {
  const { lang } = useStore();
  const bio  = getBio(lang);
  const nav  = getNav(lang);
  const { dataSheet, stack } = content;

  return (
    <section id="profile" style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "80px 28px", scrollMarginTop: 60 }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 42, animation: "gq-rise both linear", animationTimeline: "view()", animationRange: "entry 0% cover 32%" }}>
        <span style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: "clamp(34px,5vw,68px)", color: "#1c1e1c", lineHeight: 1 }}>*01</span>
        <div>
          <h2 style={{ margin: 0, fontFamily: "'Chakra Petch',sans-serif", fontWeight: 700, fontSize: "clamp(24px,3.4vw,44px)", letterSpacing: "0.02em", color: "#edeee8" }}>{nav.profile.toUpperCase()}</h2>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.26em", color: "var(--ac,#c7f536)" }}>プロフィール // SUBJECT FILE</span>
        </div>
        <span style={{ flex: 1, height: 1, background: "#1c1e1c", transform: "translateY(-6px)" }} />
      </div>

      <div className="gq-profile-grid" style={{ display: "grid", gridTemplateColumns: "0.85fr 1.3fr 0.85fr", gap: 28, alignItems: "start" }}>
        {/* DATA SHEET */}
        <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e", animation: "gq-rise both linear", animationTimeline: "view()", animationRange: "entry 0% cover 26%" }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid #2a2c2a", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83", display: "flex", justifyContent: "space-between" }}>
            <span>DATA SHEET</span><span style={{ color: "var(--ac,#c7f536)" }}>●</span>
          </div>
          {dataSheet.map((row) => (
            <div key={row.k} style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "11px 14px", borderBottom: "1px solid #181a18", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.1em" }}>
              <span style={{ color: "#8a8d83" }}>{row.k}</span>
              <span style={{ color: "#cfd2ca", textAlign: "right" }}>{row.v}</span>
            </div>
          ))}
        </div>

        {/* BIO */}
        <div>
          <p style={{ margin: "0 0 20px", fontFamily: "'Chakra Petch',sans-serif", fontWeight: 400, fontSize: "clamp(16px,1.9vw,22px)", lineHeight: 1.6, color: "#d6d8d1" }}>{bio.p1}</p>
          <p style={{ margin: 0, fontFamily: "'Chakra Petch',sans-serif", fontWeight: 400, fontSize: "clamp(15px,1.6vw,18px)", lineHeight: 1.65, color: "#9a9d96" }}>{bio.p2}</p>
          <div style={{ marginTop: 28, display: "flex", gap: 18, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.18em", color: "#7e8178" }}>
            <span>EST. 2023</span><span>·</span><span>CATALONIA</span><span>·</span>
            <span style={{ color: "var(--ac,#c7f536)" }}>ACTIVE BUILD</span>
          </div>
        </div>

        {/* STACK */}
        <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e", animation: "gq-rise both linear", animationTimeline: "view()", animationRange: "entry 0% cover 26%" }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid #2a2c2a", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83", display: "flex", justifyContent: "space-between" }}>
            <span>STACK // 技術</span><span style={{ color: "var(--violet,#9d8dff)" }}>◆</span>
          </div>
          {stack.map((grp) => (
            <div key={grp.label} style={{ padding: "13px 14px", borderBottom: "1px solid #181a18" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83", marginBottom: 5 }}>{grp.label}</div>
              <div style={{ fontFamily: "'Chakra Petch',sans-serif", fontWeight: 500, fontSize: 14, color: "#d6d8d1" }}>{grp.items}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { .gq-profile-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
