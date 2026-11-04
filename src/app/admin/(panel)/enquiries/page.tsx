import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { adminEnquiries } from "@/lib/admin/data";
import { DemoBadge, fmtDate, PageTitle, StatusBadge } from "@/components/admin/ui";
import { ENQUIRY_STATUSES, ENQUIRY_STATUS_LABELS, type EnquiryStatus } from "@/types";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata = { title: "Enquiries" };

export default async function EnquiriesPage({ searchParams }: PageProps<"/admin/enquiries">) {
  const sp = await searchParams;
  const filter = typeof sp.status === "string" && (ENQUIRY_STATUSES as readonly string[]).includes(sp.status) ? (sp.status as EnquiryStatus) : null;
  const ctx = await requireAdmin();
  const all = await adminEnquiries(ctx);
  const rows = filter ? all.filter((e) => e.status === filter) : all;

  const tab = (active: boolean) => cn("shrink-0 border px-3.5 py-1.5 text-xs font-medium", active ? "border-navy bg-navy text-white" : "border-line bg-white text-charcoal/80 hover:border-navy");

  return (
    <>
      <PageTitle title="Enquiries" sub={`${all.length} total · demo records are labelled and never mixed with real submissions without a badge.`} />
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        <Link href="/admin/enquiries" className={tab(!filter)}>All ({all.length})</Link>
        {ENQUIRY_STATUSES.map((s) => (
          <Link key={s} href={`/admin/enquiries?status=${s}`} className={tab(filter === s)}>{ENQUIRY_STATUS_LABELS[s]} ({all.filter((e) => e.status === s).length})</Link>
        ))}
      </div>

      <div className="overflow-x-auto border border-line bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead><TableHead>Company</TableHead><TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead className="hidden sm:table-cell">Items</TableHead><TableHead className="hidden lg:table-cell">Received</TableHead><TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (<TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No enquiries in this status.</TableCell></TableRow>)}
            {rows.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium"><Link href={`/admin/enquiries/${e.id}`} className="text-navy hover:text-brand-red">{e.enquiryNumber}</Link> {e.isDemo && <DemoBadge className="ms-1" />}</TableCell>
                <TableCell>{e.companyName}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{e.customerName}</TableCell>
                <TableCell className="hidden sm:table-cell">{e.items.length}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">{fmtDate(e.createdAt)}</TableCell>
                <TableCell><StatusBadge status={e.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
