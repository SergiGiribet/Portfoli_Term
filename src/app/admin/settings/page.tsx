"use client";

import { useEffect, useState } from "react";
import Topbar from "../_components/Topbar";
import { saveSettings } from "@/app/actions/settings";
import type { SettingsRow } from "@/lib/supabase/types";

const mono = "'JetBrains Mono',monospace";
const sans = "'Chakra Petch',sans-serif";

const inputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", background: "#0a0b0a", border: "1px solid #2a2c2a", color: "#e8e9e4", fontFamily: sans, fontSize: 14, padding: "10px 12px", outline: "none" };
const labelStyle: React.CSSProperties = { fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83", marginBottom: 6, display: "block" };

function Toggle({ value, label, onChange }: { value: boolean; label: string; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #161816" }}>
      <span style={{ fontFamily: sans, fontSize: 14, color: "#cfd2ca" }}>{label}</span>
      <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 999, background: value ? "var(--ac,#c7f536)" : "#1c1e1c", border: value ? "none" : "1px solid #2a2c2a", position: "relative", cursor: "pointer", flexShrink: 0, transition: "background .2s" }}>
        <div style={{ position: "absolute", top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: value ? "#0a0b0a" : "#5a5d57", transition: "left .2s" }} />
      </div>
    </div>
  );
}

const ACCENTS = [
  { name: "Lime",   color: "#c7f536" },
  { name: "Pink",   color: "#ff2d8e" },
  { name: "Violet", color: "#9d8dff" },
];
const LANGS = ["EN", "ES", "CAT"];

export default function SettingsPage() {
  const [form, setForm] = useState({ display_name: "GIRQUELL", slogan: "BORN TO USE. MADE TO CREATE.", accent: "Lime", default_lang: "EN", scanlines: true, boot_sequence: true, hud_cursor: false });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState("");

  useEffect(() => {
    fetch("/api/admin/settings").then(r => r.json()).then((d: SettingsRow | null) => {
      if (!d) return;
      setForm({ display_name: d.display_name, slogan: d.slogan, accent: d.accent, default_lang: d.default_lang, scanlines: d.scanlines, boot_sequence: d.boot_sequence, hud_cursor: d.hud_cursor });
    }).catch(() => {});
  }, []);

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true); setMsg("");
    document.documentElement.style.setProperty("--ac", ACCENTS.find(a => a.name === form.accent)?.color ?? "#c7f536");
    const res = await saveSettings(form);
    setSaving(false);
    setMsg(res.ok ? "Guardat ✓" : res.error ?? "Error");
    if (res.ok) setTimeout(() => setMsg(""), 2000);
  };

  return (
    <>
      <Topbar
        eyebrow="SYS.CONFIG"
        title="Settings"
        actions={
          <>
            {msg && <span style={{ fontFamily: mono, fontSize: 10, color: msg.includes("Error") ? "var(--pink,#ff2d8e)" : "var(--ac,#c7f536)" }}>{msg}</span>}
            <button onClick={handleSave} disabled={saving} style={{ background: "var(--ac,#c7f536)", border: "none", color: "#0a0b0a", padding: "9px 16px", fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>SAVE</button>
          </>
        }
      />

      <div style={{ padding: "22px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, alignItems: "start" }}>
        {/* identity */}
        <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e", padding: 16 }}>
          <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83", marginBottom: 14 }}>IDENTITY</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div><span style={labelStyle}>DISPLAY NAME</span><input style={inputStyle} value={form.display_name} onChange={e => set("display_name", e.target.value)} /></div>
            <div><span style={labelStyle}>SLOGAN</span><input style={{ ...inputStyle, color: "var(--ac,#c7f536)" }} value={form.slogan} onChange={e => set("slogan", e.target.value)} /></div>
          </div>
        </div>

        {/* accent */}
        <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e", padding: 16 }}>
          <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83", marginBottom: 14 }}>ACCENT COLOR</div>
          <div style={{ display: "flex", gap: 10 }}>
            {ACCENTS.map(a => (
              <div key={a.name} onClick={() => set("accent", a.name)}
                style={{ flex: 1, border: `1px solid ${form.accent === a.name ? a.color : "#2a2c2a"}`, background: form.accent === a.name ? "#111210" : "#0e0f0e", padding: 12, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 34, height: 34, background: a.color }} />
                <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.14em", color: form.accent === a.name ? "#edeee8" : "#9a9d96" }}>{a.name.toUpperCase()}{form.accent === a.name ? " ✓" : ""}</span>
              </div>
            ))}
          </div>
        </div>

        {/* default lang */}
        <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e", padding: 16 }}>
          <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83", marginBottom: 14 }}>DEFAULT LANGUAGE</div>
          <div style={{ display: "flex", border: "1px solid #2a2c2a", padding: 3, width: "fit-content" }}>
            {LANGS.map(l => (
              <button key={l} onClick={() => set("default_lang", l)}
                style={{ background: form.default_lang === l ? "var(--ac,#c7f536)" : "none", color: form.default_lang === l ? "#0a0b0a" : "#9a9d96", border: "none", fontFamily: mono, fontSize: 10, letterSpacing: "0.14em", fontWeight: form.default_lang === l ? 700 : 400, padding: "6px 14px", cursor: "pointer" }}>{l}</button>
            ))}
          </div>
        </div>

        {/* visual effects */}
        <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e", padding: 16 }}>
          <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83", marginBottom: 8 }}>VISUAL EFFECTS</div>
          <Toggle value={form.scanlines}     label="Scanlines overlay"  onChange={v => set("scanlines", v)} />
          <Toggle value={form.boot_sequence} label="Boot sequence"      onChange={v => set("boot_sequence", v)} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12 }}>
            <span style={{ fontFamily: sans, fontSize: 14, color: "#cfd2ca" }}>Custom HUD cursor</span>
            <div onClick={() => set("hud_cursor", !form.hud_cursor)} style={{ width: 44, height: 24, borderRadius: 999, background: form.hud_cursor ? "var(--ac,#c7f536)" : "#1c1e1c", border: form.hud_cursor ? "none" : "1px solid #2a2c2a", position: "relative", cursor: "pointer", flexShrink: 0, transition: "background .2s" }}>
              <div style={{ position: "absolute", top: 3, left: form.hud_cursor ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: form.hud_cursor ? "#0a0b0a" : "#5a5d57", transition: "left .2s" }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
