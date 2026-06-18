"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Topbar from "../../_components/Topbar";
import { upsertProject } from "@/app/actions/projects";
import { imgSrc } from "@/lib/imgSrc";
import type { ProjectFlat } from "@/lib/supabase/queries";

const mono  = "'JetBrains Mono',monospace";
const sans  = "'Chakra Petch',sans-serif";
type Lang = "EN" | "ES" | "CAT";

const inputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", background: "#0a0b0a", border: "1px solid #2a2c2a", color: "#e8e9e4", fontFamily: sans, fontSize: 14, padding: "10px 12px", outline: "none" };
const monoInput: React.CSSProperties = { ...inputStyle, fontFamily: mono, fontSize: 12 };
const label: React.CSSProperties = { fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83", marginBottom: 6, display: "block" };

function Field({ l, children }: { l: string; children: React.ReactNode }) {
  return <div><span style={label}>{l}</span>{children}</div>;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 999, background: value ? "var(--ac,#c7f536)" : "#1c1e1c", border: value ? "none" : "1px solid #2a2c2a", position: "relative", cursor: "pointer", flexShrink: 0, transition: "background .2s" }}>
      <div style={{ position: "absolute", top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: value ? "#0a0b0a" : "#5a5d57", transition: "left .2s" }} />
    </div>
  );
}

function emptyForm() {
  return { no: "", name: "", org: "PERSONAL", cjk: "", kind: "", role: "", year: new Date().getFullYear().toString(), href: "", img: "", tags: [] as string[], sort_order: 1, published: true, desc_en: "", desc_es: "", desc_cat: "", long_en: "", long_es: "", long_cat: "" };
}

