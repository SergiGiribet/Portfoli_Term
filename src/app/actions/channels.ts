"use server";

import { createClient } from "@/lib/supabase/server";
import type { ChannelRow } from "@/lib/supabase/types";

export type ChannelFlat = ChannelRow;

export async function saveChannels(
  channels: Array<{ id?: string; label: string; value: string; href: string; live: boolean; sort_order: number }>
): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { ok: false, error: "Supabase not configured" };
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("channels") as any).upsert(channels);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export async function deleteChannel(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { ok: false, error: "Supabase not configured" };
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("channels") as any).delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
