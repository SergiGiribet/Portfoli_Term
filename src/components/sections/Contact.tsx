"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useStore } from "@/lib/store";
import { content } from "@/lib/content";

const mono = "'JetBrains Mono',monospace";
const sans = "'Chakra Petch',sans-serif";

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", background: "#0a0b0a",
  border: "1px solid #2a2c2a", color: "#e8e9e4", fontFamily: sans,
  fontSize: 14, padding: "10px 12px", outline: "none",
};
const labelStyle: React.CSSProperties = {
  fontFamily: mono, fontSize: 9, letterSpacing: "0.2em",
  color: "#8a8d83", marginBottom: 6, display: "block",
};

type ChannelDisplay = { label: string; val: string; href: string };
type FormState = { name: string; email: string; subject: string; body: string };
type FormErrors = { name: boolean; email: boolean; body: boolean };
type SendStatus = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const t = useTranslations();
  const { lang, setCvOpen, siteSettings } = useStore();
  const contactLine = lang === "CAT" ? siteSettings.contact_cat : lang === "ES" ? siteSettings.contact_es : siteSettings.contact_en;

  const [channels, setChannels] = useState<ChannelDisplay[]>(content.channels);
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", body: "" });
  const [errors, setErrors] = useState<FormErrors>({ name: false, email: false, body: false });
  const [status, setStatus] = useState<SendStatus>("idle");

  const fieldStyle = (hasError: boolean): React.CSSProperties => ({
    ...inputStyle,
    borderColor: hasError ? "var(--pink,#ff2d8e)" : "#2a2c2a",
    transition: "border-color .2s",
  });

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

  const set = (k: keyof FormState, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (k in errors) setErrors(e => ({ ...e, [k]: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { name: !form.name.trim(), email: !form.email.trim(), body: !form.body.trim() };
    if (newErrors.name || newErrors.email || newErrors.body) { setErrors(newErrors); return; }
    setErrors({ name: false, email: false, body: false });
    setStatus("sending");
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", body: "" });
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section id="contact" style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "90px 28px 60px", scrollMarginTop: 60 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 38, flexWrap: "wrap", animation: "gq-rise both linear", animationTimeline: "view()", animationRange: "entry 0% cover 24%" }}>
        <span style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: "clamp(34px,5vw,68px)", color: "#1c1e1c", lineHeight: 1 }}>*03</span>
        <div>
          <h2 style={{ margin: 0, fontFamily: sans, fontWeight: 700, fontSize: "clamp(24px,3.4vw,44px)", letterSpacing: "0.02em", color: "#edeee8" }}>{t("sections.contact")}</h2>
          <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.26em", color: "var(--ac,#c7f536)" }}>接続 // OPEN CHANNEL</span>
        </div>
        <span style={{ flex: 1, height: 1, background: "#1c1e1c", transform: "translateY(-6px)", minWidth: 20 }} />
      </div>

      <p style={{ margin: "0 0 36px", fontFamily: sans, fontWeight: 400, fontSize: "clamp(18px,2.4vw,30px)", lineHeight: 1.4, color: "#d6d8d1", maxWidth: 680, animation: "gq-rise both linear", animationTimeline: "view()", animationRange: "entry 4% cover 30%" }}>
        {contactLine}
      </p>

      <div style={{ margin: "-18px 0 36px" }}>
        <button
          onClick={() => setCvOpen(true)}
          style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "13px 20px", background: "none", border: "1px solid var(--ac,#c7f536)", color: "var(--ac,#c7f536)", cursor: "pointer", fontFamily: mono, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", transition: "all .2s" }}
          onMouseEnter={(e) => { const b = e.currentTarget; b.style.background = "var(--ac,#c7f536)"; b.style.color = "#0a0b0a"; }}
          onMouseLeave={(e) => { const b = e.currentTarget; b.style.background = "none"; b.style.color = "var(--ac,#c7f536)"; }}
        >{t("ui.viewCv")} ↗</button>
      </div>

      {/* channels grid */}
      <div className="gq-contact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 64, animation: "gq-rise both linear", animationTimeline: "view()", animationRange: "entry 8% cover 34%" }}>
        {channels.map((c, i) => (
          <a
            key={c.href || c.label + i} href={c.href} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", border: "1px solid #2a2c2a", background: "#0e0f0e", textDecoration: "none", transition: "all 0.2s" }}
            onMouseEnter={(e) => { const a = e.currentTarget; a.style.borderColor = "var(--ac,#c7f536)"; a.style.background = "#111210"; }}
            onMouseLeave={(e) => { const a = e.currentTarget; a.style.borderColor = "#2a2c2a"; a.style.background = "#0e0f0e"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.2em", color: "#8a8d83" }}>{c.label}</span>
              <span style={{ fontFamily: sans, fontWeight: 600, fontSize: 18, color: "#edeee8" }}>{c.val}</span>
            </div>
            <span style={{ color: "var(--ac,#c7f536)", fontFamily: mono }}>↗</span>
          </a>
        ))}
      </div>

      {/* contact form */}
      <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e", marginBottom: 72, animation: "gq-rise both linear", animationTimeline: "view()", animationRange: "entry 12% cover 38%" }}>
        <div style={{ padding: "11px 16px", borderBottom: "1px solid #1c1e1c", fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83", display: "flex", justifyContent: "space-between" }}>
          <span>TRANSMISSION // MSG_FORM</span>
          <span style={{ color: "var(--ac,#c7f536)" }}>●</span>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="gq-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <span style={{ ...labelStyle, color: errors.name ? "var(--pink,#ff2d8e)" : "#8a8d83" }}>{t("form.name")}{errors.name && " *"}</span>
              <input style={fieldStyle(errors.name)} value={form.name} onChange={e => set("name", e.target.value)} />
            </div>
            <div>
              <span style={{ ...labelStyle, color: errors.email ? "var(--pink,#ff2d8e)" : "#8a8d83" }}>{t("form.email")}{errors.email && " *"}</span>
              <input type="email" style={fieldStyle(errors.email)} value={form.email} onChange={e => set("email", e.target.value)} />
            </div>
          </div>
          <div>
            <span style={labelStyle}>{t("form.subject")}</span>
            <input style={fieldStyle(false)} value={form.subject} onChange={e => set("subject", e.target.value)} />
          </div>
          <div>
            <span style={{ ...labelStyle, color: errors.body ? "var(--pink,#ff2d8e)" : "#8a8d83" }}>{t("form.message")}{errors.body && " *"}</span>
            <textarea
              rows={5}
              style={{ ...fieldStyle(errors.body), resize: "vertical", minHeight: 110, lineHeight: 1.6 }}
              value={form.body} onChange={e => set("body", e.target.value)}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {status === "sent"  && <span style={{ fontFamily: mono, fontSize: 10, color: "var(--ac,#c7f536)" }}>{t("form.sent")}</span>}
            {status === "error" && <span style={{ fontFamily: mono, fontSize: 10, color: "var(--pink,#ff2d8e)" }}>{t("form.error")}</span>}
            {(status === "idle" || status === "sending") && <span />}
            <button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              style={{ background: status === "sent" ? "#1a1c1a" : "var(--ac,#c7f536)", border: "none", color: status === "sent" ? "var(--ac,#c7f536)" : "#0a0b0a", padding: "11px 20px", fontFamily: mono, fontSize: 10, letterSpacing: "0.18em", fontWeight: 700, cursor: status === "sending" ? "wait" : "pointer", opacity: status === "sending" ? 0.7 : 1, transition: "all .2s" }}
            >
              {status === "sending" ? t("form.sending") : t("form.send")} {status !== "sending" && "↗"}
            </button>
          </div>
        </form>
      </div>

      {/* footer */}
      <div style={{ position: "relative", borderTop: "1px solid #1c1e1c", paddingTop: 30 }}>
        <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: "clamp(56px,16vw,230px)", lineHeight: 0.8, letterSpacing: "-0.03em", color: "#121312", userSelect: "none" }}>DUCKHATS</div>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginTop: 24, fontFamily: mono, fontSize: 10, letterSpacing: "0.18em", color: "#7e8178", textTransform: "uppercase" }}>
          <span>© {siteSettings.year} {siteSettings.display_name}</span>
          <span style={{ color: "var(--ac,#c7f536)" }}>{siteSettings.slogan}</span>
          <span>EOF // {siteSettings.coords}</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 620px) { .gq-contact-grid { grid-template-columns: 1fr !important; } .gq-form-row { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
