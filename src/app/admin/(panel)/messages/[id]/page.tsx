import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { adminMessage } from "@/lib/admin/data";
import { retryContactEmail, setMessageStatus } from "@/app/admin/actions";
import { DemoBadge, EmailBadge, fmtDate, Notice, PageTitle, Panel, primaryBtn, ghostBtn } from "@/components/admin/ui";

export const metadata = { title: "Message" };

export default async function MessagePage({ params, searchParams }: PageProps<"/admin/messages/[id]">) {
  const [{ id }, sp, ctx] = await Promise.all([params, searchParams, requireAdmin()]);
  const m = await adminMessage(ctx, id);
  if (!m) notFound();
  const readOnly = ctx.mode === "demo" || m.isDemo;

  const field = (label: string, value?: string | null) => (
    <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt><dd className="mt-1 text-sm text-charcoal">{value || <span className="text-muted-foreground">—</span>}</dd></div>
  );

  return (
    <>
      <Link href="/admin/messages" className="mb-5 inline-flex items-center gap-2 text-sm text-navy hover:text-brand-red"><ArrowLeft className="size-4" aria-hidden /> All messages</Link>
      <PageTitle title={m.referenceNumber} sub={`Received ${fmtDate(m.createdAt)}`} action={<div className="flex items-center gap-2">{m.isDemo && <DemoBadge />}<EmailBadge status={m.emailStatus} /></div>} />
      {sp.updated && <Notice kind="ok">Message updated.</Notice>}
      {sp.retried === "sent" && <Notice kind="ok">Notification email sent.</Notice>}
      {sp.retried === "failed" && <Notice kind="error">The email could not be sent. See the error below.</Notice>}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Panel title="Message">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-charcoal">{m.message}</p>
          </Panel>
          <Panel title="Details">
            <dl className="grid gap-5 sm:grid-cols-2">
              {field("Subject", m.subject)}
              {field("Company", m.companyName)}
              {field("Phone", m.phone)}
              <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Email</dt><dd className="mt-1 text-sm"><a href={`mailto:${m.email}`} className="text-navy hover:text-brand-red">{m.email}</a></dd></div>
            </dl>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="From"><p className="text-base font-medium text-navy">{m.customerName}</p></Panel>
          <Panel title="Email notification">
            <div className="space-y-3 text-sm">
              <p className="flex items-center justify-between"><span className="text-muted-foreground">Status</span><EmailBadge status={m.emailStatus} /></p>
              <p className="flex items-center justify-between"><span className="text-muted-foreground">Attempts</span><span>{m.emailAttempts}</span></p>
              {m.emailError && <p className="break-words border border-brand-red/30 bg-brand-red/5 p-2.5 text-xs text-charcoal">{m.emailError}</p>}
              {m.emailStatus !== "sent" && (
                <form action={retryContactEmail}>
                  <input type="hidden" name="id" value={m.id} />
                  <button disabled={readOnly} className={`${primaryBtn} w-full`}><RefreshCw className="size-4" aria-hidden /> Retry email</button>
                </form>
              )}
            </div>
          </Panel>
          <Panel title="Status">
            <form action={setMessageStatus}>
              <input type="hidden" name="id" value={m.id} />
              <input type="hidden" name="status" value={m.status === "new" ? "handled" : "new"} />
              <button disabled={readOnly} className={`${ghostBtn} w-full`}>{m.status === "new" ? "Mark as handled" : "Mark as new"}</button>
            </form>
            {readOnly && <p className="mt-2 text-xs text-muted-foreground">{m.isDemo ? "Demo records are read-only." : "Read-only in demo mode."}</p>}
          </Panel>
        </div>
      </div>
    </>
  );
}
