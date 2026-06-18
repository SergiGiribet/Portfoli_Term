import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "./_components/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "GIRQUELL CMS" };

const ADMIN_EMAIL = "sergi@giribet.cat";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) redirect("/");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.email !== ADMIN_EMAIL) redirect("/");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0b0a", color: "#e8e9e4", fontFamily: "'Chakra Petch',sans-serif" }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {children}
      </main>
    </div>
  );
}
