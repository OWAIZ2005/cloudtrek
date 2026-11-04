import Link from "next/link";
import { Boxes, ClipboardList, Clock, Inbox } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { adminOverview } from "@/lib/admin/data";
import { DemoBadge, fmtDate, Panel, PageTitle, StatusBadge } from "@/components/admin/ui";
import { CategoryChart, MonthlyChart, StatusChart } from "@/components/admin/charts";

export const metadata = { title: "Overview" };

export default async function OverviewPage() {
  const ctx = await requireAdmin();
  const o = await adminOverview(ctx);

  const cards = [
    { label: "Total products", value: o.totalProducts, icon: Boxes },
    { label: "Total enquiries", value: o.totalEnquiries, icon: Inbox },
    { label: "Pending enquiries", value: o.pendingEnquiries, icon: Clock, accent: true },
    { label: "Quotations sent", value: o.statusDistribution.find((s) => s.status === "quotation_sent")?.count ?? 0, icon: ClipboardList },
  ];

  return (
    <>
      <PageTitle title="Overview" sub={o.isDemo ? "Illustrative sample data." : "Live data from your Supabase project."} />

      <div className="grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white p-5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium uppercase tracking-wider">{c.label}</span>
              <c.icon className={`size-4 ${c.accent ? "text-brand-red" : ""}`} aria-hidden />
            </div>
            <p className="mt-3 font-display text-4xl font-semibold tabular-nums text-navy">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <Panel title="Monthly enquiries" sub={o.isDemo ? "Demo data. Not real business performance." : "Last six months"} className="xl:col-span-3">
          {o.isDemo && <DemoBadge className="mb-3" />}
          <MonthlyChart data={o.monthly} />
        </Panel>
        <Panel title="Enquiry status" sub={o.isDemo ? "Distribution of sample enquiries" : "All enquiries by status"} className="xl:col-span-2">
          {o.totalEnquiries > 0 ? <StatusChart data={o.statusDistribution} /> : <p className="py-10 text-center text-sm text-muted-foreground">No enquiries yet.</p>}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <Panel title="Recent enquiries" className="xl:col-span-3">
          {o.recent.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No enquiries yet. Submissions from the website will appear here.</p>
          ) : (
            <ul className="-my-2 divide-y divide-line">
              {o.recent.map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/enquiries/${e.id}`} className="flex flex-wrap items-center justify-between gap-3 py-3.5 hover:bg-offwhite sm:px-2">
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-sm font-medium text-navy">{e.companyName}{e.isDemo && <DemoBadge />}</span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">{e.enquiryNumber} · {fmtDate(e.createdAt)} · {e.items.length} item{e.items.length === 1 ? "" : "s"}</span>
                    </span>
                    <StatusBadge status={e.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Products by category" className="xl:col-span-2">
          {o.categoryDistribution.length ? <CategoryChart data={o.categoryDistribution} /> : <p className="py-10 text-center text-sm text-muted-foreground">No products yet.</p>}
        </Panel>
      </div>
    </>
  );
}
