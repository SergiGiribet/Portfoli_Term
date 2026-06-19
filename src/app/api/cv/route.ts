import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.json(null);
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supa = supabase as any;
    const [{ data: cv }, { data: profile }] = await Promise.all([
      supa.from("cv_data").select("*").eq("id", 1).single(),
      supa.from("profile").select("bio1_en,bio1_es,bio1_cat").eq("id", 1).single(),
    ]);
    if (!cv) return NextResponse.json(null);
    return NextResponse.json({
      ...cv,
      bio1_en:  profile?.bio1_en  ?? "",
      bio1_es:  profile?.bio1_es  ?? "",
      bio1_cat: profile?.bio1_cat ?? "",
    });
  } catch {
    return NextResponse.json(null);
  }
}
