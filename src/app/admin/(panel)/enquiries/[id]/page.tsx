import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Paperclip } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { adminEnquiry } from "@/lib/admin/data";
import { updateEnquiryStatus } from "@/app/admin/actions";
import { adminInput, DemoBadge, fmtDate, Notice, PageTitle, Panel, primaryBtn, StatusBadge } from "@/components/admin/ui";
import { ENQUIRY_STATUSES, ENQUIRY_STATUS_LABELS } from "@/types";

export const metadata = { title: "Enquiry" };

export default async function EnquiryPage({ params, searchParams }: PageProps<"/admin/enquiries/[id]">) {
  const [{ id }, sp, ctx] = await Promise.all([params, searchParams, requireAdmin()]);
  const e = await adminEnquiry(ctx, id);
  if (!e) notFound();
  const readOnly = ctx.mode === "demo" || e.isDemo;

  const field = (label: string, value?: string | null) => (
    <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt><dd className="mt-1 text-sm text-charcoal">{value || <span className="text-muted-foreground">—</span>}</dd></div>
  );

  return (
    <>
      <Link href="/admin/enquiries" className="mb-5 inline-flex items-center gap-2 text-sm text-navy hover:text-brand-red"><ArrowLeft className="size-4" aria-hidden /> All enquiries</Link>
      <PageTitle title={e.enquiryNumber} sub={`Received ${fmtDate(e.createdAt)}`} action={<div className="flex items-center gap-2">{e.isDemo && <DemoBadge />}<StatusBadge status={e.status} /></div>} />
      {sp.updated && <Notice kind="ok">Status updated.</Notice>}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Panel title="Selected products">
            <div className="-my-2 divide-y divide-line">
              {e.items.length === 0 && <p className="py-4 text-sm text-muted-foreground">No products attached (contact-form message).</p>}
              {e.items.map((i, k) => (
                <div key={k} className="flex flex-wrap items-baseline justify-between gap-3 py-3.5">
                  <div><p className="text-sm font-medium text-navy">{i.productName}</p>{i.customizationNotes && <p className="mt-0.5 text-xs text-muted-foreground">{i.customizationNotes}</p>}</div>
                  <p className="text-sm tabular-nums"><span className="text-muted-foreground">Qty </span><strong>{i.quantity}</strong></p>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Requirements">
            <dl className="grid gap-5 sm:grid-cols-2">
              {field("Customization requirements", e.customizationRequirements)}
              {field("Additional notes", e.notes)}
              {field("Budget range", e.budgetRange)}
              {field("Required delivery date", e.deliveryDate)}
            </dl>
            {e.logoUrl && (
              <a href={e.logoUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 border border-input px-4 py-2 text-sm text-navy hover:border-navy"><Paperclip className="size-4" aria-hidden /> Open uploaded file (link expires in 15 min)</a>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Customer">
            <dl className="space-y-4">
              {field("Name", e.customerName)}
              {field("Company", e.companyName)}
              <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Email</dt><dd className="mt-1 text-sm"><a href={`mailto:${e.email}`} className="text-navy hover:text-brand-red">{e.email}</a></dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Phone</dt><dd className="mt-1 text-sm"><a href={`tel:${e.phone}`} className="text-navy hover:text-brand-red">{e.phone}</a></dd></div>
            </dl>
          </Panel>
          <Panel title="Update status">
            <form action={updateEnquiryStatus} className="space-y-3">
              <input type="hidden" name="id" value={e.id} />
              <label htmlFor="status" className="sr-only">Status</label>
              <select id="status" name="status" defaultValue={e.status} disabled={readOnly} className={adminInput}>
                {ENQUIRY_STATUSES.map((s) => (<option key={s} value={s}>{ENQUIRY_STATUS_LABELS[s]}</option>))}
              </select>
              <button type="submit" disabled={readOnly} className={`${primaryBtn} w-full`}>Save status</button>
              {readOnly && <p className="text-xs text-muted-foreground">{e.isDemo ? "Demo records are read-only." : "Read-only in demo mode."}</p>}
            </form>
          </Panel>
        </div>
      </div>
    </>
  );
}
