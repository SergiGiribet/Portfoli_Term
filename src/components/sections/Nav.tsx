"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useStore } from "@/lib/store";
import type { Lang } from "@/types/content";

const mono = "'JetBrains Mono',monospace";
const arch = "'Archivo Black',sans-serif";

const SECTIONS = ["top", "profile", "work", "contact"] as const;

export default function Nav() {
  const t = useTranslations();
  const { lang, setLang, activeSection, setActiveSection, termOpen, setTermOpen, isAdmin, siteSettings } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const ac  = "var(--ac,#c7f536)";
  const dim = "#9a9d96";
  const navColor = (id: string) =>
    activeSection === id || (id === "top" && !activeSection) ? ac : dim;

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
      if (e.key === "Escape") { setMenuOpen(false); return; }
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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTop = () => {
    document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
  };

  const langBtn = (l: Lang) => ({
    style: {
      background: "none", border: "none", cursor: "pointer", padding: 2,
      fontFamily: mono, fontSize: 10, letterSpacing: "0.18em",
      color: lang === l ? ac : "#7e8178",
    } as React.CSSProperties,
    onClick: () => setLang(l),
  });

  const navLinks = [
    { id: "top",     label: t("nav.index") },
    { id: "profile", label: t("nav.profile") },
    { id: "work",    label: t("nav.work") },
    { id: "contact", label: t("nav.contact") },
  ] as const;

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        height: 54, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 22px",
        background: "rgba(10,11,10,0.72)", backdropFilter: "blur(10px)",
        borderBottom: "1px solid #1c1e1c",
      }}>

        {/* logo — scroll-to-top */}
        <div
          onClick={scrollTop}
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        >
          <span style={{ width: 9, height: 18, background: ac, display: "inline-block" }} />
          <span style={{ fontFamily: arch, fontSize: 14, letterSpacing: "0.04em" }}>{siteSettings.display_name}</span>
          <span className="gq-logo-sub" style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.22em", color: "#7e8178", textTransform: "uppercase" }}>/ DEV.SYS_v2</span>
        </div>

        {/* desktop links */}
        <div className="gq-nav-links" style={{ display: "flex", alignItems: "center", gap: 26, fontFamily: mono, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          {navLinks.map(({ id, label }) => (
            <a key={id} href={`#${id}`} style={{ color: navColor(id), textDecoration: "none", transition: "color .2s" }}>{label}</a>
          ))}
        </div>

        {/* right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: mono, fontSize: 10, letterSpacing: "0.18em" }}>
          {/* terminal button — hidden on mobile */}
          <button
            onClick={() => setTermOpen(!termOpen)}
            title="Terminal (~)" aria-label="Open terminal"
            className="gq-nav-term"
            style={{ background: "none", border: "1px solid #2a2c2a", cursor: "pointer", padding: "5px 9px", fontFamily: mono, fontSize: 10, letterSpacing: "0.14em", color: "#9a9d96", transition: "all .2s" }}
            onMouseEnter={(e) => { const b = e.currentTarget; b.style.color = "#0a0b0a"; b.style.background = ac; b.style.borderColor = ac; }}
            onMouseLeave={(e) => { const b = e.currentTarget; b.style.color = "#9a9d96"; b.style.background = "none"; b.style.borderColor = "#2a2c2a"; }}
          >&gt;_</button>

          {/* lang switcher — hidden on mobile */}
          <div className="gq-nav-lang" style={{ display: "flex", gap: 8 }}>
            <button {...langBtn("CAT")}>CAT</button>
            <button {...langBtn("ES")}>ES</button>
            <button {...langBtn("EN")}>EN</button>
          </div>

          {isAdmin && (
            <a href="/admin" style={{ textDecoration: "none" }}>
              <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.18em", color: "#0a0b0a", background: "var(--pink,#ff2d8e)", padding: "3px 7px", textTransform: "uppercase", cursor: "pointer" }}>ADMIN</span>
            </a>
          )}

          {/* status badge — hidden on mobile */}
          <div className="gq-nav-status" style={{ display: "flex", alignItems: "center", gap: 7, color: "#8a8d83" }}>
            <span className="animate-gq-blink" style={{ width: 7, height: 7, borderRadius: "50%", background: ac, display: "inline-block" }} />
            <span style={{ fontSize: 9, letterSpacing: "0.2em" }}>{siteSettings.status_text}</span>
          </div>

          {/* hamburger — mobile only */}
          <button
            className="gq-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? "Tancar menú" : "Obrir menú"}
            style={{ display: "none", background: "none", border: "1px solid #2a2c2a", cursor: "pointer", padding: "5px 10px", fontFamily: mono, fontSize: 14, letterSpacing: 0, color: menuOpen ? ac : "#9a9d96", lineHeight: 1, transition: "all .2s" }}
          >{menuOpen ? "×" : "≡"}</button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed", top: 54, left: 0, right: 0, bottom: 0, zIndex: 999,
            background: "rgba(10,11,10,0.97)", backdropFilter: "blur(12px)",
            display: "flex", flexDirection: "column",
            padding: "40px 28px 40px",
            animation: "gq-rise .18s ease both",
          }}
        >
          {/* nav links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
            {navLinks.map(({ id, label }) => (
              <a
                key={id} href={`#${id}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: mono, fontSize: 13, letterSpacing: "0.22em",
                  textTransform: "uppercase", textDecoration: "none",
                  color: navColor(id),
                  padding: "16px 0",
                  borderBottom: "1px solid #1c1e1c",
                  transition: "color .2s",
                }}
              >
                <span style={{ color: "#3a3d38", marginRight: 16 }}>
                  {String(navLinks.findIndex(n => n.id === id) + 1).padStart(2, "0")}
                </span>
                {label}
              </a>
            ))}
          </div>

          {/* bottom controls */}
          <div style={{ borderTop: "1px solid #1c1e1c", paddingTop: 28, display: "flex", flexDirection: "column", gap: 20 }}>
            {/* lang */}
            <div style={{ display: "flex", gap: 0, border: "1px solid #2a2c2a", alignSelf: "flex-start" }}>
              {(["CAT", "ES", "EN"] as Lang[]).map(l => (
                <button
                  key={l}
                  onClick={() => { setLang(l); }}
                  style={{
                    background: lang === l ? ac : "none",
                    color: lang === l ? "#0a0b0a" : "#9a9d96",
                    border: "none", fontFamily: mono, fontSize: 11,
                    letterSpacing: "0.14em", fontWeight: lang === l ? 700 : 400,
                    padding: "8px 18px", cursor: "pointer",
                  }}
                >{l}</button>
              ))}
            </div>

            {/* terminal */}
            <button
              onClick={() => { setMenuOpen(false); setTermOpen(true); }}
              style={{
                background: "none", border: "1px solid #2a2c2a", cursor: "pointer",
                padding: "10px 16px", fontFamily: mono, fontSize: 10,
                letterSpacing: "0.16em", color: "#9a9d96",
                alignSelf: "flex-start", transition: "all .2s",
              }}
            >&gt;_ TERMINAL (~)</button>

            {/* status */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83" }}>
              <span className="animate-gq-blink" style={{ width: 7, height: 7, borderRadius: "50%", background: ac, display: "inline-block" }} />
              {siteSettings.status_text}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .gq-nav-links   { display: none !important; }
          .gq-nav-term    { display: none !important; }
          .gq-nav-lang    { display: none !important; }
          .gq-nav-status  { display: none !important; }
          .gq-hamburger   { display: block !important; }
          .gq-logo-sub    { display: none !important; }
        }
      `}</style>
    </>
  );
}
