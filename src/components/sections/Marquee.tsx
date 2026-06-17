export default function Marquee() {
  const item = (
    <span>
      WEB&nbsp;&nbsp;◆&nbsp;&nbsp;MOBILE&nbsp;&nbsp;◆&nbsp;&nbsp;HARDWARE&nbsp;&nbsp;◆&nbsp;&nbsp;
      <span style={{ color: "var(--ac,#c7f536)" }}>開発者</span>
      &nbsp;&nbsp;◆&nbsp;&nbsp;BORN TO USE. MADE TO CREATE.&nbsp;&nbsp;◆&nbsp;&nbsp;DUCKHATS&nbsp;&nbsp;◆&nbsp;&nbsp;
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
