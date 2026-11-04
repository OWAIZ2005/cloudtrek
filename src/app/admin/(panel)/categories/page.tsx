import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { adminCategories, adminProducts } from "@/lib/admin/data";
import { deleteCategory } from "@/app/admin/actions";
import { DemoBadge, ghostBtn, Notice, PageTitle, Panel } from "@/components/admin/ui";
import { CategoryForm } from "@/components/admin/entity-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata = { title: "Categories" };

export default async function CategoriesAdminPage({ searchParams }: PageProps<"/admin/categories">) {
  const [sp, ctx] = await Promise.all([searchParams, requireAdmin()]);
  const [categories, products] = await Promise.all([adminCategories(ctx), adminProducts(ctx)]);
  const demo = ctx.mode === "demo";
  const editId = typeof sp.edit === "string" ? sp.edit : "";
  const editing = categories.find((c) => c.id === editId) ?? null;

  return (
    <>
      <PageTitle title="Categories" sub={`${categories.length} categories`} />
      {sp.saved && <Notice kind="ok">Category saved.</Notice>}
      {sp.deleted && <Notice kind="ok">Category deleted.</Notice>}
      {typeof sp.error === "string" && <Notice kind="error">{sp.error}</Notice>}

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="overflow-x-auto border border-line bg-white xl:col-span-3">
          <Table>
            <TableHeader><TableRow><TableHead className="w-16">Image</TableHead><TableHead>Name</TableHead><TableHead>Products</TableHead><TableHead className="text-end">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {categories.map((c) => {
                const count = products.filter((p) => p.categorySlug === c.slug).length;
                return (
                  <TableRow key={c.id}>
                    <TableCell><div className="relative size-12 overflow-hidden bg-offwhite"><Image src={c.image} alt="" fill sizes="48px" className="object-cover" /></div></TableCell>
                    <TableCell className="font-medium text-navy">{c.name} {c.isDemo && <DemoBadge className="ms-1" />}{!c.isActive && <span className="ms-2 text-xs text-muted-foreground">(inactive)</span>}</TableCell>
                    <TableCell>{count}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        {!demo && <Link href={`/admin/categories?edit=${c.id}`} className={`${ghostBtn} !h-8 !px-3 text-xs`}>Edit</Link>}
                        {!demo && (
                          <form action={deleteCategory}>
                            <input type="hidden" name="id" value={c.id} />
                            <button disabled={count > 0} title={count > 0 ? "Remove or reassign its products first" : undefined} className="h-8 px-3 text-xs font-medium text-brand-red hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline">Delete</button>
                          </form>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <Panel title={editing ? `Edit “${editing.name}”` : "Add category"} className="xl:col-span-2">
          <CategoryForm key={editing?.id ?? "new"} category={editing} readOnly={demo} />
        </Panel>
      </div>
    </>
  );
}
