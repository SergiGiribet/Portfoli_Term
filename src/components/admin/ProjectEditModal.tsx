"use client";

import { useState, useRef } from "react";
import { upsertProject, deleteProject } from "@/app/actions/projects";
import type { ProjectFlat } from "@/app/actions/projects";
import { imgSrc } from "@/lib/imgSrc";

const AC   = "var(--ac,#c7f536)";
const PINK = "var(--pink,#ff2d8e)";
const mono = "'JetBrains Mono',monospace";
const sans = "'Chakra Petch',sans-serif";

type LangTab = "CAT" | "ES" | "EN";

interface Props {
  project?: ProjectFlat;
  nextOrder: number;
  onClose: () => void;
  onSaved: () => void;
}

function emptyForm(nextOrder: number) {
  return {
    no: "", name: "", org: "PERSONAL", cjk: "", kind: "", role: "",
    year: new Date().getFullYear().toString(), href: "", img: "",
    tags: "", sort_order: nextOrder,
    desc_cat: "", desc_es: "", desc_en: "",
    long_cat: "", long_es: "", long_en: "",
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83", marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  background: "#0a0b0a", border: "1px solid #2a2c2a",
  color: "#e8e9e4", fontFamily: mono, fontSize: 12,
  padding: "8px 10px", outline: "none",
  transition: "border-color .15s",
};

const taStyle: React.CSSProperties = { ...inputStyle, resize: "vertical", minHeight: 60, fontFamily: sans, fontSize: 13 };

export default function ProjectEditModal({ project, nextOrder, onClose, onSaved }: Props) {
  const isNew = !project;
  const [tab, setTab] = useState<"basic" | "desc">("basic");
  const [lang, setLang] = useState<LangTab>("CAT");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(() => {
    if (!project) return emptyForm(nextOrder);
    return {
      no:         project.no,
      name:       project.name,
      org:        project.org,
      cjk:        project.cjk,
      kind:       project.kind,
      role:       project.role,
      year:       project.year,
      href:       project.href,
      img:        project.img,
      tags:       project.tags.join(", "),
      sort_order: project.sort_order,
      desc_cat:   project.desc_cat ?? "",
      desc_es:    project.desc_es  ?? "",
      desc_en:    project.desc_en  ?? "",
      long_cat:   project.long_cat ?? "",
      long_es:    project.long_es  ?? "",
      long_en:    project.long_en  ?? "",
    };
  });

  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setError("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const body = await r.json() as { url?: string; error?: string };
      if (!r.ok || !body.url) { setError(body.error ?? "error pujant imatge"); }
      else set("img", body.url);
    } catch { setError("error de xarxa pujant imatge"); }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.no || !form.name) { setError("no i name son obligatoris"); return; }
    setSaving(true); setError("");
    const payload = {
      ...(project && !project.id.startsWith("static-") ? { id: project.id } : {}),
      no:         form.no,
      name:       form.name,
      org:        form.org,
      cjk:        form.cjk,
      kind:       form.kind,
      role:       form.role,
      year:       form.year,
      href:       form.href,
      img:        form.img,
      tags:       form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      sort_order: form.sort_order,
      desc_cat:   form.desc_cat,
      desc_es:    form.desc_es,
      desc_en:    form.desc_en,
      long_cat:   form.long_cat,
      long_es:    form.long_es,
      long_en:    form.long_en,
    };
    const res = await upsertProject(payload);
    setSaving(false);
    if (!res.ok) { setError(res.error ?? "error desconegut"); return; }
    onSaved();
  };

  const handleDelete = async () => {
    if (!project || project.id.startsWith("static-")) { setError("no es pot eliminar un projecte estàtic"); return; }
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    const res = await deleteProject(project.id);
    setDeleting(false);
    if (!res.ok) { setError(res.error ?? "error eliminant"); return; }
    onSaved();
  };

  const tabBtn = (id: "basic" | "desc", label: string) => (
    <button
      onClick={() => setTab(id)}
      style={{ background: "none", border: "none", cursor: "pointer", fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", padding: "8px 14px", borderBottom: tab === id ? `2px solid ${AC}` : "2px solid transparent", color: tab === id ? "var(--ac,#c7f536)" : "#8a8d83", transition: "color .15s" }}
    >{label}</button>
  );

  const langBtn = (l: LangTab) => (
    <button key={l} onClick={() => setLang(l)}
      style={{ background: lang === l ? "var(--ac,#c7f536)" : "none", border: "1px solid", borderColor: lang === l ? "var(--ac,#c7f536)" : "#2a2c2a", cursor: "pointer", fontFamily: mono, fontSize: 9, letterSpacing: "0.14em", padding: "4px 9px", color: lang === l ? "#0a0b0a" : "#8a8d83", transition: "all .15s" }}
    >{l}</button>
  );

  const descKey  = `desc_${lang.toLowerCase()}` as "desc_cat" | "desc_es" | "desc_en";
  const longKey  = `long_${lang.toLowerCase()}` as "long_cat" | "long_es" | "long_en";

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 10040, background: "rgba(5,6,5,0.8)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", boxSizing: "border-box", overflowY: "auto" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", width: "100%", maxWidth: 680, background: "#0c0d0c", border: "1px solid #2a2c2a", boxShadow: "0 30px 90px -30px rgba(0,0,0,0.9)", animation: "gq-rise .2s ease both" }}
      >
        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 18px", borderBottom: "1px solid #2a2c2a", fontFamily: mono, fontSize: 10, letterSpacing: "0.18em", color: "#8a8d83" }}>
          <span style={{ color: PINK }}>{isNew ? "NEW PROJECT" : `EDIT // ${project.no}`}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#8a8d83", fontFamily: mono, fontSize: 11, padding: "2px 6px" }}>✕</button>
        </div>

        {/* tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #1c1e1c" }}>
          {tabBtn("basic", "BÀSIC")}
          {tabBtn("desc", "DESCRIPCIONS")}
        </div>

        <div style={{ padding: "20px 22px 24px" }}>
          {tab === "basic" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 22px" }}>
              <Field label="NO (ID)">
                <input style={inputStyle} value={form.no} onChange={(e) => set("no", e.target.value)} placeholder="NM·07" />
              </Field>
              <Field label="NAME">
                <input style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Project Name" />
              </Field>
              <Field label="ORG">
                <input style={inputStyle} value={form.org} onChange={(e) => set("org", e.target.value)} />
              </Field>
              <Field label="CJK">
                <input style={inputStyle} value={form.cjk} onChange={(e) => set("cjk", e.target.value)} placeholder="文字" />
              </Field>
              <Field label="KIND">
                <input style={inputStyle} value={form.kind} onChange={(e) => set("kind", e.target.value)} placeholder="WEB / FRONTEND" />
              </Field>
              <Field label="ROLE">
                <input style={inputStyle} value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="Full-stack" />
              </Field>
              <Field label="YEAR">
                <input style={inputStyle} value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="2025" />
              </Field>
              <Field label="SORT ORDER">
                <input style={inputStyle} type="number" value={form.sort_order} onChange={(e) => set("sort_order", parseInt(e.target.value) || 0)} />
              </Field>
              <Field label="HREF (URL REPO)">
                <input style={{ ...inputStyle, gridColumn: "1 / -1" }} value={form.href} onChange={(e) => set("href", e.target.value)} placeholder="https://github.com/..." />
              </Field>
              <Field label="IMATGE">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {form.img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imgSrc(form.img)} alt="" style={{ width: 60, height: 40, objectFit: "cover", border: "1px solid #2a2c2a", filter: "grayscale(1)" }} />
                  )}
                  <button
                    type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                    style={{ background: "none", border: `1px solid ${AC}`, cursor: "pointer", padding: "7px 12px", fontFamily: mono, fontSize: 9, letterSpacing: "0.16em", color: "var(--ac,#c7f536)", whiteSpace: "nowrap", opacity: uploading ? 0.6 : 1 }}
                  >{uploading ? "PUJANT…" : form.img ? "CANVIAR IMATGE" : "PUJAR IMATGE"}</button>
                  {form.img && (
                    <span style={{ fontFamily: mono, fontSize: 9, color: "#8a8d83", wordBreak: "break-all", flex: 1 }}>
                      {form.img.startsWith("http") ? "✓ pujada" : form.img}
                    </span>
                  )}
                </div>
              </Field>
              <Field label="TAGS (separats per coma)">
                <input style={inputStyle} value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="TypeScript, React, Node.js" />
              </Field>
            </div>
          )}

          {tab === "desc" && (
            <div>
              <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {(["CAT", "ES", "EN"] as LangTab[]).map(langBtn)}
              </div>
              <Field label="DESCRIPCIÓ CURTA">
                <textarea style={taStyle} value={form[descKey]} onChange={(e) => set(descKey, e.target.value)} rows={2} />
              </Field>
              <Field label="DESCRIPCIÓ LLARGA">
                <textarea style={{ ...taStyle, minHeight: 90 }} value={form[longKey]} onChange={(e) => set(longKey, e.target.value)} rows={4} />
              </Field>
            </div>
          )}

          {error && <div style={{ fontFamily: mono, fontSize: 11, color: PINK, marginTop: 12 }}>{error}</div>}

          {/* actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, gap: 10 }}>
            <div>
              {!isNew && (
                <button
                  onClick={handleDelete} disabled={deleting}
                  style={{ background: confirmDelete ? PINK : "none", border: `1px solid ${PINK}`, cursor: "pointer", padding: "9px 14px", fontFamily: mono, fontSize: 10, letterSpacing: "0.14em", color: confirmDelete ? "#0a0b0a" : PINK, transition: "all .2s", opacity: deleting ? 0.6 : 1 }}
                >
                  {deleting ? "ELIMINANT…" : confirmDelete ? "CONFIRMAR ELIMINAR" : "ELIMINAR"}
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: 9 }}>
              <button
                onClick={onClose}
                style={{ background: "none", border: "1px solid #2a2c2a", cursor: "pointer", padding: "9px 14px", fontFamily: mono, fontSize: 10, letterSpacing: "0.14em", color: "#9a9d96" }}
              >CANCEL·LAR</button>
              <button
                onClick={handleSave} disabled={saving}
                style={{ background: AC, border: `1px solid ${AC}`, cursor: "pointer", padding: "9px 16px", fontFamily: mono, fontSize: 10, letterSpacing: "0.14em", fontWeight: 700, color: "#0a0b0a", transition: "background .2s", opacity: saving ? 0.7 : 1 }}
              >{saving ? "GUARDANT…" : "GUARDAR"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
