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

export async function GET(req: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.json([]);
  const res = NextResponse.json([]);
  const supabase = makeSupabase(req, res);
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.email !== ADMIN_EMAIL) return NextResponse.json([], { status: 401 });
  const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.json({ error: "not configured" }, { status: 503 });
  const res = NextResponse.json({ ok: true });
  const body = await req.json() as { name?: string; email?: string; subject?: string; body?: string };
  if (!body.name || !body.email || !body.body) return NextResponse.json({ error: "name, email and body required" }, { status: 400 });
  const supabase = makeSupabase(req, res);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("messages") as any).insert({ name: body.name, email: body.email, subject: body.subject ?? "", body: body.body });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return res;
}
