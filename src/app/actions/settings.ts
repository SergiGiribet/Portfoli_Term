"use server";

import { createClient } from "@/lib/supabase/server";

interface SettingsData {
  display_name:  string;
  slogan:        string;
  accent:        string;
  default_lang:  string;
  scanlines:     boolean;
  boot_sequence: boolean;
  hud_cursor:    boolean;
  sub_name:      string;
  coords:        string;
  year:          string;
  contact_cat:   string;
  contact_es:    string;
  contact_en:    string;
  status_text:   string;
  marquee_text:  string;
  hero_roles:    string;
}

export async function saveSettings(data: SettingsData): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { ok: false, error: "Supabase not configured" };
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("settings") as any).upsert({ id: 1, ...data });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
