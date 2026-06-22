"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

const ACCENT_HEX: Record<string, string> = {
  Lime:   "#c7f536",
  Pink:   "#ff2d8e",
  Violet: "#9d8dff",
};

export default function FaviconSync() {
  const { accent } = useStore();

  useEffect(() => {
    const color = (ACCENT_HEX[accent] ?? ACCENT_HEX.Lime).replace("#", "%23");
    const svg = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%230a0b0a'/><rect x='11' y='7' width='5' height='18' fill='${color}'/><rect x='18' y='7' width='3' height='3' fill='${color}'/></svg>`;

    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/svg+xml";
    link.href = svg;
  }, [accent]);

  return null;
}
