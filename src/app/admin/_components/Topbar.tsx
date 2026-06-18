const mono = "'JetBrains Mono',monospace";
const sans = "'Chakra Petch',sans-serif";

interface TopbarProps {
  eyebrow: string;
  title: string;
  actions?: React.ReactNode;
}

export default function Topbar({ eyebrow, title, actions }: TopbarProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid #1c1e1c", flexShrink: 0 }}>
      <div>
        <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.22em", color: "var(--ac,#c7f536)", marginBottom: 4 }}>{eyebrow}</div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 22, letterSpacing: "0.01em", color: "#edeee8" }}>{title}</div>
      </div>
      {actions && <div style={{ display: "flex", alignItems: "center", gap: 10 }}>{actions}</div>}
    </div>
  );
}
