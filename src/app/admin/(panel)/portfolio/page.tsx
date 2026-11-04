import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { adminProjects } from "@/lib/admin/data";
import { deleteProject } from "@/app/admin/actions";
import { DemoBadge, ghostBtn, Notice, PageTitle, primaryBtn } from "@/components/admin/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata = { title: "Portfolio" };

export default async function PortfolioAdminPage({ searchParams }: PageProps<"/admin/portfolio">) {
  const [sp, ctx] = await Promise.all([searchParams, requireAdmin()]);
  const projects = await adminProjects(ctx);
  const demo = ctx.mode === "demo";
  return (
    <>
      <PageTitle title="Portfolio" sub={`${projects.length} projects`} action={demo ? <span className={`${primaryBtn} opacity-50`} aria-disabled>Add project</span> : <Link href="/admin/portfolio/new" className={primaryBtn}><Plus className="size-4" aria-hidden /> Add project</Link>} />
      {sp.saved && <Notice kind="ok">Project saved.</Notice>}
      {sp.deleted && <Notice kind="ok">Project deleted.</Notice>}
      <div className="overflow-x-auto border border-line bg-white">
        <Table>
          <TableHeader><TableRow><TableHead className="w-16">Image</TableHead><TableHead>Title</TableHead><TableHead className="hidden md:table-cell">Category</TableHead><TableHead className="text-end">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {projects.map((p) => (
              <TableRow key={p.id}>
                <TableCell><div className="relative size-12 overflow-hidden bg-offwhite"><Image src={p.images[0]} alt="" fill sizes="48px" className="object-cover" /></div></TableCell>
                <TableCell className="font-medium text-navy">{p.title} {p.isDemo && <DemoBadge className="ms-1" />}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{p.category}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/portfolio/${p.id}`} className={`${ghostBtn} !h-8 !px-3 text-xs`}>{demo ? "View" : "Edit"}</Link>
                    {!demo && (<form action={deleteProject}><input type="hidden" name="id" value={p.id} /><button className="h-8 px-3 text-xs font-medium text-brand-red hover:underline">Delete</button></form>)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
