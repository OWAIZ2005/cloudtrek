import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { signOut } from "../actions";
import { AdminNav } from "@/components/admin/nav";
import { CloudTrekLogo } from "@/components/brand/cloudtrek-logo";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireAdmin();
  const demo = ctx.mode === "demo";

  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-white lg:border-b-0 lg:border-e">
        <div className="flex items-center justify-between gap-4 px-4 py-4 lg:flex-col lg:items-start lg:px-5 lg:py-6">
          <CloudTrekLogo variant="navbar" href="/" className="h-10 lg:h-14" sizes="240px" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Admin</span>
        </div>
        <div className="px-3 pb-3 lg:px-3 lg:pb-6"><AdminNav /></div>
        <div className="hidden space-y-1 border-t border-line p-3 lg:block">
          <Link href="/" target="_blank" className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-charcoal/70 hover:text-navy"><ExternalLink className="size-4" aria-hidden /> View website</Link>
          {!demo && (
            <form action={signOut}>
              <button className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-charcoal/70 hover:text-brand-red"><LogOut className="size-4" aria-hidden /> Sign out</button>
            </form>
          )}
        </div>
      </aside>

      <div className="min-w-0">
        {demo ? (
          <div role="status" className="border-b border-brand-red/30 bg-brand-red/5 px-5 py-3 text-sm text-charcoal sm:px-8">
            <strong className="text-brand-red">Demo mode.</strong> Supabase is not connected, so this dashboard shows illustrative sample data and is read-only. See the README to connect your database and sign in as an admin.
          </div>
        ) : (
          <div className="flex items-center justify-between border-b border-line bg-white px-5 py-3 text-xs text-muted-foreground sm:px-8 lg:hidden">
            <span>{ctx.user.email}</span>
            <form action={signOut}><button className="font-medium text-navy hover:text-brand-red">Sign out</button></form>
          </div>
        )}
        <div className="px-5 py-8 sm:px-8 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
