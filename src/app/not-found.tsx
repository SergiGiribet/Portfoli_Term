const mono = "'JetBrains Mono',monospace";
const arch = "'Archivo Black',sans-serif";
const sans = "'Chakra Petch',sans-serif";
const ac = "var(--ac,#c7f536)";

export default function NotFound() {
  return (
    <div style={{
      background: "#0a0b0a",
      color: "#e8e9e4",
      minHeight: "100vh",
      fontFamily: mono,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 28px",
    }}>
      <div style={{ width: "100%", maxWidth: 640 }}>

        {/* terminal log panel */}
        <div style={{ border: "1px solid #2a2c2a" }}>
          <div style={{ padding: "9px 14px", borderBottom: "1px solid #1c1e1c", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 9, letterSpacing: "0.2em", color: "#8a8d83" }}>SYSTEM // ERROR_LOG</span>
            <span style={{ fontSize: 9, color: "var(--pink,#ff2d8e)" }}>●</span>
          </div>
          <div style={{ padding: "20px", fontSize: 11, lineHeight: 2.2, color: "#9a9d96" }}>
            <div><span style={{ color: "#3a3d38" }}>&gt;</span> <span style={{ color: "#8a8d83" }}>resolving route...</span></div>
            <div><span style={{ color: "#3a3d38" }}>&gt;</span> <span style={{ color: "var(--pink,#ff2d8e)" }}>ERROR 404 // path not found</span></div>
            <div><span style={{ color: "#3a3d38" }}>&gt;</span> <span style={{ color: "#8a8d83" }}>expected: valid route</span></div>
            <div><span style={{ color: "#3a3d38" }}>&gt;</span> <span style={{ color: "#5a5d57" }}>received: undefined</span></div>
          </div>
        </div>

        {/* big 404 */}
        <div style={{ margin: "32px 0 28px" }}>
          <span style={{
            fontFamily: arch,
            fontSize: "clamp(80px,18vw,148px)",
            lineHeight: 0.88,
            color: "#1a1c1a",
            display: "block",
            userSelect: "none",
          }}>404</span>
          <h1 style={{
            margin: "18px 0 8px",
            fontFamily: sans,
            fontWeight: 700,
            fontSize: "clamp(18px,3.5vw,28px)",
            letterSpacing: "0.02em",
            color: "#edeee8",
          }}>
            RUTA NO TROBADA
          </h1>
          <p style={{ margin: 0, fontFamily: sans, fontSize: 14, color: "#9a9d96", lineHeight: 1.7 }}>
            La pàgina que busques no existeix o ha estat moguda.
          </p>
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a
            href="/"
            style={{
              fontFamily: mono, fontSize: 10, letterSpacing: "0.16em",
              textTransform: "uppercase", textDecoration: "none",
              color: "#0a0b0a", background: ac, padding: "11px 18px",
              display: "inline-block",
            }}
          >← TORNAR A L&apos;INICI</a>
          <a
            href="/#work"
            style={{
              fontFamily: mono, fontSize: 10, letterSpacing: "0.16em",
              textTransform: "uppercase", textDecoration: "none",
              color: "#9a9d96", border: "1px solid #2a2c2a",
              padding: "11px 18px", display: "inline-block",
            }}
          >VEURE PROJECTES</a>
        </div>

        {/* footer strip */}
        <div style={{
          marginTop: 52,
          paddingTop: 18,
          borderTop: "1px solid #1c1e1c",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 9,
          letterSpacing: "0.2em",
          color: "#5a5d57",
        }}>
          <span>GIRQUELL // DEV.SYS_v2</span>
          <span>STATUS: 404</span>
        </div>
      </div>
    </div>
  );
}
