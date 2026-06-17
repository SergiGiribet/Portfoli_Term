import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0a0b0a",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://girquell.cat"),
  title: "GIRQUELL // Sergi Giribet — Multiplatform Developer",
  description:
    "Portfolio of Sergi Giribet (GIRQUELL) — multiplatform developer, CS Engineering student and founder of DuckHats. Web · mobile · hardware.",
  openGraph: {
    type: "website",
    title: "GIRQUELL // Sergi Giribet — Multiplatform Developer",
    description:
      "Multiplatform developer, CS Engineering student and founder of DuckHats. Web · mobile · hardware.",
    images: [{ url: "/images/og-card.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Hats4Ducks",
    images: ["/images/og-card.png"],
  },
  icons: { icon: "/images/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
