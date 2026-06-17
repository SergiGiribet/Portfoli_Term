"use server";

import { createClient } from "@/lib/supabase/server";
import { getProjectsFromDB, type ProjectFlat } from "@/lib/supabase/queries";
import type { Lang } from "@/types/content";
import type { Database } from "@/lib/supabase/types";

export type { ProjectFlat };

type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];

export async function fetchProjects(lang: Lang): Promise<ProjectFlat[]> {
  return getProjectsFromDB(lang);
}

export async function upsertProject(
  project: ProjectInsert
): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { ok: false, error: "Supabase not configured" };
  }
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from("projects").upsert(project as any);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
