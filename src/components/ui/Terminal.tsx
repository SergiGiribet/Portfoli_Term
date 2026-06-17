"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useStore } from "@/lib/store";
import { getProjects, getBio } from "@/lib/content";
import { content } from "@/lib/content";
import type { Lang } from "@/types/content";

interface Line { text: string; color?: string }

const AC   = "var(--ac,#c7f536)";
const PINK  = "var(--pink,#ff2d8e)";

function welcome(hint: string, hint2: string): Line[] {
  return [
    { text: hint,  color: "#cfd2ca" },
    { text: hint2, color: "#8a8d83" },
    { text: "" },
  ];
}

export default function Terminal() {
  const t = useTranslations("terminal");
  const { lang, setLang, termOpen, setTermOpen, setCvOpen, setAccent, isAdmin, setAdmin } = useStore();
  const [history, setHistory] = useState<Line[]>([]);
  const bodyRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [awaitingPassword, setAwaitingPassword] = useState(false);

  useEffect(() => {
    if (termOpen) {
      setHistory((h) => h.length ? h : welcome(t("welcome"), t("hint2")));
      setTimeout(() => { inputRef.current?.focus(); scrollBottom(); }, 40);
    }
  }, [termOpen, t]);

  const scrollBottom = () => {
    setTimeout(() => { const b = bodyRef.current; if (b) b.scrollTop = b.scrollHeight; }, 10);
  };

  const runCmd = useCallback(async (raw: string) => {
    const cmd   = raw.trim();
    const parts = cmd.split(/\s+/);
    const c     = (parts[0] || "").toLowerCase();
    const arg   = parts.slice(1).join(" ").trim();

    const projects = getProjects(lang);
    const bio      = getBio(lang);

    const echoCmd = (c === "login" && arg) ? "login ••••••••" : cmd;
    const lines: Line[] = [{ text: `girquell@dev:~$ ${echoCmd}`, color: "#e8e9e4" }];
    const out = (text: string, color?: string) => lines.push({ text, color: color || "#9a9d96" });

    if (!cmd) {
      /* blank */
    } else if (c === "clear" || c === "cls") {
      setHistory([]);
      return;
    } else if (c === "help") {
      out("AVAILABLE COMMANDS", AC);
      out("  help              this list");
      out("  whoami            identity");
      out("  about             bio");
      out("  cv | resume       open & download CV");
      out("  stack             tech stack");
      out("  projects | ls     list projects");
      out("  open <n>          open a project repo");
      out("  contact           channels & links");
      out("  lang <cat|es|en>  switch language");
      out("  time              system clock");
      out("  theme <lime|pink|violet>  switch accent");
      out("  clear             clear screen");
      out("  exit              close terminal");
    } else if (c === "whoami") {
      out("Sergi Giribet // GIRQUELL", AC);
      out("Multiplatform developer · CS Engineering student · Founder @ DuckHats");
    } else if (c === "about" || c === "profile") {
      out(bio.p1); out(""); out(bio.p2);
    } else if (c === "cv" || c === "resume") {
      out("opening curriculum …", AC);
      setCvOpen(true); setTermOpen(false);
      return;
    } else if (c === "stack") {
      content.stack.forEach((s) => out(`  ${s.label.padEnd(14)} ${s.items}`, "#cfd2ca"));
    } else if (c === "projects" || c === "ls") {
      projects.forEach((p, i) => out(`  [${i + 1}] ${p.no}  ${p.name}  — ${p.kind}`, "#cfd2ca"));
      out("type 'open <n>' to open a repo", "#8a8d83");
    } else if (c === "open") {
      let idx = -1;
      if (/^\d+$/.test(arg)) idx = parseInt(arg, 10) - 1;
      else if (arg) idx = projects.findIndex((p) => p.name.toLowerCase().includes(arg.toLowerCase()));
      if (idx >= 0 && idx < projects.length) {
        out(`opening ${projects[idx].name} …`, AC);
        window.open(projects[idx].href, "_blank");
      } else {
        out(`usage: open <1-${projects.length}|name>`, PINK);
      }
    } else if (c === "contact" || c === "social") {
      content.channels.forEach((ch) => out(`  ${ch.label.padEnd(11)} ${ch.val}  → ${ch.href}`, "#cfd2ca"));
    } else if (c === "lang") {
      const l = arg.toUpperCase() as Lang;
      if (["CAT", "ES", "EN"].includes(l)) { out(`language → ${l}`, AC); setLang(l); }
      else out("usage: lang <cat|es|en>", PINK);
    } else if (c === "time" || c === "date") {
      out(new Date().toUTCString());
    } else if (c === "sudo") {
      out("permission denied — you are already the operator.", PINK);
    } else if (c === "exit" || c === "close" || c === "quit") {
      setTermOpen(false); return;
    } else if (c === "echo") {
      out(arg);
    } else if (c === "theme") {
      const map: Record<string, "Lime" | "Pink" | "Violet"> = { lime: "Lime", pink: "Pink", violet: "Violet" };
      const th = map[arg.toLowerCase()];
      if (th) { setAccent(th); out(`accent reconfigured → ${th.toUpperCase()}`, AC); }
      else out("usage: theme <lime|pink|violet>", PINK);
    } else if (c === "login") {
      if (isAdmin) {
        out("already authenticated // ADMIN MODE ACTIVE", AC);
      } else if (!arg) {
        out("enter password:", AC);
        setHistory((h) => [...h, ...lines]);
        scrollBottom();
        setAwaitingPassword(true);
        return;
      } else {
        setHistory((h) => [...h, ...lines]);
        scrollBottom();
        try {
          const r = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: arg }) });
          if (r.ok) { setAdmin(true); setHistory((h) => [...h, { text: "ACCESS GRANTED // ADMIN MODE", color: AC }]); }
          else        { setHistory((h) => [...h, { text: "access denied", color: PINK }]); }
        } catch { setHistory((h) => [...h, { text: "auth service unavailable", color: PINK }]); }
        scrollBottom();
        return;
      }
    } else if (c === "logout") {
      if (isAdmin) {
        await fetch("/api/auth", { method: "DELETE" });
        setAdmin(false);
        out("session terminated", AC);
      } else {
        out("not authenticated", PINK);
      }
    } else {
      out(`command not found: ${c} — type 'help'`, PINK);
    }

    setHistory((h) => [...h, ...lines]);
    scrollBottom();
  }, [lang, isAdmin, setAdmin, setCvOpen, setLang, setTermOpen, setAccent]);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const val = e.currentTarget.value;
    e.currentTarget.value = "";
    if (awaitingPassword) {
      setAwaitingPassword(false);
      runCmd(`login ${val}`);
    } else {
      runCmd(val);
    }
  };

  if (!termOpen) return null;

  return (
    <div
      onClick={() => setTermOpen(false)}
      style={{ position: "fixed", inset: 0, zIndex: 10030, background: "rgba(5,6,5,0.55)", backdropFilter: "blur(2px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 840, height: "min(58vh,440px)", margin: "0 14px", background: "#08090a", border: "1px solid #2a2c2a", borderBottom: "none", display: "flex", flexDirection: "column", boxShadow: "0 -24px 70px -24px rgba(0,0,0,0.85)", animation: "gq-rise .22s ease both" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 14px", borderBottom: "1px solid #1c1e1c", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.14em", color: "#8a8d83" }}>
          <span><span style={{ color: "var(--ac,#c7f536)" }}>●</span> girquell@dev — /portfolio</span>
          <button
            onClick={() => setTermOpen(false)} aria-label="Close terminal"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 6px", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#8a8d83", transition: "color .2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--pink,#ff2d8e)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#8a8d83"; }}
          >✕</button>
        </div>

        <div ref={bodyRef} style={{ flex: 1, overflowY: "auto", padding: 14, fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, lineHeight: 1.7 }}>
          {history.map((ln, i) => (
            <div key={i} style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", color: ln.color || "#9a9d96" }}>{ln.text}</div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 14px", borderTop: "1px solid #1c1e1c" }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, color: "var(--ac,#c7f536)", whiteSpace: "nowrap" }}>girquell@dev:~$</span>
          <input
            ref={inputRef} onKeyDown={onKey}
            type={awaitingPassword ? "password" : "text"}
            spellCheck={false} autoComplete="off"
            placeholder={awaitingPassword ? "••••••••" : t("hint")}
            style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#e8e9e4", fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, letterSpacing: "0.02em" }}
          />
        </div>
      </div>
    </div>
  );
}
