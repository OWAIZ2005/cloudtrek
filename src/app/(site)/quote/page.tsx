import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { QuoteForm } from "@/components/forms/quote-form";
import { getCollections, getProducts, getProductsBySlugs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: "Build an enquiry list, share your customization requirements and receive a quotation from Cloud Trek.",
  alternates: { canonical: "/quote" },
};

export default async function QuotePage({ searchParams }: PageProps<"/quote">) {
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
        eyebrow="Request a quote"
        title="Tell us what you need."
        intro="Build your enquiry list, add your customization requirements and send it through. Pricing is quotation-based and tailored to your quantities and branding."
      />
      <section className="container-x py-12 lg:py-16">
        <QuoteForm catalogue={all.map(toOption)} preselect={pre.map(toOption)} />
      </section>
    </>
  );
}
