"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Topbar from "../_components/Topbar";
import type { MessageRow } from "@/lib/supabase/types";

const mono  = "'JetBrains Mono',monospace";
const sans  = "'Chakra Petch',sans-serif";
const black = "'Archivo Black',sans-serif";

interface Stats {
  projects: number;
  total_messages: number;
  unread_messages: number;
  channels: number;
  last_message_at: string | null;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function KpiCard({ label, value, tag, tagColor, sub }: { label: string; value: string; tag: string; tagColor: string; sub: string }) {
  return (
    <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e", padding: 16 }}>
      <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "8px 0 6px" }}>
        <span style={{ fontFamily: black, fontSize: 38, lineHeight: 1, color: "#edeee8" }}>{value}</span>
        <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.14em", color: tagColor }}>{tag}</span>
      </div>
      <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.06em", color: "#7e8178" }}>{sub}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats,  setStats]  = useState<Stats | null>(null);
  const [recent, setRecent] = useState<MessageRow[]>([]);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.ok ? r.json() : null)
      .then((d: Stats | null) => { if (d) setStats(d); })
      .catch(() => {});
    fetch("/api/admin/messages")
      .then(r => r.ok ? r.json() : [])
      .then((msgs: MessageRow[]) => setRecent(msgs.filter(m => !m.archived).slice(0, 3)))
      .catch(() => {});
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <Topbar
        eyebrow="CONSOLE // 開発者"
        title="Dashboard"
        actions={
          <>
            <span style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: mono, fontSize: 10, letterSpacing: "0.14em", color: "#8a8d83" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--ac,#c7f536)", display: "inline-block" }} />
              OPERATIONAL
            </span>
            <a href="/" target="_blank" style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", color: "#cfd2ca", border: "1px solid #2a2c2a", padding: "8px 13px", textDecoration: "none" }}>VIEW SITE ↗</a>
          </>
        }
      />

      <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
        {/* KPI cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          <KpiCard
            label="PROJECTS"
            value={pad(stats?.projects ?? 0)}
            tag="PUBLISHED"
            tagColor="var(--ac,#c7f536)"
            sub={`${pad(stats?.projects ?? 0)} LIVE`}
          />
          <KpiCard
            label="MESSAGES"
            value={pad(stats?.unread_messages ?? 0)}
            tag={(stats?.unread_messages ?? 0) > 0 ? "UNREAD" : "INBOX CLEAR"}
            tagColor={(stats?.unread_messages ?? 0) > 0 ? "var(--pink,#ff2d8e)" : "#9a9d96"}
            sub={`${pad(stats?.total_messages ?? 0)} TOTAL`}
          />
          <KpiCard
            label="CHANNELS"
            value={pad(stats?.channels ?? 0)}
            tag="LIVE"
            tagColor="#9a9d96"
            sub="3 LANGS ACTIVE"
          />
          <KpiCard
            label="LAST MESSAGE"
            value={stats?.last_message_at ? relativeTime(stats.last_message_at).split(" ")[0] : "—"}
            tag={stats?.last_message_at ? relativeTime(stats.last_message_at).split(" ").slice(1).join(" ") : "NO MSG"}
            tagColor={stats?.last_message_at ? "var(--ac,#c7f536)" : "#9a9d96"}
            sub={stats?.last_message_at ? new Date(stats.last_message_at).toLocaleDateString() : "inbox empty"}
          />
        </div>

        {/* two-col */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 14 }}>
          {/* recent messages */}
          <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 16px", borderBottom: "1px solid #1c1e1c", fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83" }}>
              <span>RECENT MESSAGES</span>
              <Link href="/admin/messages" style={{ color: "var(--ac,#c7f536)", textDecoration: "none" }}>VIEW ALL →</Link>
            </div>
            {recent.length === 0 ? (
              <div style={{ padding: "20px 16px", fontFamily: mono, fontSize: 10, color: "#5a5d57", textAlign: "center" }}>Cap missatge rebut</div>
            ) : recent.map((m, i) => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 16px", borderBottom: i < recent.length - 1 ? "1px solid #161816" : "none" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: !m.read ? "var(--ac,#c7f536)" : "#2a2c2a", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 14, color: !m.read ? "#e8e9e4" : "#b8bbb2" }}>{m.name}</div>
                  <div style={{ fontFamily: sans, fontSize: 12, color: !m.read ? "#8a8d86" : "#7a7d76", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.subject || m.body}</div>
                </div>
                <span style={{ fontFamily: mono, fontSize: 10, color: "#7e8178", flexShrink: 0 }}>{relativeTime(m.created_at)}</span>
              </div>
            ))}
          </div>

          {/* right col */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e", padding: "14px 16px" }}>
              <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83", marginBottom: 12 }}>QUICK ACTIONS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                <Link href="/admin/projects/new" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 13px", background: "var(--ac,#c7f536)", color: "#0a0b0a", textDecoration: "none", fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", fontWeight: 700 }}>+ NEW PROJECT <span>↵</span></Link>
                <Link href="/admin/profile" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 13px", border: "1px solid #2a2c2a", color: "#cfd2ca", textDecoration: "none", fontFamily: mono, fontSize: 10, letterSpacing: "0.16em" }}>EDIT PROFILE <span style={{ color: "var(--ac,#c7f536)" }}>→</span></Link>
                <Link href="/admin/settings" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 13px", border: "1px solid #2a2c2a", color: "#cfd2ca", textDecoration: "none", fontFamily: mono, fontSize: 10, letterSpacing: "0.16em" }}>SETTINGS <span style={{ color: "var(--ac,#c7f536)" }}>→</span></Link>
              </div>
            </div>
            <div style={{ border: "1px solid #2a2c2a", background: "#0e0f0e", padding: "14px 16px", flex: 1 }}>
              <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83", marginBottom: 10 }}>SYSTEM</div>
              <div style={{ fontFamily: mono, fontSize: 11, lineHeight: 1.9, color: "#8a8d86" }}>
                <span style={{ color: "var(--ac,#c7f536)" }}>&gt;</span> status … <span style={{ color: "var(--ac,#c7f536)" }}>OPERATIONAL</span><br />
                <span style={{ color: "var(--ac,#c7f536)" }}>&gt;</span> db … <span style={{ color: "var(--ac,#c7f536)" }}>SUPABASE</span><br />
                <span style={{ color: "var(--ac,#c7f536)" }}>&gt;</span> projects … <span style={{ color: "#cfd2ca" }}>{pad(stats?.projects ?? 0)} LIVE</span><br />
                <span style={{ color: "var(--ac,#c7f536)" }}>&gt;</span> channels … <span style={{ color: "#cfd2ca" }}>{pad(stats?.channels ?? 0)} ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
