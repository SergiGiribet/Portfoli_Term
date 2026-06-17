import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        archivo: ["'Archivo Black'", "sans-serif"],
        chakra: ["'Chakra Petch'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        bg: {
          page:     "#0a0b0a",
          boot:     "#08090a",
          panel:    "#0c0d0c",
          card:     "#0e0f0e",
          hover:    "#111210",
        },
        border: {
          DEFAULT: "#2a2c2a",
          dim:     "#1c1e1c",
          faint:   "#181a18",
          ghost:   "#3a3d3a",
        },
        ink: {
          heading: "#edeee8",
          body:    "#d6d8d1",
          muted:   "#9a9d96",
          hud:     "#8a8d86",
          ghost:   "#121312",
        },
        lime:   "#c7f536",
        pink:   "#ff2d8e",
        violet: "#9d8dff",
      },
    },
  },
  plugins: [],
};

export default config;
