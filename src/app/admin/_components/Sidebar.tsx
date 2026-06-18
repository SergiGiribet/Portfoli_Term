"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const mono  = "'JetBrains Mono',monospace";
const sans  = "'Chakra Petch',sans-serif";
const black = "'Archivo Black',sans-serif";

const NAV = [
  { idx: "01", label: "DASHBOARD",   href: "/admin/dashboard" },
  { idx: "02", label: "PROJECTS",    href: "/admin/projects"  },
  { idx: "03", label: "PROFILE",     href: "/admin/profile"   },
  { idx: "04", label: "CV / RESUME", href: "/admin/cv"        },
  { idx: "05", label: "CONTACT",     href: "/admin/channels"  },
  { idx: "06", label: "MESSAGES",    href: "/admin/messages"  },
  { idx: "07", label: "SETTINGS",    href: "/admin/settings"  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/");
  };

  return (
    <aside style={{ width: 222, flexShrink: 0, borderRight: "1px solid #1c1e1c", background: "#0c0d0c", display: "flex", flexDirection: "column", minHeight: "100vh", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
      {/* logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "17px 16px", borderBottom: "1px solid #1c1e1c" }}>
        <span style={{ width: 9, height: 18, background: "var(--ac,#c7f536)", flexShrink: 0 }} />
        <span style={{ fontFamily: black, fontSize: 14, letterSpacing: "0.03em", color: "#edeee8" }}>GIRQUELL</span>
        <span style={{ fontFamily: mono, fontSize: 8, letterSpacing: "0.2em", color: "#7e8178", alignSelf: "flex-start", marginTop: 3 }}>CMS</span>
      </div>

      {/* nav */}
      <nav style={{ flex: 1, padding: "10px 0" }}>
        {NAV.map(({ idx, label, href }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", borderLeft: `3px solid ${active ? "var(--ac,#c7f536)" : "transparent"}`, background: active ? "#121312" : "transparent", transition: "background .15s" }}>
              <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.1em", color: active ? "var(--ac,#c7f536)" : "#5a5d57", width: 18 }}>{idx}</span>
              <span style={{ fontFamily: sans, fontSize: 13, letterSpacing: "0.04em", color: active ? "#edeee8" : "#9a9d96", fontWeight: active ? 700 : 500 }}>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* user chip */}
      <div style={{ padding: "14px 16px", borderTop: "1px solid #1c1e1c", display: "flex", alignItems: "center", gap: 11 }}>
        <div style={{ width: 32, height: 32, flexShrink: 0, border: "1px solid #2a2c2a", background: "#111210", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: black, fontSize: 13, color: "var(--ac,#c7f536)" }}>S</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 12, color: "#e8e9e4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Sergi Giribet</div>
          <div style={{ fontFamily: mono, fontSize: 8, letterSpacing: "0.16em", color: "#7e8178" }}>OPERATOR // ADMIN</div>
        </div>
        <button
          onClick={handleLogout}
          title="Log out"
          style={{ background: "none", border: "1px solid #2a2c2a", color: "#5a5d57", fontFamily: mono, fontSize: 9, letterSpacing: "0.1em", padding: "5px 7px", cursor: "pointer", flexShrink: 0, transition: "all .15s" }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--pink,#ff2d8e)"; e.currentTarget.style.borderColor = "var(--pink,#ff2d8e)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#5a5d57"; e.currentTarget.style.borderColor = "#2a2c2a"; }}
        >⏻</button>
      </div>
    </aside>
  );
}
