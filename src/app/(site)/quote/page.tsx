import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { QuoteForm } from "@/components/forms/quote-form";
import { getCollections, getProducts, getProductsBySlugs } from "@/lib/data";
import { getI18n } from "@/i18n/get-locale";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getI18n();
  return { title: m.meta.quote.title, description: m.meta.quote.description, alternates: { canonical: "/quote" } };
}

export default async function QuotePage({ searchParams }: PageProps<"/quote">) {
  const { m } = await getI18n();
  const sp = await searchParams;
  const productSlug = typeof sp.product === "string" ? sp.product : "";
  const collectionSlug = typeof sp.collection === "string" ? sp.collection : "";

  const [all, collections] = await Promise.all([getProducts(), getCollections()]);
  const collection = collections.find((c) => c.slug === collectionSlug);
  const slugs = [productSlug, ...(collection?.suggestedProductSlugs.slice(0, 2) ?? [])].filter(Boolean);
  const pre = await getProductsBySlugs(slugs);

  const toOption = (p: (typeof all)[number]) => ({ id: p.id, slug: p.slug, name: p.name, image: p.images[0] });

  return (
    <>
      <PageHero
        eyebrow={m.quote.eyebrow}
        title={m.quote.title}
        intro={m.quote.intro}
      />
      <section className="container-x py-12 lg:py-16">
        <QuoteForm catalogue={all.map(toOption)} preselect={pre.map(toOption)} />
      </section>
    </>
  );
}
