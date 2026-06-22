import type { Metadata, Viewport } from "next";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import type { SettingsRow } from "@/lib/supabase/types";

export const viewport: Viewport = {
  themeColor: "#0a0b0a",
};

export async function generateMetadata(): Promise<Metadata> {
  let displayName = "GIRQUELL";
  let subName = "Sergi Giribet";
  let slogan = "BORN TO USE. MADE TO CREATE.";

  try {
    const supabase = await createClient();
    const res = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .single();
    const row = res.data as SettingsRow | null;
    if (row) {
      if (row.display_name) displayName = row.display_name;
      if (row.sub_name) subName = row.sub_name;
      if (row.slogan) slogan = row.slogan;
    }
  } catch { /* use fallbacks */ }

  const title = `${displayName} // ${subName} — Multiplatform Developer`;
  const description = `${slogan} · ${subName}, multiplatform developer.`;

  return {
    metadataBase: new URL("https://girquell.cat"),
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      images: [{ url: "/images/og-card.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Hats4Ducks",
      images: ["/images/og-card.png"],
    },
    icons: { icon: "/images/favicon.svg" },
  };
}

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
