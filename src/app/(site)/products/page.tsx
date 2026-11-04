import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { FeaturedProductCard, ProductCard } from "@/components/products/product-card";
import { ProductFilters } from "@/components/products/product-filters";
import { SORT_OPTIONS, type SortValue } from "@/lib/catalogue";
import { ResultCount } from "@/components/products/result-count";
import { CtaLink } from "@/components/shared/cta";
import { getCategories, getCategoryCounts, getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse corporate stationery, tech, drinkware, bags, apparel, gift sets and awards. Customizable promotional products with quotation-based pricing.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const category = typeof sp.category === "string" ? sp.category : "";
  const sort: SortValue = SORT_OPTIONS.some((o) => o.value === sp.sort) ? (sp.sort as SortValue) : "featured";

  const [categories, counts, found, all] = await Promise.all([
    getCategories(),
    getCategoryCounts(),
    getProducts({ q, category }),
    getProducts()
  ]);

  const products = [...found].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "moq") return (a.moq ?? Infinity) - (b.moq ?? Infinity);
    return Number(b.isFeatured) - Number(a.isFeatured);
  });

  const activeCategory = categories.find((c) => c.slug === category);
  const nameOf = (slug: string) => categories.find((c) => c.slug === slug)?.name;
  const filtering = Boolean(q || category);
  const featured = !filtering ? all.filter((p) => p.isFeatured).slice(0, 3) : [];
  // When the featured band is shown, the grid lists everything else (no duplicates).
  const gridProducts = featured.length ? products.filter((p) => !featured.some((f) => f.id === p.id)) : products;

  return (
    <>
      <PageHero
        eyebrow="Catalogue"
        title={activeCategory ? activeCategory.name : "Promotional products, curated."}
        intro={activeCategory?.description ?? "Customizable products for corporate gifting, events and everyday brand visibility. Pricing is quotation-based, tailored to your quantities and branding."}
      >
        <p className="max-w-xl text-sm text-charcoal/70">Every product can be branded with your logo. Share your quantities and artwork, and we respond with a clear quotation.</p>
      </PageHero>

      <section className="container-x pb-10">
        <ProductFilters categories={categories} counts={counts} total={all.length} q={q} category={category} sort={sort} />

        {featured.length > 0 && (
          <div className="pt-10" aria-labelledby="featured-band">
            <h2 id="featured-band" className="eyebrow mb-5">Featured selection</h2>
            <div className="grid gap-5 lg:grid-cols-3">
              {featured.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.1} distance={24} className="h-full">
                  <FeaturedProductCard product={p} categoryName={nameOf(p.categorySlug)} />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 flex items-center justify-between border-b border-line pb-4 text-sm text-muted-foreground" aria-live="polite">
          <p>
            <ResultCount value={products.length} /> {products.length === 1 ? "product" : "products"}
            {q && <> matching &ldquo;{q}&rdquo;</>}
            {featured.length > 0 && <span> · {gridProducts.length} more below</span>}
          </p>
        </div>

        {gridProducts.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {gridProducts.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.06} distance={22} className="h-full">
                <ProductCard product={p} categoryName={nameOf(p.categorySlug)} priority={i < 4} />
              </Reveal>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="mx-auto mt-16 max-w-md py-12 text-center">
            <SearchX className="mx-auto size-10 text-navy/40" aria-hidden />
            <h2 className="mt-5 text-2xl font-semibold">No products match your search</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Try a broader term or clear the filters. If you are looking for something specific, we can source it for you.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/products" className="border border-navy/30 px-5 py-3 text-sm font-medium text-navy hover:bg-navy hover:text-white">Clear filters</Link>
              <CtaLink href="/quote" variant="red">Request a custom quote</CtaLink>
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
