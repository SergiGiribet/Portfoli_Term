"use client";

import { useEffect, useState, useRef } from "react";
import Topbar from "../_components/Topbar";
import { saveChannels } from "@/app/actions/channels";
import type { ChannelRow } from "@/lib/supabase/types";

const mono = "'JetBrains Mono',monospace";
const sans = "'Chakra Petch',sans-serif";

const inputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", background: "#0a0b0a", border: "1px solid #2a2c2a", color: "#e8e9e4", fontFamily: sans, fontSize: 13, padding: "8px 10px", outline: "none" };
const monoInput: React.CSSProperties = { ...inputStyle, fontFamily: mono, fontSize: 10, letterSpacing: "0.1em", color: "#8a8d83" };

type ChannelDraft = { id?: string; label: string; value: string; href: string; live: boolean; sort_order: number };

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: 38, height: 21, borderRadius: 999, background: value ? "var(--ac,#c7f536)" : "#1c1e1c", border: value ? "none" : "1px solid #2a2c2a", position: "relative", cursor: "pointer", flexShrink: 0, transition: "background .2s" }}>
      <div style={{ position: "absolute", top: 3, left: value ? 20 : 3, width: 15, height: 15, borderRadius: "50%", background: value ? "#0a0b0a" : "#5a5d57", transition: "left .2s" }} />
    </div>
  );
}

export default function ChannelsPage() {
  const [channels, setChannels] = useState<ChannelDraft[]>([]);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState("");
  const dragIdx = useRef<number | null>(null);

  useEffect(() => { load(); }, []);

  const set = (i: number, k: keyof ChannelDraft, v: unknown) =>
    setChannels(cs => cs.map((c,j) => j===i ? { ...c, [k]: v } : c));

  const onDragStart = (i: number) => { dragIdx.current = i; };
  const onDragOver  = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    const from = dragIdx.current;
    if (from === null || from === i) return;
    const arr = [...channels];
    const [item] = arr.splice(from, 1);
    arr.splice(i, 0, item);
    dragIdx.current = i;
    setChannels(arr);
  };
  const onDrop = () => { dragIdx.current = null; };

  const load = () =>
    fetch("/api/admin/channels")
      .then(r => r.json())
      .then((data: ChannelRow[]) => setChannels(data.map(c => ({ id: c.id, label: c.label, value: c.value, href: c.href, live: c.live, sort_order: c.sort_order }))))
      .catch(() => {});

  const handleSave = async () => {
    setSaving(true); setMsg("");
    const payload = channels.map((c, i) => ({ ...c, sort_order: i + 1 }));
    const res = await saveChannels(payload);
    setSaving(false);
    setMsg(res.ok ? "Guardat ✓" : res.error ?? "Error");
    if (res.ok) {
      setTimeout(() => setMsg(""), 2000);
      load(); // refresh to get new UUIDs for freshly inserted channels
    }
  };

  const col = "30px 0.7fr 1fr 1.5fr 60px 30px";

  return (
    <>
      <Topbar
        eyebrow="接続 // OPEN CHANNEL"
        title="Contact channels"
        actions={
          <>
            <button
              onClick={() => setChannels(cs => [...cs, { label: "", value: "", href: "", live: true, sort_order: cs.length + 1 }])}
              style={{ background: "none", border: "1px solid #2a2c2a", color: "#cfd2ca", padding: "9px 14px", fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", cursor: "pointer" }}
            >+ ADD CHANNEL</button>
            {msg && <span style={{ fontFamily: mono, fontSize: 10, color: msg.includes("Error") ? "var(--pink,#ff2d8e)" : "var(--ac,#c7f536)" }}>{msg}</span>}
            <button onClick={handleSave} disabled={saving} style={{ background: "var(--ac,#c7f536)", border: "none", color: "#0a0b0a", padding: "9px 16px", fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>SAVE</button>
          </>
        }
      />

      <div style={{ padding: "22px 24px" }}>
        <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e" }}>
          <div style={{ display: "grid", gridTemplateColumns: col, gap: 12, padding: "10px 14px", borderBottom: "1px solid #2a2c2a", fontFamily: mono, fontSize: 9, letterSpacing: "0.16em", color: "#7e8178" }}>
            <span /><span>LABEL</span><span>VALUE</span><span>URL</span><span>LIVE</span><span />
          </div>
          {channels.map((c, i) => (
            <div key={i} draggable onDragStart={() => onDragStart(i)} onDragOver={e => onDragOver(e, i)} onDrop={onDrop}
              style={{ display: "grid", gridTemplateColumns: col, gap: 12, alignItems: "center", padding: "10px 14px", borderBottom: "1px solid #161816" }}>
              <span style={{ fontFamily: mono, fontSize: 13, color: "#5a5d57", cursor: "grab", textAlign: "center" }}>⠿</span>
              <input style={monoInput} value={c.label} onChange={e => set(i, "label", e.target.value)} placeholder="GITHUB" />
              <input style={inputStyle} value={c.value} onChange={e => set(i, "value", e.target.value)} placeholder="@handle" />
              <input style={{ ...inputStyle, fontFamily: mono, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis" }} value={c.href} onChange={e => set(i, "href", e.target.value)} placeholder="https://…" />
              <Toggle value={c.live} onChange={v => set(i, "live", v)} />
              <span onClick={() => setChannels(cs => cs.filter((_,j) => j!==i))} style={{ fontFamily: mono, fontSize: 12, color: "#5a5d57", textAlign: "center", cursor: "pointer" }}>✕</span>
            </div>
          ))}
          {channels.length === 0 && (
            <div style={{ padding: "20px", fontFamily: mono, fontSize: 10, color: "#5a5d57", textAlign: "center" }}>Cap canal — feu clic a "+ ADD CHANNEL"</div>
          )}
        </div>
      </div>
    </>
  );
}
