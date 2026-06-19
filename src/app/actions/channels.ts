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
    const supa = supabase as any;

    const existing = channels.filter(c => c.id);
    const created  = channels.filter(c => !c.id).map(({ id: _id, ...rest }) => rest);
    const keptIds  = existing.map(c => c.id!);

    // Delete channels removed in the UI
    if (keptIds.length > 0) {
      const { error } = await supa.from("channels").delete().not("id", "in", `(${keptIds.join(",")})`);
      if (error) return { ok: false, error: error.message };
    } else {
      // All channels are new — wipe the table
      const { error } = await supa.from("channels").delete().not("id", "is", null);
      if (error) return { ok: false, error: error.message };
    }

    // Upsert channels that already have an id
    if (existing.length) {
      const { error } = await supa.from("channels").upsert(existing);
      if (error) return { ok: false, error: error.message };
    }

    // Insert brand-new channels (let DB generate uuid)
    if (created.length) {
      const { error } = await supa.from("channels").insert(created);
      if (error) return { ok: false, error: error.message };
    }

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
