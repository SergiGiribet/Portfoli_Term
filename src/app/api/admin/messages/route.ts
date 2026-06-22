import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/types";
import { ADMIN_EMAIL } from "@/lib/constants";

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

// --- Rate limiting (in-memory, per instance) ---
const rlMap = new Map<string, number[]>();
const RL_WINDOW = 60_000;
const RL_MAX = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rlMap.get(ip) ?? []).filter(t => t > now - RL_WINDOW);
  if (hits.length >= RL_MAX) return true;
  hits.push(now);
  rlMap.set(ip, hits);
  return false;
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

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown";
  if (isRateLimited(ip)) return NextResponse.json({ error: "too many requests" }, { status: 429 });

  const res = NextResponse.json({ ok: true });
  const body = await req.json() as { name?: string; email?: string; subject?: string; body?: string; _trap?: string };

  // Honeypot: bots fill hidden fields — silently accept without inserting
  if (body._trap) return res;

  if (!body.name || !body.email || !body.body) return NextResponse.json({ error: "name, email and body required" }, { status: 400 });

  const supabase = makeSupabase(req, res);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("messages") as any).insert({ name: body.name, email: body.email, subject: body.subject ?? "", body: body.body });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return res;
}
