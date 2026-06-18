"use server";

import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/types";

interface CvData {
  identity:    Json;
  experience:  Json;
  education:   Json;
  skills:      Json;
  languages:   Json;
  volunteering: Json;
}

export async function saveCv(data: CvData): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { ok: false, error: "Supabase not configured" };
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("cv_data") as any).upsert({ id: 1, ...data });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
