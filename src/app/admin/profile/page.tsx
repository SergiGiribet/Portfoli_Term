"use client";

import { useEffect, useState } from "react";
import Topbar from "../_components/Topbar";
import { saveProfile } from "@/app/actions/profile";
import type { ProfileRow, Json } from "@/lib/supabase/types";

const mono = "'JetBrains Mono',monospace";
const sans = "'Chakra Petch',sans-serif";
type Lang = "EN" | "ES" | "CAT";

const inputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", background: "#0a0b0a", border: "1px solid #2a2c2a", color: "#e8e9e4", fontFamily: sans, fontSize: 13, padding: "8px 10px", outline: "none" };
const monoInput: React.CSSProperties = { ...inputStyle, fontFamily: mono, fontSize: 10, letterSpacing: "0.1em", color: "#8a8d83" };
const labelStyle: React.CSSProperties = { fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83", marginBottom: 6, display: "block" };

interface SheetRow { k: string; v: string; }
interface StackRow { label: string; items: string; }

function LangTabs({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div style={{ display: "flex", border: "1px solid #2a2c2a", padding: 3 }}>
      {(["EN","ES","CAT"] as Lang[]).map(l => (
        <button key={l} onClick={() => setLang(l)} style={{ background: lang===l ? "var(--ac,#c7f536)" : "none", color: lang===l ? "#0a0b0a" : "#9a9d96", border: "none", fontFamily: mono, fontSize: 10, letterSpacing: "0.14em", fontWeight: lang===l ? 700 : 400, padding: "5px 10px", cursor: "pointer" }}>{l}</button>
      ))}
    </div>
  );
}

const DEFAULT_SHEET: SheetRow[] = [{ k: "STATUS", v: "OPERATIONAL" }, { k: "BASE", v: "CATALONIA, ES" }, { k: "ROLE", v: "MULTIPLATFORM DEV" }, { k: "STUDY", v: "CS ENGINEERING" }, { k: "VENTURE", v: "DUCKHATS // FOUNDER" }, { k: "STATE", v: "ON BREAK" }];
const DEFAULT_STACK: StackRow[] = [{ label: "LANGUAGES", items: "JavaScript · TypeScript · HTML/CSS" }, { label: "WEB / RUNTIME", items: "Node.js · React · REST" }, { label: "SYSTEMS", items: "Raspberry Pi · Linux · IoT" }, { label: "TOOLS", items: "Git · GitHub · Figma" }];

export default function ProfilePage() {
  const [lang, setLang]     = useState<Lang>("EN");
  const [sheet, setSheet]   = useState<SheetRow[]>(DEFAULT_SHEET);
  const [bio1, setBio1]     = useState({ EN: "", ES: "", CAT: "" });
  const [bio2, setBio2]     = useState({ EN: "", ES: "", CAT: "" });
  const [stack, setStack]   = useState<StackRow[]>(DEFAULT_STACK);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState("");

  useEffect(() => {
    fetch("/api/admin/profile").then(r => r.json()).then((d: ProfileRow | null) => {
      if (!d) return;
      if (Array.isArray(d.sheet)) setSheet(d.sheet as unknown as SheetRow[]);
      setBio1({ EN: d.bio1_en, ES: d.bio1_es, CAT: d.bio1_cat });
      setBio2({ EN: d.bio2_en, ES: d.bio2_es, CAT: d.bio2_cat });
      if (Array.isArray(d.stack)) setStack(d.stack as unknown as StackRow[]);
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true); setMsg("");
    const res = await saveProfile({
      sheet: sheet as unknown as Json,
      bio1_en: bio1.EN, bio1_es: bio1.ES, bio1_cat: bio1.CAT,
      bio2_en: bio2.EN, bio2_es: bio2.ES, bio2_cat: bio2.CAT,
      stack: stack as unknown as Json,
    });
    setSaving(false);
    setMsg(res.ok ? "Guardat ✓" : res.error ?? "Error");
    if (res.ok) setTimeout(() => setMsg(""), 2000);
  };

  const setSheetRow  = (i: number, k: keyof SheetRow, v: string) => setSheet(s => s.map((r,j) => j===i ? { ...r, [k]: v } : r));
  const setStackRow  = (i: number, k: keyof StackRow, v: string) => setStack(s => s.map((r,j) => j===i ? { ...r, [k]: v } : r));

  return (
    <>
      <Topbar
        eyebrow="プロフィール // SUBJECT FILE"
        title="Profile"
        actions={
          <>
            <LangTabs lang={lang} setLang={setLang} />
            {msg && <span style={{ fontFamily: mono, fontSize: 10, color: msg.includes("Error") ? "var(--pink,#ff2d8e)" : "var(--ac,#c7f536)" }}>{msg}</span>}
            <button onClick={handleSave} disabled={saving} style={{ background: "var(--ac,#c7f536)", border: "none", color: "#0a0b0a", padding: "9px 16px", fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>SAVE</button>
          </>
        }
      />

      <div style={{ padding: "22px 24px", display: "grid", gridTemplateColumns: "0.95fr 1.05fr", gap: 22, alignItems: "start" }}>
        {/* data sheet */}
        <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 14px", borderBottom: "1px solid #1c1e1c", fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83" }}>
            <span>DATA SHEET</span>
            <span onClick={() => setSheet(s => [...s, { k: "", v: "" }])} style={{ color: "var(--ac,#c7f536)", cursor: "pointer" }}>+ ROW</span>
          </div>
          <div style={{ padding: "8px 0" }}>
            {sheet.map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "0.7fr 1.3fr 24px", gap: 10, alignItems: "center", padding: "8px 14px" }}>
                <input style={monoInput} value={r.k} onChange={e => setSheetRow(i, "k", e.target.value)} />
                <input style={inputStyle} value={r.v} onChange={e => setSheetRow(i, "v", e.target.value)} />
                <span onClick={() => setSheet(s => s.filter((_,j) => j!==i))} style={{ fontFamily: mono, fontSize: 12, color: "#5a5d57", textAlign: "center", cursor: "pointer" }}>✕</span>
              </div>
            ))}
          </div>
        </div>

        {/* bio + stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <span style={labelStyle}>BIO — PARAGRAPH 1</span>
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 64, fontFamily: sans, fontSize: 15, lineHeight: 1.6, color: "#cfd2ca" }} value={bio1[lang]} onChange={e => setBio1(b => ({ ...b, [lang]: e.target.value }))} rows={3} />
          </div>
          <div>
            <span style={labelStyle}>BIO — PARAGRAPH 2</span>
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 54, fontFamily: sans, fontSize: 15, lineHeight: 1.6, color: "#cfd2ca" }} value={bio2[lang]} onChange={e => setBio2(b => ({ ...b, [lang]: e.target.value }))} rows={2} />
          </div>

          {/* stack */}
          <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 14px", borderBottom: "1px solid #1c1e1c", fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83" }}>
              <span>STACK // 技術</span>
              <span onClick={() => setStack(s => [...s, { label: "", items: "" }])} style={{ color: "var(--ac,#c7f536)", cursor: "pointer" }}>+ GROUP</span>
            </div>
            {stack.map((s, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "0.7fr 1.5fr", gap: 10, padding: "9px 14px", borderBottom: "1px solid #161816" }}>
                <input style={monoInput} value={s.label} onChange={e => setStackRow(i, "label", e.target.value)} placeholder="GROUP" />
                <input style={inputStyle} value={s.items} onChange={e => setStackRow(i, "items", e.target.value)} placeholder="item1 · item2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
