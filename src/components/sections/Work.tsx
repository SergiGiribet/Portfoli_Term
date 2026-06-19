"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useStore } from "@/lib/store";
import { getProjects } from "@/lib/content";
import type { ProjectFlat } from "@/app/actions/projects";
import dynamic from "next/dynamic";
import { imgSrc } from "@/lib/imgSrc";

const ProjectEditModal = dynamic(() => import("@/components/admin/ProjectEditModal"), { ssr: false });

const mono = "'JetBrains Mono',monospace";
const sans = "'Chakra Petch',sans-serif";
const arch = "'Archivo Black',sans-serif";

export default function Work() {
  const t = useTranslations();
  const { lang, openDetail, isAdmin } = useStore();
  const [projects, setProjects] = useState<ProjectFlat[]>(() =>
    getProjects(lang).map((p, i) => ({
      ...p,
      id:         `static-${i}`,
      sort_order: i + 1,
      desc_cat:   p.desc.CAT,
      desc_es:    p.desc.ES,
      desc_en:    p.desc.EN,
      long_cat:   p.long.CAT,
      long_es:    p.long.ES,
      long_en:    p.long.EN,
    }))
  );
  const [openId, setOpenId] = useState<string | null>(null);
  const [editProject, setEditProject] = useState<ProjectFlat | null | "new">(null);

  const loadProjects = useCallback(async () => {
    try {
      const r = await fetch(`/api/projects?lang=${lang}`);
      if (r.ok) setProjects(await r.json());
    } catch { /* keep current state */ }
  }, [lang]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const handleSaved = () => { setEditProject(null); loadProjects(); };
  const toggle = (id: string) => setOpenId(prev => prev === id ? null : id);

  return (
    <section id="work" style={{ position: "relative", background: "#0c0d0c", borderTop: "1px solid #1c1e1c", borderBottom: "1px solid #1c1e1c", scrollMarginTop: 60 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 28px" }}>

        {/* Section header */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 42, flexWrap: "wrap" }}>
          <span style={{ fontFamily: arch, fontSize: "clamp(34px,5vw,68px)", color: "#1c1e1c", lineHeight: 1 }}>*02</span>
          <div>
            <h2 style={{ margin: 0, fontFamily: sans, fontWeight: 700, fontSize: "clamp(24px,3.4vw,44px)", letterSpacing: "0.02em", color: "#edeee8" }}>{t("sections.work")}</h2>
            <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.26em", color: "var(--ac,#c7f536)" }}>選抜作品 // FIELD LOG</span>
          </div>
          <span style={{ flex: 1, height: 1, background: "#1c1e1c", transform: "translateY(-6px)", minWidth: 20 }} />
          <a
            href="https://github.com/SergiGiribet" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", color: "#9a9d96", textDecoration: "none", border: "1px solid #2a2c2a", padding: "8px 12px", whiteSpace: "nowrap", transition: "all .2s" }}
            onMouseEnter={(e) => { const a = e.currentTarget; a.style.color = "#0a0b0a"; a.style.background = "var(--ac,#c7f536)"; a.style.borderColor = "var(--ac,#c7f536)"; }}
            onMouseLeave={(e) => { const a = e.currentTarget; a.style.color = "#9a9d96"; a.style.background = "none"; a.style.borderColor = "#2a2c2a"; }}
          >{t("ui.allRepos")}</a>
        </div>

        {/* Accordion list */}
        <div style={{ borderTop: "1px solid #2a2c2a" }}>
          {projects.map((p, i) => {
            const pid = p.id ?? `static-${i}`;
            const isOpen = openId === pid;
            const longL = lang === "CAT" ? p.long_cat : lang === "ES" ? p.long_es : p.long_en;

            return (
              <div key={pid} style={{ borderBottom: "1px solid #2a2c2a" }}>

                {/* Row header */}
                <div
                  style={{ display: "grid", gridTemplateColumns: "78px 1fr auto", alignItems: "center", background: isOpen ? "#101210" : "#0c0d0c", cursor: "pointer", transition: "background .2s" }}
                  onClick={() => toggle(pid)}
                >
                  {/* Index */}
                  <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.18em", color: isOpen ? "var(--ac,#c7f536)" : "#3a3d38", textAlign: "center", padding: "22px 0", transition: "color .2s" }}>
                    {p.no}
                  </span>

                  {/* Name + meta */}
                  <div style={{ padding: "18px 20px", borderLeft: `1px solid ${isOpen ? "var(--ac,#c7f536)" : "#1c1e1c"}`, transition: "border-color .2s" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "clamp(17px,2vw,24px)", letterSpacing: "0.01em", color: isOpen ? "#edeee8" : "#8a8d86", transition: "color .2s" }}>
                        {p.name}
                      </span>
                      <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#4a4d47" }}>
                        {p.org}
                      </span>
                      <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.14em", color: isOpen ? "var(--ac,#c7f536)" : "#3a3d38", border: `1px solid ${isOpen ? "var(--ac,#c7f536)" : "#2a2c2a"}`, padding: "2px 7px", transition: "all .2s" }}>
                        {p.kind}
                      </span>
                    </div>
                  </div>

                  {/* Toggle + admin edit */}
                  <div style={{ padding: "22px 24px", display: "flex", alignItems: "center", gap: 12 }}>
                    {isAdmin && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditProject(p); }}
                        style={{ background: "var(--pink,#ff2d8e)", border: "none", cursor: "pointer", padding: "5px 10px", fontFamily: mono, fontSize: 9, letterSpacing: "0.16em", fontWeight: 700, color: "#fff" }}
                      >EDIT</button>
                    )}
                    <span style={{ fontFamily: mono, fontSize: 20, color: isOpen ? "var(--ac,#c7f536)" : "#3a3d38", display: "inline-block", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", transition: "transform .25s ease, color .2s", lineHeight: 1, width: 22, textAlign: "center", userSelect: "none" }}>
                      +
                    </span>
                  </div>
                </div>

                {/* Expanded panel */}
                {isOpen && (
                  <div className="gq-work-panel" style={{ display: "grid", gridTemplateColumns: "0.95fr 1.05fr", borderTop: "1px solid #1c1e1c", background: "#090a09", animation: "gq-panel-open .22s ease both" }}>

                    {/* Left: image */}
                    <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", background: "#060706" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgSrc(p.img)} alt=""
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.12) brightness(0.88)", zIndex: 0, animation: "gq-wipe .45s ease both" }}
                      />
                      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "var(--ac,#c7f536)", mixBlendMode: "multiply", opacity: 0.38, pointerEvents: "none" }} />
                      <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 1px, transparent 1px 3px)", pointerEvents: "none" }} />
                      <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "radial-gradient(130% 100% at 50% 0%, transparent 38%, rgba(0,0,0,0.62))", pointerEvents: "none" }} />
                      {/* scanbar sweep */}
                      <div style={{ position: "absolute", left: 0, right: 0, height: "30%", zIndex: 3, background: "linear-gradient(to bottom, transparent, rgba(199,245,54,0.05) 50%, transparent)", animation: "gq-scanbar 2.6s linear infinite", pointerEvents: "none" }} />
                      {/* corner bracket */}
                      <span style={{ position: "absolute", top: 10, left: 10, width: 14, height: 14, borderTop: "1px solid var(--ac,#c7f536)", borderLeft: "1px solid var(--ac,#c7f536)", zIndex: 4 }} />
                      <span style={{ position: "absolute", bottom: 10, left: 14, fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "var(--ac,#c7f536)", zIndex: 4 }}>{p.cjk}</span>
                      <span style={{ position: "absolute", bottom: 10, right: 14, fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#9a9d96", zIndex: 4 }}>{p.kind}</span>
                    </div>

                    {/* Right: content */}
                    <div style={{ padding: "28px 32px 28px 28px", display: "flex", flexDirection: "column", gap: 20, borderLeft: "1px solid #1c1e1c" }}>
                      <p style={{ margin: 0, fontFamily: sans, fontWeight: 400, fontSize: "clamp(14px,1.4vw,17px)", lineHeight: 1.65, color: "#cfd2ca" }}>
                        {longL}
                      </p>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div style={{ border: "1px solid #2a2c2a", padding: "10px 14px" }}>
                          <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83", marginBottom: 4 }}>{t("ui.role")}</div>
                          <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 14, color: "#e8e9e4" }}>{p.role}</div>
                        </div>
                        <div style={{ border: "1px solid #2a2c2a", padding: "10px 14px" }}>
                          <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83", marginBottom: 4 }}>{t("ui.year")}</div>
                          <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 14, color: "#e8e9e4" }}>{p.year}</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {p.tags.map((tag) => (
                          <span key={tag} style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a9d96", border: "1px solid #2a2c2a", padding: "4px 8px" }}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: "auto" }}>
                        <button
                          onClick={() => openDetail(p)}
                          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", background: "var(--ac,#c7f536)", border: "none", color: "#0a0b0a", cursor: "pointer", fontFamily: mono, fontSize: 10, letterSpacing: "0.18em", fontWeight: 700, textTransform: "uppercase", transition: "background .2s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#fff"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--ac,#c7f536)"; }}
                        >
                          {t("ui.inspect")} +
                        </button>
                        <a
                          href={p.href} target="_blank" rel="noopener noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", background: "none", border: "1px solid #2a2c2a", color: "#9a9d96", textDecoration: "none", fontFamily: mono, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", transition: "all .2s" }}
                          onMouseEnter={(e) => { const a = e.currentTarget; a.style.borderColor = "var(--ac,#c7f536)"; a.style.color = "var(--ac,#c7f536)"; }}
                          onMouseLeave={(e) => { const a = e.currentTarget; a.style.borderColor = "#2a2c2a"; a.style.color = "#9a9d96"; }}
                        >
                          {t("ui.openRepo")} ↗
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Admin: new project row */}
          {isAdmin && (
            <div style={{ borderBottom: "1px solid #2a2c2a" }}>
              <button
                onClick={() => setEditProject("new")}
                style={{ width: "100%", display: "grid", gridTemplateColumns: "78px 1fr", alignItems: "center", padding: 0, background: "none", border: "none", cursor: "pointer", transition: "background .2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#0e0f0e"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
              >
                <span style={{ fontFamily: mono, fontSize: 18, color: "#2a2c2a", textAlign: "center", padding: "20px 0" }}>+</span>
                <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#2a2c2a", padding: "20px 20px", borderLeft: "1px solid #1c1e1c" }}>NOU PROJECTE</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {editProject && (
        <ProjectEditModal
          project={editProject === "new" ? undefined : editProject}
          nextOrder={projects.length + 1}
          onClose={() => setEditProject(null)}
          onSaved={handleSaved}
        />
      )}

      <style>{`
        @keyframes gq-wipe {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0% 0 0); }
        }
        @keyframes gq-scanbar {
          0%   { top: -30%; }
          100% { top: 130%; }
        }
        @keyframes gq-panel-open {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .gq-work-panel { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
