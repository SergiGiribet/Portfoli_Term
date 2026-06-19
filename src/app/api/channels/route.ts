import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.json(null);
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("channels").select("*").eq("live", true).order("sort_order");
    return NextResponse.json(data ?? null);
  } catch {
    return NextResponse.json(null);
  }
}
