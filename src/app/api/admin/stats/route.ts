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
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.json(null);
  const res = NextResponse.json(null);
  const supabase = makeSupabase(req, res);
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.email !== ADMIN_EMAIL) return NextResponse.json(null, { status: 401 });

  const [
    { count: projects },
    { count: totalMsgs },
    { count: unreadMsgs },
    { count: channels },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("messages").select("*", { count: "exact", head: true }),
    supabase.from("messages").select("*", { count: "exact", head: true }).eq("read", false).eq("archived", false),
    supabase.from("channels").select("*", { count: "exact", head: true }).eq("live", true),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: lastRow } = await (supabase.from("messages") as any)
    .select("created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle() as { data: { created_at: string } | null };

  return NextResponse.json({
    projects:        projects   ?? 0,
    total_messages:  totalMsgs  ?? 0,
    unread_messages: unreadMsgs ?? 0,
    channels:        channels   ?? 0,
    last_message_at: lastRow?.created_at ?? null,
  });
}
