import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { FeaturedProductCard, ProductCard } from "@/components/products/product-card";
import { ProductFilters } from "@/components/products/product-filters";
import { getI18n } from "@/i18n/get-locale";
import { SORT_OPTIONS, type SortValue } from "@/lib/catalogue";
import { ResultCount } from "@/components/products/result-count";
import { CtaLink } from "@/components/shared/cta";
import { getCategories, getCategoryCounts, getProducts } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getI18n();
  return { title: m.meta.products.title, description: m.meta.products.description, alternates: { canonical: "/products" } };
}

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const { m } = await getI18n();
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
        eyebrow={m.products.eyebrow}
        title={activeCategory ? activeCategory.name : m.products.title}
        intro={activeCategory?.description ?? m.products.intro}
      >
        <p className="max-w-xl text-sm text-charcoal/70">{m.products.brandLine}</p>
      </PageHero>

      <section className="container-x pb-10">
        <ProductFilters categories={categories} counts={counts} total={all.length} q={q} category={category} sort={sort} />

        {featured.length > 0 && (
          <div className="pt-10" aria-labelledby="featured-band">
            <h2 id="featured-band" className="eyebrow mb-5">{m.products.featuredSelection}</h2>
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
            <ResultCount value={products.length} /> {m.products.count(products.length)}
            {q && <> {m.products.matching} “{q}”</>}
            {featured.length > 0 && <span> · {m.products.moreBelow(gridProducts.length)}</span>}
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
            <h2 className="mt-5 text-2xl font-semibold">{m.products.emptyTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {m.products.emptyText}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/products" className="border border-navy/30 px-5 py-3 text-sm font-medium text-navy hover:bg-navy hover:text-white">{m.products.clear}</Link>
              <CtaLink href="/quote" variant="red">{m.products.customQuote}</CtaLink>
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
