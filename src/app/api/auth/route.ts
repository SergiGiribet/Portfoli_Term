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
        getAll()             { return req.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );
}

// GET — check whether there is an active session
export async function GET(req: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ authenticated: false });
  }
  const res = NextResponse.json({ authenticated: false });
  const supabase = makeSupabase(req, res);
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.email === ADMIN_EMAIL) {
    return NextResponse.json({ authenticated: true });
  }
  return res;
}

// POST — sign in with password
export async function POST(req: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { password } = await req.json() as { password?: string };
  if (!password) {
    return NextResponse.json({ error: "password required" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
  const supabase = makeSupabase(req, res);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password,
  });

  if (error || !data.session) {
    console.error("[auth] signInWithPassword failed:", error?.message, error?.status);
    return NextResponse.json(
      { error: error?.message ?? "no session returned" },
      { status: 401 }
    );
  }

  return res;
}

// DELETE — sign out
export async function DELETE(req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return res;
  const supabase = makeSupabase(req, res);
  await supabase.auth.signOut();
  return res;
}
