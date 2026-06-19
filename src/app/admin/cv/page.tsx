"use client";

import { useEffect, useState } from "react";
import Topbar from "../_components/Topbar";
import { saveCv } from "@/app/actions/cv";
import type { CvRow, Json } from "@/lib/supabase/types";

const mono = "'JetBrains Mono',monospace";
const sans = "'Chakra Petch',sans-serif";
type Lang = "EN" | "ES" | "CAT";

const inputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", background: "#0a0b0a", border: "1px solid #2a2c2a", color: "#e8e9e4", fontFamily: sans, fontSize: 14, padding: "9px 11px", outline: "none" };
const labelStyle: React.CSSProperties = { fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83", marginBottom: 6, display: "block" };

function Field({ l, children }: { l: string; children: React.ReactNode }) {
  return <div><span style={labelStyle}>{l}</span>{children}</div>;
}
function LangTabs({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div style={{ display: "flex", border: "1px solid #2a2c2a", padding: 3 }}>
      {(["EN","ES","CAT"] as Lang[]).map(l => (
        <button key={l} onClick={() => setLang(l)} style={{ background: lang===l ? "var(--ac,#c7f536)" : "none", color: lang===l ? "#0a0b0a" : "#9a9d96", border: "none", fontFamily: mono, fontSize: 10, letterSpacing: "0.14em", fontWeight: lang===l ? 700 : 400, padding: "5px 10px", cursor: "pointer" }}>{l}</button>
      ))}
    </div>
  );
}

interface ExpRow   { role: string; org: string; meta: string; }
interface SkillRow { k: string; v: string; }
interface LangRow  { lang: string; level: string; }
interface Identity { name: string; tagline: string; location: string; phone: string; email: string; }
interface Vol      { role: string; org: string; meta: string; desc: string; }

export default function CvPage() {
  const [lang, setLang]       = useState<Lang>("EN");
  const [identity, setIdentity] = useState<Identity>({ name: "SERGI GIRIBET", tagline: "BORN TO USE. MADE TO CREATE.", location: "Girona, ES", phone: "", email: "sergi@giribet.cat" });
  const [exp, setExp]         = useState<ExpRow[]>([]);
  const [edu, setEdu]         = useState<ExpRow[]>([]);
  const [skills, setSkills]   = useState<SkillRow[]>([]);
  const [langs, setLangs]     = useState<LangRow[]>([]);
  const [vol, setVol]         = useState<Vol>({ role: "", org: "", meta: "", desc: "" });
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState("");

  useEffect(() => {
    fetch("/api/admin/cv").then(r => r.json()).then((d: CvRow | null) => {
      if (!d) return;
      if (d.identity && typeof d.identity === "object") setIdentity(d.identity as unknown as Identity);
      if (Array.isArray(d.experience)) setExp(d.experience as unknown as ExpRow[]);
      if (Array.isArray(d.education))  setEdu(d.education as unknown as ExpRow[]);
      if (Array.isArray(d.skills))     setSkills(d.skills as unknown as SkillRow[]);
      if (Array.isArray(d.languages))  setLangs(d.languages as unknown as LangRow[]);
      if (d.volunteering && typeof d.volunteering === "object") setVol(d.volunteering as unknown as Vol);
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true); setMsg("");
    const res = await saveCv({ identity: identity as unknown as Json, experience: exp as unknown as Json, education: edu as unknown as Json, skills: skills as unknown as Json, languages: langs as unknown as Json, volunteering: vol as unknown as Json });
    setSaving(false);
    setMsg(res.ok ? "Guardat ✓" : res.error ?? "Error");
    if (res.ok) setTimeout(() => setMsg(""), 2000);
  };

  const setId = (k: keyof Identity, v: string) => setIdentity(i => ({ ...i, [k]: v }));

  return (
    <>
      <Topbar
        eyebrow="履歴書 // OPERATOR FILE"
        title="CV / Resume"
        actions={
          <>
            <LangTabs lang={lang} setLang={setLang} />
            <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", color: "#cfd2ca", border: "1px solid #2a2c2a", padding: "9px 14px" }}>PREVIEW PDF</span>
            {msg && <span style={{ fontFamily: mono, fontSize: 10, color: msg.includes("Error") ? "var(--pink,#ff2d8e)" : "var(--ac,#c7f536)" }}>{msg}</span>}
            <button onClick={handleSave} disabled={saving} style={{ background: "var(--ac,#c7f536)", border: "none", color: "#0a0b0a", padding: "9px 16px", fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>SAVE</button>
          </>
        }
      />

      <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
        {/* identity */}
        <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e", padding: 16 }}>
          <div style={{ ...labelStyle, marginBottom: 12 }}>IDENTITY</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 12, marginBottom: 12 }}>
            <Field l="NAME"><input style={inputStyle} value={identity.name} onChange={e => setId("name", e.target.value)} /></Field>
            <Field l="TAGLINE"><input style={{ ...inputStyle, color: "var(--ac,#c7f536)" }} value={identity.tagline} onChange={e => setId("tagline", e.target.value)} /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.3fr", gap: 12 }}>
            <Field l="LOCATION"><input style={inputStyle} value={identity.location} onChange={e => setId("location", e.target.value)} /></Field>
            <Field l="PHONE"><input style={inputStyle} value={identity.phone} onChange={e => setId("phone", e.target.value)} /></Field>
            <Field l="EMAIL"><input style={inputStyle} value={identity.email} onChange={e => setId("email", e.target.value)} /></Field>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
          {/* left col */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* experience */}
            <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 14px", borderBottom: "1px solid #1c1e1c", fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83" }}>
                <span>EXPERIENCE</span>
                <span onClick={() => setExp(e => [...e, { role: "", org: "", meta: "" }])} style={{ color: "var(--ac,#c7f536)", cursor: "pointer" }}>+ ENTRY</span>
              </div>
              {exp.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 11, padding: "11px 14px", borderBottom: "1px solid #161816", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: mono, fontSize: 13, color: "#5a5d57", cursor: "grab", paddingTop: 4 }}>⠿</span>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    <input style={{ ...inputStyle, fontFamily: sans, fontWeight: 700, fontSize: 14 }} value={e.role} onChange={ev => setExp(ex => ex.map((r,j) => j===i ? { ...r, role: ev.target.value } : r))} placeholder="Role" />
                    <input style={{ ...inputStyle, color: "var(--ac,#c7f536)", fontSize: 13 }} value={e.org}  onChange={ev => setExp(ex => ex.map((r,j) => j===i ? { ...r, org:  ev.target.value } : r))} placeholder="Organisation" />
                    <input style={{ ...inputStyle, fontFamily: mono, fontSize: 10 }} value={e.meta} onChange={ev => setExp(ex => ex.map((r,j) => j===i ? { ...r, meta: ev.target.value } : r))} placeholder="2024 – Present" />
                  </div>
                  <span onClick={() => setExp(ex => ex.filter((_,j) => j!==i))} style={{ fontFamily: mono, fontSize: 11, color: "var(--pink,#ff2d8e)", cursor: "pointer", paddingTop: 4 }}>✕</span>
                </div>
              ))}
            </div>

            {/* education */}
            <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 14px", borderBottom: "1px solid #1c1e1c", fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83" }}>
                <span>EDUCATION</span>
                <span onClick={() => setEdu(e => [...e, { role: "", org: "", meta: "" }])} style={{ color: "var(--ac,#c7f536)", cursor: "pointer" }}>+ ENTRY</span>
              </div>
              {edu.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 11, padding: "11px 14px", borderBottom: "1px solid #161816", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: mono, fontSize: 13, color: "#5a5d57", cursor: "grab", paddingTop: 4 }}>⠿</span>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    <input style={{ ...inputStyle, fontFamily: sans, fontWeight: 700, fontSize: 14 }} value={e.role} onChange={ev => setEdu(ex => ex.map((r,j) => j===i ? { ...r, role: ev.target.value } : r))} placeholder="Degree / Program" />
                    <input style={{ ...inputStyle, color: "var(--ac,#c7f536)", fontSize: 13 }} value={e.org}  onChange={ev => setEdu(ex => ex.map((r,j) => j===i ? { ...r, org:  ev.target.value } : r))} placeholder="Institution" />
                    <input style={{ ...inputStyle, fontFamily: mono, fontSize: 10 }} value={e.meta} onChange={ev => setEdu(ex => ex.map((r,j) => j===i ? { ...r, meta: ev.target.value } : r))} placeholder="2023 – Present" />
                  </div>
                  <span onClick={() => setEdu(ex => ex.filter((_,j) => j!==i))} style={{ fontFamily: mono, fontSize: 11, color: "var(--pink,#ff2d8e)", cursor: "pointer", paddingTop: 4 }}>✕</span>
                </div>
              ))}
            </div>
          </div>

          {/* right col */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* skills */}
            <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 14px", borderBottom: "1px solid #1c1e1c", fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83" }}>
                <span>SKILLS</span>
                <span onClick={() => setSkills(s => [...s, { k: "", v: "" }])} style={{ color: "var(--ac,#c7f536)", cursor: "pointer" }}>+ ROW</span>
              </div>
              {skills.map((s, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "0.5fr 1.5fr 24px", gap: 10, padding: "9px 14px", borderBottom: "1px solid #161816", alignItems: "center" }}>
                  <input style={{ ...inputStyle, fontFamily: mono, fontSize: 10, letterSpacing: "0.1em", color: "#8a8d83" }} value={s.k} onChange={e => setSkills(sk => sk.map((r,j) => j===i ? { ...r, k: e.target.value } : r))} placeholder="Category" />
                  <input style={{ ...inputStyle, fontSize: 12 }} value={s.v} onChange={e => setSkills(sk => sk.map((r,j) => j===i ? { ...r, v: e.target.value } : r))} placeholder="item1, item2" />
                  <span onClick={() => setSkills(sk => sk.filter((_,j) => j!==i))} style={{ fontFamily: mono, fontSize: 12, color: "#5a5d57", textAlign: "center", cursor: "pointer" }}>✕</span>
                </div>
              ))}
            </div>

            {/* languages */}
            <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e", padding: "11px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83" }}>
                <span>LANGUAGES</span>
                <span onClick={() => setLangs(l => [...l, { lang: "", level: "" }])} style={{ color: "var(--ac,#c7f536)", cursor: "pointer" }}>+ ROW</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {langs.map((l, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input style={{ ...inputStyle, width: 90, padding: "5px 8px", fontFamily: mono, fontSize: 10 }} value={l.lang} onChange={e => setLangs(ls => ls.map((r,j) => j===i ? { ...r, lang: e.target.value } : r))} placeholder="Language" />
                    <input style={{ ...inputStyle, width: 90, padding: "5px 8px", fontFamily: mono, fontSize: 10, color: "var(--ac,#c7f536)" }} value={l.level} onChange={e => setLangs(ls => ls.map((r,j) => j===i ? { ...r, level: e.target.value } : r))} placeholder="Level" />
                    <span onClick={() => setLangs(ls => ls.filter((_,j) => j!==i))} style={{ fontFamily: mono, fontSize: 12, color: "#5a5d57", cursor: "pointer" }}>✕</span>
                  </div>
                ))}
              </div>
            </div>

            {/* volunteering */}
            <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e", padding: "11px 14px" }}>
              <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83", marginBottom: 9 }}>VOLUNTEERING</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <input style={{ ...inputStyle, fontFamily: sans, fontWeight: 700, fontSize: 14 }} value={vol.role} onChange={e => setVol(v => ({ ...v, role: e.target.value }))} placeholder="Role" />
                  <input style={{ ...inputStyle, color: "var(--ac,#c7f536)", fontSize: 13 }} value={vol.org}  onChange={e => setVol(v => ({ ...v, org:  e.target.value }))} placeholder="Organisation" />
                </div>
                <input style={{ ...inputStyle, fontFamily: mono, fontSize: 10 }} value={vol.meta} onChange={e => setVol(v => ({ ...v, meta: e.target.value }))} placeholder="Mar 2021 – May 2023" />
                <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 60, fontSize: 12, lineHeight: 1.5, color: "#9a9d96" }} value={vol.desc} onChange={e => setVol(v => ({ ...v, desc: e.target.value }))} rows={3} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
