import { createClient } from "./server";
import { content } from "@/lib/content";
import type { Lang } from "@/types/content";
import type { ProjectRow } from "./types";

export type ProjectFlat = {
  id:    string;
  no:    string;
  org:   string;
  cjk:   string;
  kind:  string;
  img:   string;
  href:  string;
  tags:  string[];
  role:  string;
  year:  string;
  name:  string;
  descL: string;
  longL: string;
};

function rowToFlat(row: ProjectRow, lang: Lang): ProjectFlat {
  const desc = { CAT: row.desc_cat, ES: row.desc_es, EN: row.desc_en };
  const long = { CAT: row.long_cat, ES: row.long_es, EN: row.long_en };
  return {
    id:    row.id,
    no:    row.no,
    org:   row.org,
    cjk:   row.cjk,
    kind:  row.kind,
    img:   row.img,
    href:  row.href,
    tags:  row.tags,
    role:  row.role,
    year:  row.year,
    name:  row.name,
    descL: desc[lang] || desc.EN,
    longL: long[lang] || long.EN,
  };
}

function staticFallback(lang: Lang): ProjectFlat[] {
  return content.projects.map((p, i) => ({
    id:    `static-${i}`,
    no:    p.no,
    org:   p.org,
    cjk:   p.cjk,
    kind:  p.kind,
    img:   p.img,
    href:  p.href,
    tags:  p.tags,
    role:  p.role,
    year:  p.year,
    name:  p.name,
    descL: p.desc[lang] || p.desc.EN,
    longL: p.long[lang] || p.long.EN,
  }));
}

export async function getProjectsFromDB(lang: Lang): Promise<ProjectFlat[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return staticFallback(lang);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return staticFallback(lang);
    return data.map((row) => rowToFlat(row, lang));
  } catch {
    return staticFallback(lang);
  }
}
