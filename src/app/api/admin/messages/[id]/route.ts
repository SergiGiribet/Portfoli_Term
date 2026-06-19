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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.json({ error: "not configured" }, { status: 503 });
  const res = NextResponse.json({ ok: true });
  const supabase = makeSupabase(req, res);
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.email !== ADMIN_EMAIL) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body = await req.json() as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("messages") as any).update(body).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return res;
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.json({ error: "not configured" }, { status: 503 });
  const res = NextResponse.json({ ok: true });
  const supabase = makeSupabase(req, res);
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.email !== ADMIN_EMAIL) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("messages") as any).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return res;
}
