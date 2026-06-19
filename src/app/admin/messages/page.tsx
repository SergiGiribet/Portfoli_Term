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
  if (m < 1) return "ara";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function MessagesPage() {
  const [messages,   setMessages]   = useState<MessageRow[]>([]);
  const [filter,     setFilter]     = useState<Filter>("ALL");
  const [selected,   setSelected]   = useState<MessageRow | null>(null);
  const [confirmDel, setConfirmDel] = useState(false);
  const [replyText,  setReplyText]  = useState("");
  const [replying,   setReplying]   = useState(false);

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
    setReplyText("");
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

  const handleReply = async () => {
    if (!selected || !replyText.trim()) return;
    setReplying(true);
    const replied_at = new Date().toISOString();
    await fetch(`/api/admin/messages/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: replyText, replied_at }),
    });
    const updated = { ...selected, reply: replyText, replied_at };
    setMessages(ms => ms.map(x => x.id === selected.id ? updated : x));
    setSelected(updated);
    // open email client with prefilled reply
    const subj = encodeURIComponent(`Re: ${selected.subject || "(sense assumpte)"}`);
    const body = encodeURIComponent(replyText);
    window.open(`mailto:${selected.email}?subject=${subj}&body=${body}`, "_blank");
    setReplying(false);
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
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ fontFamily: sans, fontSize: 12, color: "#7a7d76", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{m.subject || m.body}</div>
                    {m.replied_at && <span style={{ fontFamily: mono, fontSize: 8, letterSpacing: "0.1em", color: "var(--ac,#c7f536)", flexShrink: 0 }}>✓ replied</span>}
                  </div>
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

              {selected.replied_at && selected.reply && (
                <div style={{ marginTop: 20, padding: 14, border: "1px solid #2a2c2a", background: "#111210", borderLeft: "3px solid var(--ac,#c7f536)" }}>
                  <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.14em", color: "var(--ac,#c7f536)", marginBottom: 8 }}>
                    RESPOSTA ENVIADA · {new Date(selected.replied_at).toLocaleString()}
                  </div>
                  <p style={{ fontFamily: sans, fontSize: 13, lineHeight: 1.6, color: "#9a9d96", margin: 0, whiteSpace: "pre-wrap" }}>{selected.reply}</p>
                </div>
              )}
            </div>

            <div style={{ borderTop: "1px solid #1c1e1c", padding: "12px 20px", background: "#0c0d0c" }}>
              {selected.replied_at ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: mono, fontSize: 10, color: "var(--ac,#c7f536)" }}>✓ RESPOSTA REGISTRADA</span>
                  <button onClick={() => setSelected(s => s ? { ...s, replied_at: null, reply: null } : s)} style={{ background: "none", border: "none", fontFamily: mono, fontSize: 9, color: "#5a5d57", cursor: "pointer", letterSpacing: "0.1em" }}>TORNAR A RESPONDRE</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder={`Resposta a ${selected.name}…`}
                    rows={3}
                    style={{ width: "100%", boxSizing: "border-box", background: "#0a0b0a", border: "1px solid #2a2c2a", color: "#e8e9e4", fontFamily: sans, fontSize: 13, padding: "10px 12px", outline: "none", resize: "vertical" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: mono, fontSize: 9, color: "#5a5d57", letterSpacing: "0.1em" }}>Guarda la resposta i obre el client de correu</span>
                    <button
                      onClick={handleReply}
                      disabled={replying || !replyText.trim()}
                      style={{ background: "var(--ac,#c7f536)", border: "none", color: "#0a0b0a", padding: "9px 16px", fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", fontWeight: 700, cursor: replyText.trim() ? "pointer" : "not-allowed", opacity: !replyText.trim() ? 0.5 : 1, transition: "opacity .2s" }}
                    >
                      {replying ? "ENVIANT…" : "SEND REPLY ↗"}
                    </button>
                  </div>
                </div>
              )}
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
