"use client";

import { useStore } from "@/lib/store";

export default function Marquee() {
  const { siteSettings } = useStore();

  const segments = siteSettings.marquee_text.split("◆");

  const item = (
    <span>
      {segments.map((seg, i) => (
        <span key={i}>
          {seg}
          {i < segments.length - 1 && (
            <span style={{ color: "var(--ac,#c7f536)" }}>◆</span>
          )}
        </span>
      ))}
    </span>
  );

  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid #1c1e1c", borderBottom: "1px solid #1c1e1c", background: "#0c0d0c", padding: "10px 0" }}>
      <div className="animate-gq-mq" style={{ display: "flex", width: "max-content", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: "#7a7d76", whiteSpace: "nowrap" }}>
        {item}{item}
      </div>
    </div>
  );
}
