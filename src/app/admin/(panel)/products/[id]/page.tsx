import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { adminCategories, adminProduct } from "@/lib/admin/data";
import { PageTitle, Panel } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/entity-form";

export const metadata = { title: "Edit product" };

export default async function ProductEditPage({ params }: PageProps<"/admin/products/[id]">) {
  const [{ id }, ctx] = await Promise.all([params, requireAdmin()]);
  const isNew = id === "new";
  if (isNew && ctx.mode === "demo") notFound();
  const [product, categories] = await Promise.all([isNew ? null : adminProduct(ctx, id), adminCategories(ctx)]);
  if (!isNew && !product) notFound();
  // In live mode the form needs real category ids; in demo it is read-only anyway.
  return (
    <>
      <PageTitle title={isNew ? "Add product" : product!.name} />
      <Panel><ProductForm product={product} categories={categories} readOnly={ctx.mode === "demo"} /></Panel>
    </>
  );
}
