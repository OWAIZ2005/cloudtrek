import "server-only";
import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createSessionClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type AdminContext =
  | { mode: "demo" }
  | { mode: "live"; db: SupabaseClient; user: User };

/**
 * Authoritative admin guard. Supabase must authenticate the visitor and the
 * account must carry app_metadata.role = 'admin'; otherwise redirect to login.
 * With Supabase unconfigured the dashboard runs in read-only DEMO mode on
 * sample data only (there is nothing real to protect or modify).
 */
export async function requireAdmin(): Promise<AdminContext> {
  if (!isSupabaseConfigured) return { mode: "demo" };
  const db = await createSessionClient();
  if (!db) return { mode: "demo" };
  const { data } = await db.auth.getUser();
  if (!data.user || data.user.app_metadata?.role !== "admin") redirect("/admin/login");
  return { mode: "live", db, user: data.user };
}

/** For server actions: throws unless a verified admin session exists on a configured backend. */
export async function requireAdminForWrite(): Promise<{ db: SupabaseClient; user: User }> {
  const ctx = await requireAdmin();
  if (ctx.mode !== "live") throw new Error("Demo mode is read-only. Connect Supabase to enable changes.");
  return { db: ctx.db, user: ctx.user };
}
