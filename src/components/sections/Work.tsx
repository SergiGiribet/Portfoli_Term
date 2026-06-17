"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useStore } from "@/lib/store";
import { getProjects } from "@/lib/content";
import type { ProjectFlat } from "@/app/actions/projects";
import dynamic from "next/dynamic";
import { imgSrc } from "@/lib/imgSrc";

const ProjectEditModal = dynamic(() => import("@/components/admin/ProjectEditModal"), { ssr: false });

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
  const [editProject, setEditProject] = useState<ProjectFlat | null | "new">(null);

  const loadProjects = useCallback(async () => {
    try {
      const r = await fetch(`/api/projects?lang=${lang}`);
      if (r.ok) setProjects(await r.json());
    } catch { /* keep current state */ }
  }, [lang]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const handleSaved = () => { setEditProject(null); loadProjects(); };

  return (
    <section id="work" style={{ position: "relative", background: "#0c0d0c", borderTop: "1px solid #1c1e1c", borderBottom: "1px solid #1c1e1c", scrollMarginTop: 60 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 28px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 42, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: "clamp(34px,5vw,68px)", color: "#1c1e1c", lineHeight: 1 }}>*02</span>
          <div>
            <h2 style={{ margin: 0, fontFamily: "'Chakra Petch',sans-serif", fontWeight: 700, fontSize: "clamp(24px,3.4vw,44px)", letterSpacing: "0.02em", color: "#edeee8" }}>{t("sections.work")}</h2>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.26em", color: "var(--ac,#c7f536)" }}>選抜作品 // FIELD LOG</span>
          </div>
          <span style={{ flex: 1, height: 1, background: "#1c1e1c", transform: "translateY(-6px)", minWidth: 20 }} />
          <a
            href="https://github.com/SergiGiribet" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.16em", color: "#9a9d96", textDecoration: "none", border: "1px solid #2a2c2a", padding: "8px 12px", whiteSpace: "nowrap", transition: "all .2s" }}
            onMouseEnter={(e) => { const a = e.currentTarget; a.style.color = "#0a0b0a"; a.style.background = "var(--ac,#c7f536)"; a.style.borderColor = "var(--ac,#c7f536)"; }}
            onMouseLeave={(e) => { const a = e.currentTarget; a.style.color = "#9a9d96"; a.style.background = "none"; a.style.borderColor = "#2a2c2a"; }}
          >{t("ui.allRepos")}</a>
        </div>

        <div className="gq-work-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {projects.map((p, i) => (
            <div key={p.id ?? p.no} style={{ position: "relative" }}>
              <a
                href={p.href} target="_blank" rel="noopener noreferrer"
                onClick={(e) => { if (isAdmin) return; e.preventDefault(); openDetail(i); }}
                style={{ display: "flex", flexDirection: "column", border: "1px solid #2a2c2a", background: "#0e0f0e", textDecoration: "none", color: "inherit", cursor: "pointer", transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s", animation: "gq-rise both linear", animationTimeline: "view()", animationRange: "entry 0% cover 24%", height: "100%" }}
                onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--ac,#c7f536)"; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 0 0 1px var(--ac,#c7f536), 0 18px 44px -22px var(--ac,#c7f536)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = "#2a2c2a"; el.style.transform = ""; el.style.boxShadow = ""; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 14px", borderBottom: "1px solid #1c1e1c", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.16em", color: "#8a8d83" }}>
                  <span>{p.no} · {p.org}</span>
                  <span style={{ color: "var(--ac,#c7f536)" }}>{p.cjk}</span>
                </div>
                <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", background: "#0a0b0a" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgSrc(p.img)} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.12) brightness(0.9)", zIndex: 0 }} />
                  <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "var(--ac,#c7f536)", mixBlendMode: "multiply", opacity: 0.4, pointerEvents: "none" }} />
                  <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 1px, transparent 1px 3px)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "radial-gradient(130% 100% at 50% 0%, transparent 38%, rgba(0,0,0,0.62))", pointerEvents: "none" }} />
                  <span style={{ position: "absolute", top: 8, left: 8, width: 13, height: 13, borderTop: "1px solid var(--ac,#c7f536)", borderLeft: "1px solid var(--ac,#c7f536)", zIndex: 3 }} />
                  <span style={{ position: "absolute", bottom: 8, left: 11, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.2em", color: "#dfe2da", zIndex: 3 }}>{p.kind}</span>
                  <span style={{ position: "absolute", bottom: 8, right: 11, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.16em", color: "var(--ac,#c7f536)", zIndex: 3 }}>{p.no}</span>
                </div>
                <div style={{ padding: "16px 14px 18px" }}>
                  <h3 style={{ margin: "0 0 8px", fontFamily: "'Chakra Petch',sans-serif", fontWeight: 700, fontSize: 21, letterSpacing: "0.01em", color: "#edeee8" }}>{p.name}</h3>
                  <p style={{ margin: "0 0 16px", fontFamily: "'Chakra Petch',sans-serif", fontWeight: 400, fontSize: 13, lineHeight: 1.5, color: "#8a8d86", minHeight: 38 }}>{p.descL}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                    {p.tags.map((tag) => (
                      <span key={tag} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a9d96", border: "1px solid #2a2c2a", padding: "4px 8px" }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.16em", color: "var(--ac,#c7f536)" }}>
                    <span>{isAdmin ? "ADMIN MODE" : t("ui.inspect")}</span><span>+</span>
                  </div>
                </div>
              </a>

              {/* Admin edit overlay */}
              {isAdmin && (
                <button
                  onClick={() => setEditProject(p)}
                  style={{ position: "absolute", top: 8, right: 8, zIndex: 10, background: "var(--pink,#ff2d8e)", border: "none", cursor: "pointer", padding: "5px 10px", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.16em", fontWeight: 700, color: "#fff" }}
                >EDIT</button>
              )}
            </div>
          ))}

          {/* Admin: new project card */}
          {isAdmin && (
            <button
              onClick={() => setEditProject("new")}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, border: "1px dashed #2a2c2a", background: "none", cursor: "pointer", minHeight: 220, transition: "border-color .2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--pink,#ff2d8e)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2c2a"; }}
            >
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, color: "#2a2c2a" }}>+</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.2em", color: "#2a2c2a" }}>NOU PROJECTE</span>
            </button>
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
        @media (max-width: 980px) { .gq-work-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 620px) { .gq-work-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
