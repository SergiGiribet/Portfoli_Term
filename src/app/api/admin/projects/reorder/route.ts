import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/types";

const ADMIN_EMAIL = "sergi@giribet.cat";

function makeSupabase(req: NextRequest, res: NextResponse) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll(); },
        setAll(list) { list.forEach(({ name, value, options }) => res.cookies.set(name, value, options)); },
      },
    }
  );
}

export async function POST(req: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.json({ error: "not configured" }, { status: 503 });
  const res = NextResponse.json({ ok: true });
  const supabase = makeSupabase(req, res);
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.email !== ADMIN_EMAIL) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { ids } = await req.json() as { ids: string[] };
  await Promise.all(
    ids.map((id, i) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase.from("projects") as any).update({ sort_order: i + 1 }).eq("id", id)
    )
  );
  return res;
}
