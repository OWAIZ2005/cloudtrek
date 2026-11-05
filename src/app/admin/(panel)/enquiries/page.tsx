import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { adminEnquiries } from "@/lib/admin/data";
import { adminInput, DemoBadge, EmailBadge, fmtDate, PageTitle, StatusBadge } from "@/components/admin/ui";
import { ENQUIRY_STATUSES, ENQUIRY_STATUS_LABELS, type EnquiryStatus } from "@/types";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata = { title: "Enquiries" };

export default async function EnquiriesPage({ searchParams }: PageProps<"/admin/enquiries">) {
  const sp = await searchParams;
  const filter = typeof sp.status === "string" && (ENQUIRY_STATUSES as readonly string[]).includes(sp.status) ? (sp.status as EnquiryStatus) : null;
  const q = typeof sp.q === "string" ? sp.q.trim().toLowerCase() : "";
  const emailFail = sp.email === "failed";
  const ctx = await requireAdmin();
  const all = await adminEnquiries(ctx);
  const rows = all.filter((e) => {
    if (filter && e.status !== filter) return false;
    if (emailFail && e.emailStatus !== "failed") return false;
    if (!q) return true;
    return [e.enquiryNumber, e.customerName, e.companyName, e.email, e.phone, ...e.items.map((i) => i.productName)].join(" ").toLowerCase().includes(q);
  });
  const qs = (extra: Record<string, string>) => `/admin/enquiries?${new URLSearchParams({ ...(q ? { q } : {}), ...extra }).toString()}`;

  const tab = (active: boolean) => cn("shrink-0 border px-3.5 py-1.5 text-xs font-medium", active ? "border-navy bg-navy text-white" : "border-line bg-white text-charcoal/80 hover:border-navy");

  return (
    <>
      <PageTitle title="Enquiries" sub={`${all.length} total · demo records are labelled and never mixed with real submissions without a badge.`} />
      <form className="mb-4 flex max-w-md gap-2" role="search">
        <label htmlFor="q" className="sr-only">Search enquiries</label>
        <input id="q" name="q" defaultValue={q} placeholder="Search reference, name, company, product…" className={adminInput} />
        {filter && <input type="hidden" name="status" value={filter} />}
        <button className="h-10 border border-navy px-4 text-sm font-medium text-navy hover:bg-navy hover:text-white">Search</button>
      </form>
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        <Link href={qs({})} className={tab(!filter && !emailFail)}>All ({all.length})</Link>
        {ENQUIRY_STATUSES.map((s) => (
          <Link key={s} href={qs({ status: s })} className={tab(filter === s)}>{ENQUIRY_STATUS_LABELS[s]} ({all.filter((e) => e.status === s).length})</Link>
        ))}
        <Link href={qs({ email: "failed" })} className={tab(emailFail)}>Email failed ({all.filter((e) => e.emailStatus === "failed").length})</Link>
      </div>

      <div className="overflow-x-auto border border-line bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead><TableHead>Company</TableHead><TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead className="hidden sm:table-cell">Items</TableHead><TableHead className="hidden lg:table-cell">Received</TableHead><TableHead>Status</TableHead><TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (<TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">No enquiries in this status.</TableCell></TableRow>)}
            {rows.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium"><Link href={`/admin/enquiries/${e.id}`} className="text-navy hover:text-brand-red">{e.enquiryNumber}</Link> {e.isDemo && <DemoBadge className="ms-1" />}</TableCell>
                <TableCell>{e.companyName}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{e.customerName}</TableCell>
                <TableCell className="hidden sm:table-cell">{e.items.length}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">{fmtDate(e.createdAt)}</TableCell>
                <TableCell><StatusBadge status={e.status} /></TableCell>
                <TableCell><EmailBadge status={e.emailStatus} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
