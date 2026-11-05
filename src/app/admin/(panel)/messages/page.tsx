import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { adminMessages } from "@/lib/admin/data";
import { DemoBadge, EmailBadge, fmtDate, PageTitle } from "@/components/admin/ui";
import { adminInput } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata = { title: "Messages" };

export default async function MessagesPage({ searchParams }: PageProps<"/admin/messages">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().toLowerCase() : "";
  const f = typeof sp.f === "string" ? sp.f : "";
  const ctx = await requireAdmin();
  const all = await adminMessages(ctx);

  const rows = all.filter((m) => {
    if (f === "new" && m.status !== "new") return false;
    if (f === "failed" && m.emailStatus !== "failed") return false;
    if (!q) return true;
    return [m.customerName, m.email, m.companyName, m.subject, m.message, m.referenceNumber].join(" ").toLowerCase().includes(q);
  });
  const tab = (active: boolean) => cn("shrink-0 border px-3.5 py-1.5 text-xs font-medium", active ? "border-navy bg-navy text-white" : "border-line bg-white text-charcoal/80 hover:border-navy");
  const href = (nf: string) => `/admin/messages?${new URLSearchParams({ ...(q ? { q } : {}), ...(nf ? { f: nf } : {}) }).toString()}`;

  return (
    <>
      <PageTitle title="Contact messages" sub={`${all.length} total · ${all.filter((m) => m.status === "new").length} new`} />
      <form className="mb-4 flex max-w-md gap-2" role="search">
        <label htmlFor="q" className="sr-only">Search messages</label>
        <input id="q" name="q" defaultValue={q} placeholder="Search name, email, company, message…" className={adminInput} />
        {f && <input type="hidden" name="f" value={f} />}
        <button className="h-10 border border-navy px-4 text-sm font-medium text-navy hover:bg-navy hover:text-white">Search</button>
      </form>
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        <Link href={href("")} className={tab(!f)}>All</Link>
        <Link href={href("new")} className={tab(f === "new")}>New</Link>
        <Link href={href("failed")} className={tab(f === "failed")}>Email failed ({all.filter((m) => m.emailStatus === "failed").length})</Link>
      </div>

      <div className="overflow-x-auto border border-line bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead><TableHead>From</TableHead><TableHead className="hidden md:table-cell">Subject</TableHead>
              <TableHead className="hidden lg:table-cell">Received</TableHead><TableHead>Status</TableHead><TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (<TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No messages found.</TableCell></TableRow>)}
            {rows.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium"><Link href={`/admin/messages/${m.id}`} className="text-navy hover:text-brand-red">{m.referenceNumber}</Link> {m.isDemo && <DemoBadge className="ms-1" />}</TableCell>
                <TableCell>{m.customerName}<span className="block text-xs text-muted-foreground">{m.email}</span></TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{m.subject || "—"}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">{fmtDate(m.createdAt)}</TableCell>
                <TableCell className="text-xs font-medium">{m.status === "new" ? <span className="text-brand-red">New</span> : <span className="text-muted-foreground">Handled</span>}</TableCell>
                <TableCell><EmailBadge status={m.emailStatus} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
