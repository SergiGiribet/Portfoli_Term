"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Topbar from "../_components/Topbar";
import { deleteProject } from "@/app/actions/projects";
import { imgSrc } from "@/lib/imgSrc";
import type { ProjectFlat } from "@/lib/supabase/queries";

const mono = "'JetBrains Mono',monospace";
const sans = "'Chakra Petch',sans-serif";

const FILTERS = ["ALL", "WEB", "BACKEND", "AI", "HARDWARE", "EXPERIMENT", "PERSONAL"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectFlat[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const dragIdx = useRef<number | null>(null);

  const load = () =>
    fetch("/api/projects?lang=EN").then(r => r.ok ? r.json() : []).then(setProjects).catch(() => {});

  useEffect(() => { load(); }, []);

  const filtered = filter === "ALL" ? projects : projects.filter(p => p.kind.toUpperCase().includes(filter));

  // ── drag-to-reorder ──
  const onDragStart = (i: number) => { dragIdx.current = i; };
  const onDragOver  = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    const from = dragIdx.current;
    if (from === null || from === i) return;
    const arr = [...projects];
    const [item] = arr.splice(from, 1);
    arr.splice(i, 0, item);
    dragIdx.current = i;
    setProjects(arr);
  };
  const onDrop = async () => {
    dragIdx.current = null;
    await fetch("/api/admin/projects/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: projects.map(p => p.id) }),
    });
  };

  const handleDelete = async (id: string) => {
    if (confirmDelete !== id) { setConfirmDelete(id); return; }
    await deleteProject(id);
    setConfirmDelete(null);
    load();
  };

  const col = "34px 60px 1.4fr 1fr 0.9fr 0.7fr 84px";

  return (
    <>
      <Topbar
        eyebrow="選抜作品 // FIELD LOG"
        title="Projects"
        actions={
          <>
            <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", color: "#7e8178", border: "1px solid #2a2c2a", padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>⌕ SEARCH</span>
            <Link href="/admin/projects/new" style={{ background: "var(--ac,#c7f536)", color: "#0a0b0a", padding: "9px 14px", fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", fontWeight: 700, textDecoration: "none" }}>+ NEW PROJECT</Link>
          </>
        }
      />

      <div style={{ padding: "18px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* filter chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", fontFamily: mono, fontSize: 10, letterSpacing: "0.14em" }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "7px 12px", background: filter === f ? "var(--ac,#c7f536)" : "none", color: filter === f ? "#0a0b0a" : "#9a9d96", border: filter === f ? "1px solid var(--ac,#c7f536)" : "1px solid #2a2c2a", fontFamily: mono, fontSize: 10, letterSpacing: "0.14em", fontWeight: filter === f ? 700 : 400, cursor: "pointer" }}>
              {f}{filter === f && f === "ALL" ? ` · ${projects.length}` : ""}
            </button>
          ))}
        </div>

        {/* table */}
        <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e" }}>
          <div style={{ display: "grid", gridTemplateColumns: col, gap: 12, padding: "10px 14px", borderBottom: "1px solid #2a2c2a", fontFamily: mono, fontSize: 9, letterSpacing: "0.16em", color: "#7e8178" }}>
            <span /><span /><span>PROJECT</span><span>KIND</span><span>TAGS</span><span>STATUS</span><span style={{ textAlign: "right" }}>ACTIONS</span>
          </div>

          {filtered.map((p, i) => (
            <div
              key={p.id}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={e => onDragOver(e, i)}
              onDrop={onDrop}
              style={{ display: "grid", gridTemplateColumns: col, gap: 12, alignItems: "center", padding: "11px 14px", borderBottom: "1px solid #161816" }}
            >
              <span style={{ fontFamily: mono, fontSize: 14, color: "#5a5d57", cursor: "grab", textAlign: "center" }}>⠿</span>
              <div style={{ position: "relative", width: 52, height: 34, overflow: "hidden", background: "#0a0b0a", border: "1px solid #2a2c2a" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgSrc(p.img)} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.1) brightness(0.9)" }} />
                <div style={{ position: "absolute", inset: 0, background: "var(--ac,#c7f536)", mixBlendMode: "multiply", opacity: 0.42 }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 15, color: "#edeee8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.14em", color: "#7e8178" }}>{p.no} · {p.org}</div>
              </div>
              <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.12em", color: "#9a9d96" }}>{p.kind}</span>
              <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.08em", color: "#7e8178", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.tags.slice(0, 2).join(" · ")}</span>
              <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.12em", color: "#0a0b0a", background: "var(--ac,#c7f536)", padding: "4px 8px", justifySelf: "start", fontWeight: 700 }}>PUBLISHED</span>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <Link href={`/admin/projects/${p.id}`} style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.1em", color: "#cfd2ca", border: "1px solid #2a2c2a", padding: "5px 8px", textDecoration: "none" }}>EDIT</Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.1em", color: confirmDelete === p.id ? "#0a0b0a" : "var(--pink,#ff2d8e)", border: "1px solid #2a2c2a", padding: "5px 8px", background: confirmDelete === p.id ? "var(--pink,#ff2d8e)" : "none", cursor: "pointer" }}
                >{confirmDelete === p.id ? "CONFIRM" : "✕"}</button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ padding: "24px", fontFamily: mono, fontSize: 10, color: "#5a5d57", textAlign: "center" }}>Cap projecte</div>
          )}
        </div>
      </div>
    </>
  );
}
