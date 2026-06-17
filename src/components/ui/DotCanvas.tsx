"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";

const ACCENT_RGB: Record<string, [number, number, number]> = {
  Lime:   [199, 245, 54],
  Pink:   [255, 45, 142],
  Violet: [157, 141, 255],
};

export default function DotCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { accent } = useStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(
      window.devicePixelRatio || 1,
      window.innerWidth < 700 ? 1.5 : 2
    );
    let W = 0, H = 0;
    let mx = -9999, my = -9999, mtx = -9999, mty = -9999;
    let scrollY = window.scrollY;
    let raf: number;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMove = (e: MouseEvent) => { mtx = e.clientX; mty = e.clientY; };
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);

    const start = performance.now();
    const R_BASE = 1.1;
    const MOUSE_R = 150;

    const draw = () => {
      const GAP = W < 700 ? 56 : 34;
      mx += (mtx - mx) * 0.12;
      my += (mty - my) * 0.12;
      const t = (performance.now() - start) * 0.001;
      const [ar, ag, ab] = ACCENT_RGB[accent] ?? ACCENT_RGB.Lime;
      const cols = Math.ceil(W / GAP) + 1;
      const rows = Math.ceil(H / GAP) + 1;
      const span = W + H;
      const wavePos = (t * 240) % (span + 600) - 300;

      ctx.clearRect(0, 0, W, H);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * GAP;
          const y = r * GAP;
          const ox = Math.sin(t * 0.6 + r * 0.5) * 2.2;
          const oy = Math.cos(t * 0.5 + c * 0.5) * 2.2;
          const px = x + ox;
          const py = y + oy - (scrollY * 0.04) % GAP;

          let level = 0.16;
          let rad = R_BASE;

          const diag = x + (H - y);
          const dw = Math.abs(diag - wavePos);
          if (dw < 110) { const f = 1 - dw / 110; level += f * 0.7; rad += f * 1.1; }

          const dx = px - mx, dy = py - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_R) { const f = 1 - dist / MOUSE_R; level += f * 0.9; rad += f * 2.4; }

          if (level > 1) level = 1;
          ctx.beginPath();
          ctx.arc(px, py, rad, 0, 6.2832);
          ctx.fillStyle = `rgba(${ar},${ag},${ab},${(level * 0.55).toFixed(3)})`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, [accent]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