export default function ProjectEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const isNew   = id === "new";
  const [form,     setForm]     = useState(emptyForm());
  const [lang,     setLang]     = useState<Lang>("EN");
  const [tagInput, setTagInput] = useState("");
  const [saving,   setSaving]   = useState(false);
  const [uploading,setUploading]= useState(false);
  const [error,    setError]    = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew) return;
    fetch("/api/projects?lang=EN")
      .then(r => r.json())
      .then((list: ProjectFlat[]) => {
        const p = list.find(x => x.id === id);
        if (!p) return;
        setForm({ no: p.no, name: p.name, org: p.org, cjk: p.cjk, kind: p.kind, role: p.role, year: p.year, href: p.href, img: p.img, tags: p.tags, sort_order: p.sort_order, published: true, desc_en: p.desc_en, desc_es: p.desc_es, desc_cat: p.desc_cat, long_en: p.long_en, long_es: p.long_es, long_cat: p.long_cat });
      });
  }, [id, isNew]);

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true); setError("");
    const fd = new FormData(); fd.append("file", file);
    try {
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const body = await r.json() as { url?: string; error?: string };
      if (!r.ok || !body.url) { setError(body.error ?? "error pujant"); } else set("img", body.url);
    } catch { setError("error de xarxa"); }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.no || !form.name) { setError("no i name son obligatoris"); return; }
    setSaving(true); setError("");
    const payload = {
      ...(!isNew && !id.startsWith("static-") ? { id } : {}),
      no: form.no, name: form.name, org: form.org, cjk: form.cjk, kind: form.kind,
      role: form.role, year: form.year, href: form.href, img: form.img, tags: form.tags,
      sort_order: form.sort_order,
      desc_cat: form.desc_cat, desc_es: form.desc_es, desc_en: form.desc_en,
      long_cat: form.long_cat, long_es: form.long_es, long_en: form.long_en,
    };
    const res = await upsertProject(payload);
    setSaving(false);
    if (!res.ok) { setError(res.error ?? "error"); return; }
    router.push("/admin/projects");
  };

  const descKey = `desc_${lang.toLowerCase()}` as "desc_en" | "desc_es" | "desc_cat";
  const longKey = `long_${lang.toLowerCase()}` as "long_en" | "long_es" | "long_cat";

  const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <>
      <Topbar
        eyebrow={isNew ? "PROJECTS / NEW" : `PROJECTS / EDIT · ${form.no}`}
        title={form.name || "New Project"}
        actions={
          <>
            <Link href="/admin/projects" style={{ background: "none", border: "1px solid #2a2c2a", color: "#cfd2ca", padding: "9px 14px", fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", textDecoration: "none" }}>CANCEL</Link>
            <button onClick={handleSave} disabled={saving} style={{ background: "var(--ac,#c7f536)", border: "none", color: "#0a0b0a", padding: "9px 16px", fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>{saving ? "GUARDANT…" : "SAVE CHANGES"}</button>
          </>
        }
      />

      <div style={{ padding: "22px 24px", display: "grid", gridTemplateColumns: "1.45fr 1fr", gap: 22, alignItems: "start" }}>
        {/* left form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: 12 }}>
            <Field l="NO."><input style={inputStyle} value={form.no} onChange={e => set("no", e.target.value)} placeholder="NM·07" /></Field>
            <Field l="YEAR"><input style={inputStyle} value={form.year} onChange={e => set("year", e.target.value)} /></Field>
            <Field l="STATUS">
              <div style={{ display: "flex", alignItems: "center", gap: 10, height: 42 }}>
                <Toggle value={form.published} onChange={v => set("published", v)} />
                <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", color: form.published ? "var(--ac,#c7f536)" : "#9a9d96" }}>{form.published ? "PUBLISHED" : "DRAFT"}</span>
              </div>
            </Field>
          </div>

          <Field l="NAME"><input style={{ ...inputStyle, fontFamily: sans, fontWeight: 600, fontSize: 16 }} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Project Name" /></Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.7fr", gap: 12 }}>
            <Field l="ORG"><input style={inputStyle} value={form.org} onChange={e => set("org", e.target.value)} /></Field>
            <Field l="KIND"><input style={inputStyle} value={form.kind} onChange={e => set("kind", e.target.value)} placeholder="WEB / FRONTEND" /></Field>
            <Field l="GLYPH"><input style={{ ...inputStyle, color: "var(--ac,#c7f536)" }} value={form.cjk} onChange={e => set("cjk", e.target.value)} placeholder="文字" /></Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 12 }}>
            <Field l="ROLE"><input style={inputStyle} value={form.role} onChange={e => set("role", e.target.value)} placeholder="Full-stack" /></Field>
            <Field l="REPO URL"><input style={monoInput} value={form.href} onChange={e => set("href", e.target.value)} placeholder="https://github.com/..." /></Field>
          </div>

          <Field l="SORT ORDER"><input style={{ ...inputStyle, width: 100 }} type="number" value={form.sort_order} onChange={e => set("sort_order", parseInt(e.target.value) || 1)} /></Field>

          <Field l="TAGS">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, alignItems: "center" }}>
              {form.tags.map(t => (
                <span key={t} style={{ fontFamily: mono, fontSize: 10, color: "#cfd2ca", border: "1px solid #2a2c2a", padding: "6px 10px" }}>
                  {t} <span onClick={() => set("tags", form.tags.filter(x => x !== t))} style={{ color: "#7e8178", marginLeft: 4, cursor: "pointer" }}>✕</span>
                </span>
              ))}
              <input
                style={{ ...monoInput, width: 120, padding: "6px 10px" }}
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && tagInput.trim()) { set("tags", [...form.tags, tagInput.trim()]); setTagInput(""); e.preventDefault(); }}}
                placeholder="+ ADD"
              />
            </div>
          </Field>

          {/* per-language content */}
          <div style={{ borderTop: "1px solid #1c1e1c", paddingTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ ...label, margin: 0 }}>CONTENT // PER LANGUAGE</span>
              <div style={{ display: "flex", gap: 0, border: "1px solid #2a2c2a", padding: 3 }}>
                {(["EN","ES","CAT"] as Lang[]).map(l => (
                  <button key={l} onClick={() => setLang(l)} style={{ background: lang === l ? "var(--ac,#c7f536)" : "none", color: lang === l ? "#0a0b0a" : "#9a9d96", border: "none", fontFamily: mono, fontSize: 10, letterSpacing: "0.14em", fontWeight: lang === l ? 700 : 400, padding: "5px 10px", cursor: "pointer" }}>{l}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <Field l="SHORT DESCRIPTION"><textarea style={{ ...inputStyle, resize: "vertical", minHeight: 50 }} value={form[descKey]} onChange={e => set(descKey, e.target.value)} rows={2} /></Field>
            </div>
            <Field l="LONG DESCRIPTION"><textarea style={{ ...inputStyle, resize: "vertical", minHeight: 74 }} value={form[longKey]} onChange={e => set(longKey, e.target.value)} rows={4} /></Field>
          </div>

          {error && <div style={{ fontFamily: mono, fontSize: 11, color: "var(--pink,#ff2d8e)" }}>{error}</div>}
        </div>

        {/* right aside */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #1c1e1c", fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83" }}>COVER IMAGE</div>
            <div style={{ padding: 14 }}>
              {form.img && (
                <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", background: "#0a0b0a", border: "1px solid #2a2c2a", marginBottom: 12 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgSrc(form.img)} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.12) brightness(0.9)" }} />
                  <div style={{ position: "absolute", inset: 0, background: "var(--ac,#c7f536)", mixBlendMode: "multiply", opacity: 0.4 }} />
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
              <div onClick={() => fileRef.current?.click()} style={{ border: "1px dashed #3a3d3a", padding: 16, textAlign: "center", fontFamily: mono, fontSize: 10, letterSpacing: "0.14em", color: uploading ? "var(--ac,#c7f536)" : "#8a8d83", cursor: "pointer" }}>
                {uploading ? "PUJANT…" : "⤓ DROP IMAGE / 1600×1000"}
              </div>
            </div>
          </div>
          <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e", padding: 14 }}>
            <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83", marginBottom: 10 }}>META</div>
            {[["SLUG", slug || "–"], ["ID", isNew ? "nou" : id.slice(0,8) + "…"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #161816", fontFamily: mono, fontSize: 11 }}>
                <span style={{ color: "#7e8178" }}>{k}</span><span style={{ color: "#cfd2ca" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
