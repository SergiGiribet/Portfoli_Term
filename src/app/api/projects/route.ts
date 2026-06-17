import { NextRequest, NextResponse } from "next/server";
import { getProjectsFromDB } from "@/lib/supabase/queries";
import type { Lang } from "@/types/content";

export const revalidate = 60; // ISR: regenerate at most once per minute

export async function GET(req: NextRequest) {
  const lang = (req.nextUrl.searchParams.get("lang") ?? "EN").toUpperCase() as Lang;
  const valid: Lang[] = ["CAT", "ES", "EN"];
  const safeLang: Lang = valid.includes(lang) ? lang : "EN";

  const projects = await getProjectsFromDB(safeLang);
  return NextResponse.json(projects);
}
