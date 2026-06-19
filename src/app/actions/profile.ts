"use server";

import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/types";

interface ProfileData {
  sheet:    Json;
  bio1_cat: string; bio1_es: string; bio1_en: string;
  bio2_cat: string; bio2_es: string; bio2_en: string;
  stack:    Json;
  photo?:   string | null;
}

export async function saveProfile(data: ProfileData): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { ok: false, error: "Supabase not configured" };
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("profile") as any).upsert({ id: 1, ...data });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
