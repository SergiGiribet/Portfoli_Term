"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useStore } from "@/lib/store";
import { getContact, content } from "@/lib/content";

type ChannelDisplay = { label: string; val: string; href: string };

export default function Contact() {
  const t = useTranslations();
  const { lang, setCvOpen } = useStore();
  const contactLine = getContact(lang);
  const { identity } = content;

  const [channels, setChannels] = useState<ChannelDisplay[]>(content.channels);

  useEffect(() => {
    fetch("/api/channels")
      .then(r => r.json())
      .then((data: { label: string; value: string; href: string }[] | null) => {
        if (data && data.length > 0) {
          setChannels(data.map(c => ({ label: c.label, val: c.value, href: c.href })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="contact" style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "90px 28px 60px", scrollMarginTop: 60 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 38, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: "clamp(34px,5vw,68px)", color: "#1c1e1c", lineHeight: 1 }}>*03</span>
        <div>
          <h2 style={{ margin: 0, fontFamily: "'Chakra Petch',sans-serif", fontWeight: 700, fontSize: "clamp(24px,3.4vw,44px)", letterSpacing: "0.02em", color: "#edeee8" }}>{t("sections.contact")}</h2>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.26em", color: "var(--ac,#c7f536)" }}>接続 // OPEN CHANNEL</span>
        </div>
        <span style={{ flex: 1, height: 1, background: "#1c1e1c", transform: "translateY(-6px)", minWidth: 20 }} />
      </div>

      <p style={{ margin: "0 0 36px", fontFamily: "'Chakra Petch',sans-serif", fontWeight: 400, fontSize: "clamp(18px,2.4vw,30px)", lineHeight: 1.4, color: "#d6d8d1", maxWidth: 680 }}>
        {contactLine}
      </p>

      <div style={{ margin: "-18px 0 36px" }}>
        <button
          onClick={() => setCvOpen(true)}
          style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "13px 20px", background: "none", border: "1px solid var(--ac,#c7f536)", color: "var(--ac,#c7f536)", cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", transition: "all .2s" }}
          onMouseEnter={(e) => { const b = e.currentTarget; b.style.background = "var(--ac,#c7f536)"; b.style.color = "#0a0b0a"; }}
          onMouseLeave={(e) => { const b = e.currentTarget; b.style.background = "none"; b.style.color = "var(--ac,#c7f536)"; }}
        >{t("ui.viewCv")} ↗</button>
      </div>

      <div className="gq-contact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 64 }}>
        {channels.map((c, i) => (
          <a
            key={c.href || c.label + i} href={c.href} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", border: "1px solid #2a2c2a", background: "#0e0f0e", textDecoration: "none", transition: "all 0.2s" }}
            onMouseEnter={(e) => { const a = e.currentTarget; a.style.borderColor = "var(--ac,#c7f536)"; a.style.background = "#111210"; }}
            onMouseLeave={(e) => { const a = e.currentTarget; a.style.borderColor = "#2a2c2a"; a.style.background = "#0e0f0e"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.2em", color: "#8a8d83" }}>{c.label}</span>
              <span style={{ fontFamily: "'Chakra Petch',sans-serif", fontWeight: 600, fontSize: 18, color: "#edeee8" }}>{c.val}</span>
            </div>
            <span style={{ color: "var(--ac,#c7f536)", fontFamily: "'JetBrains Mono',monospace" }}>↗</span>
          </a>
        ))}
      </div>

      {/* footer */}
      <div style={{ position: "relative", borderTop: "1px solid #1c1e1c", paddingTop: 30 }}>
        <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: "clamp(56px,16vw,230px)", lineHeight: 0.8, letterSpacing: "-0.03em", color: "#121312", userSelect: "none" }}>DUCKHATS</div>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginTop: 24, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.18em", color: "#7e8178", textTransform: "uppercase" }}>
          <span>© {identity.year} SERGI GIRIBET // GIRQUELL</span>
          <span style={{ color: "var(--ac,#c7f536)" }}>{identity.slogan}</span>
          <span>EOF // {identity.coords}</span>
        </div>
      </div>

      <style>{`@media (max-width: 620px) { .gq-contact-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
