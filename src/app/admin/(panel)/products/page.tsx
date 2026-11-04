import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { adminCategories, adminProducts } from "@/lib/admin/data";
import { deleteProduct, toggleProduct } from "@/app/admin/actions";
import { DemoBadge, ghostBtn, Notice, PageTitle, primaryBtn } from "@/components/admin/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata = { title: "Products" };

export default async function ProductsAdminPage({ searchParams }: PageProps<"/admin/products">) {
  const [sp, ctx] = await Promise.all([searchParams, requireAdmin()]);
  const [products, categories] = await Promise.all([adminProducts(ctx), adminCategories(ctx)]);
  const demo = ctx.mode === "demo";
  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? "—";

  return (
    <>
      <PageTitle
        title="Products"
        sub={`${products.length} products`}
        action={demo ? <span className={`${primaryBtn} opacity-50`} aria-disabled>Add product</span> : <Link href="/admin/products/new" className={primaryBtn}><Plus className="size-4" aria-hidden /> Add product</Link>}
      />
      {sp.saved && <Notice kind="ok">Product saved.</Notice>}
      {sp.deleted && <Notice kind="ok">Product deleted.</Notice>}

      <div className="overflow-x-auto border border-line bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead><TableHead>Name</TableHead><TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden sm:table-cell">Featured</TableHead><TableHead>Status</TableHead><TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell><div className="relative size-12 overflow-hidden bg-offwhite"><Image src={p.images[0]} alt="" fill sizes="48px" className="object-cover" /></div></TableCell>
                <TableCell className="font-medium text-navy">{p.name} {p.isDemo && <DemoBadge className="ms-1" />}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{catName(p.categorySlug)}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <form action={toggleProduct}>
                    <input type="hidden" name="id" value={p.id} /><input type="hidden" name="field" value="is_featured" /><input type="hidden" name="value" value={String(!p.isFeatured)} />
                    <button disabled={demo} className={`text-xs font-medium ${p.isFeatured ? "text-brand-red" : "text-muted-foreground"} hover:underline disabled:no-underline`}>{p.isFeatured ? "★ Featured" : "Set featured"}</button>
                  </form>
                </TableCell>
                <TableCell>
                  <form action={toggleProduct}>
                    <input type="hidden" name="id" value={p.id} /><input type="hidden" name="field" value="is_active" /><input type="hidden" name="value" value={String(!p.isActive)} />
                    <button disabled={demo} className={`text-xs font-medium ${p.isActive ? "text-navy" : "text-muted-foreground"} hover:underline disabled:no-underline`}>{p.isActive ? "Active" : "Disabled"}</button>
                  </form>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/products/${p.id}`} className={`${ghostBtn} !h-8 !px-3 text-xs`}>{demo ? "View" : "Edit"}</Link>
                    {!demo && (
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className="h-8 px-3 text-xs font-medium text-brand-red hover:underline" aria-label={`Delete ${p.name}`}>Delete</button>
                      </form>
                    )}
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
