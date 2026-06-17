"use client";

import { useEffect, useCallback } from "react";
import { useStore } from "@/lib/store";
import { getNav } from "@/lib/content";
import type { Lang } from "@/types/content";

const SECTIONS = ["top", "profile", "work", "contact"] as const;

export default function Nav() {
  const { lang, setLang, activeSection, setActiveSection, termOpen, setTermOpen } = useStore();
  const nav = getNav(lang);

  const ac = "var(--ac,#c7f536)";
  const dim = "#9a9d96";

  const navColor = (id: string) =>
    (activeSection === id || (id === "top" && !activeSection)) ? ac : dim;

  useEffect(() => {
    const threshold = window.innerHeight * 0.34;
    const onScroll = () => {
      let active: typeof SECTIONS[number] = "top";
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= threshold) active = id;
      }
      setActiveSection(active);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [setActiveSection]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "`" || e.key === "~") {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        setTermOpen(!termOpen);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [termOpen, setTermOpen]);

  const langBtn = (l: Lang) => ({
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 2,
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 10,
      letterSpacing: "0.18em",
      color: lang === l ? ac : "#7e8178",
    } as React.CSSProperties,
    onClick: () => setLang(l),
  });

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      height: 54, display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 22px",
      background: "rgba(10,11,10,0.72)", backdropFilter: "blur(10px)",
      borderBottom: "1px solid #1c1e1c",
    }}>
      {/* logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 9, height: 18, background: "var(--ac,#c7f536)", display: "inline-block" }} />
        <span style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 14, letterSpacing: "0.04em" }}>GIRQUELL</span>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.22em", color: "#7e8178", textTransform: "uppercase" }}>/ DEV.SYS_v2</span>
      </div>

      {/* links (hidden ≤860px via inline media) */}
      <div className="gq-nav-links" style={{ display: "flex", alignItems: "center", gap: 26, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>
        {(["top","profile","work","contact"] as const).map((id, idx) => {
          const label = [nav.index, nav.profile, nav.work, nav.contact][idx];
          return (
            <a key={id} href={`#${id}`} style={{ color: navColor(id), textDecoration: "none", transition: "color .2s" }}>{label}</a>
          );
        })}
      </div>

      {/* right controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.18em" }}>
        <button
          onClick={() => setTermOpen(!termOpen)}
          title="Terminal (~)"
          aria-label="Open terminal"
          style={{ background: "none", border: "1px solid #2a2c2a", cursor: "pointer", padding: "5px 9px", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.14em", color: "#9a9d96", transition: "all .2s" }}
          onMouseEnter={(e) => { const b = e.currentTarget; b.style.color = "#0a0b0a"; b.style.background = "var(--ac,#c7f536)"; b.style.borderColor = "var(--ac,#c7f536)"; }}
          onMouseLeave={(e) => { const b = e.currentTarget; b.style.color = "#9a9d96"; b.style.background = "none"; b.style.borderColor = "#2a2c2a"; }}
        >&gt;_</button>

        <div style={{ display: "flex", gap: 8 }}>
          <button {...langBtn("CAT")}>CAT</button>
          <button {...langBtn("ES")}>ES</button>
          <button {...langBtn("EN")}>EN</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#8a8d83" }}>
          <span className="animate-gq-blink" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--ac,#c7f536)", display: "inline-block" }} />
          <span style={{ fontSize: 9, letterSpacing: "0.2em" }}>ON BREAK</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { .gq-nav-links { display: none !important; } }
      `}</style>
    </nav>
  );
}
