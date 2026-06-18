"use client";

import { useEffect, useState } from "react";
import Topbar from "../_components/Topbar";
import type { MessageRow } from "@/lib/supabase/types";

const mono = "'JetBrains Mono',monospace";
const sans = "'Chakra Petch',sans-serif";

type Filter = "ALL" | "UNREAD" | "ARCHIVED";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function MessagesPage() {
  const [messages,  setMessages]  = useState<MessageRow[]>([]);
  const [filter,    setFilter]    = useState<Filter>("ALL");
  const [selected,  setSelected]  = useState<MessageRow | null>(null);
  const [confirmDel,setConfirmDel]= useState(false);

  const load = () =>
    fetch("/api/admin/messages").then(r => r.ok ? r.json() : []).then(setMessages).catch(() => {});

  useEffect(() => { load(); }, []);

  const filtered = messages.filter(m => {
    if (filter === "UNREAD")   return !m.read && !m.archived;
    if (filter === "ARCHIVED") return m.archived;
    return !m.archived;
  });

  const unread = messages.filter(m => !m.read && !m.archived).length;

  const select = async (m: MessageRow) => {
    setSelected(m);
    setConfirmDel(false);
    if (!m.read) {
      await fetch(`/api/admin/messages/${m.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: true }) });
      setMessages(ms => ms.map(x => x.id === m.id ? { ...x, read: true } : x));
      setSelected(s => s?.id === m.id ? { ...s, read: true } : s);
    }
  };

  const handleArchive = async () => {
    if (!selected) return;
    await fetch(`/api/admin/messages/${selected.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ archived: true }) });
    load(); setSelected(null);
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!confirmDel) { setConfirmDel(true); return; }
    await fetch(`/api/admin/messages/${selected.id}`, { method: "DELETE" });
    load(); setSelected(null); setConfirmDel(false);
  };

  return (
    <>
      <Topbar
        eyebrow={`INBOX // ${unread} UNREAD`}
        title="Messages"
        actions={<span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", color: "#7e8178", border: "1px solid #2a2c2a", padding: "8px 12px" }}>⌕ SEARCH</span>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", flex: 1, minHeight: 430, overflow: "hidden" }}>
        {/* list pane */}
        <div style={{ borderRight: "1px solid #1c1e1c", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: 0, padding: "12px 14px", borderBottom: "1px solid #1c1e1c" }}>
            {(["ALL","UNREAD","ARCHIVED"] as Filter[]).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ background: filter===f ? "var(--ac,#c7f536)" : "none", color: filter===f ? "#0a0b0a" : "#9a9d96", border: filter===f ? "1px solid var(--ac,#c7f536)" : "1px solid #2a2c2a", fontFamily: mono, fontSize: 9, letterSpacing: "0.12em", fontWeight: filter===f ? 700 : 400, padding: "5px 10px", cursor: "pointer", marginRight: 6 }}>
                {f}
              </button>
            ))}
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.length === 0 && (
              <div style={{ padding: 20, fontFamily: mono, fontSize: 10, color: "#5a5d57", textAlign: "center" }}>Cap missatge</div>
            )}
            {filtered.map(m => (
              <div key={m.id} onClick={() => select(m)}
                style={{ display: "flex", alignItems: "flex-start", gap: 11, padding: "12px 14px", borderBottom: "1px solid #161816", cursor: "pointer", borderLeft: `3px solid ${selected?.id === m.id ? "var(--ac,#c7f536)" : "transparent"}`, background: selected?.id === m.id ? "#111210" : "transparent" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: !m.read ? "var(--ac,#c7f536)" : "#2a2c2a", flexShrink: 0, marginTop: 5 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                    <span style={{ fontFamily: sans, fontWeight: 600, fontSize: 14, color: !m.read ? "#e8e9e4" : "#b8bbb2" }}>{m.name}</span>
                    <span style={{ fontFamily: mono, fontSize: 10, color: "#7e8178", flexShrink: 0, marginLeft: 8 }}>{relativeTime(m.created_at)}</span>
                  </div>
                  <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.06em", color: "#7e8178", marginBottom: 2 }}>{m.email}</div>
                  <div style={{ fontFamily: sans, fontSize: 12, color: "#7a7d76", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.subject || m.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* reading pane */}
        {selected ? (
          <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 20px", borderBottom: "1px solid #1c1e1c" }}>
              <div>
                <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 18, color: "#edeee8", marginBottom: 4 }}>{selected.subject || "(sense assumpte)"}</div>
                <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.1em", color: "#7e8178" }}>de · {selected.name} · {selected.email} · {new Date(selected.created_at).toLocaleString()}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={handleArchive} style={{ background: "none", border: "1px solid #2a2c2a", color: "#cfd2ca", padding: "7px 12px", fontFamily: mono, fontSize: 10, letterSpacing: "0.12em", cursor: "pointer" }}>ARCHIVE</button>
                <button onClick={handleDelete}  style={{ background: confirmDel ? "var(--pink,#ff2d8e)" : "none", border: "1px solid #2a2c2a", color: confirmDel ? "#0a0b0a" : "var(--pink,#ff2d8e)", padding: "7px 12px", fontFamily: mono, fontSize: 10, letterSpacing: "0.12em", cursor: "pointer" }}>{confirmDel ? "CONFIRMAR" : "✕ ELIMINAR"}</button>
              </div>
            </div>
            <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
              <p style={{ fontFamily: sans, fontSize: 14, lineHeight: 1.7, color: "#cfd2ca", margin: 0, whiteSpace: "pre-wrap" }}>{selected.body}</p>
            </div>
            <div style={{ borderTop: "1px solid #1c1e1c", padding: "12px 20px", background: "#0c0d0c" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input style={{ flex: 1, background: "#0a0b0a", border: "1px solid #2a2c2a", color: "#9a9d96", fontFamily: sans, fontSize: 13, padding: "10px 12px", outline: "none" }} placeholder="Escriu una resposta… (pròximament)" disabled />
                <button disabled style={{ background: "#2a2c2a", border: "none", color: "#5a5d57", padding: "10px 16px", fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", fontWeight: 700, cursor: "not-allowed" }}>SEND ↵</button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
            <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.2em", color: "#5a5d57" }}>CAP MISSATGE SELECCIONAT</span>
          </div>
        )}
      </div>
    </>
  );
}
