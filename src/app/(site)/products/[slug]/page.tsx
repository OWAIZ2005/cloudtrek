import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { ProductGallery } from "@/components/products/gallery";
import { ProductCard } from "@/components/products/product-card";
import { AddToQuoteButton } from "@/components/quote/add-to-quote";
import { CtaLink } from "@/components/shared/cta";
import { Reveal } from "@/components/shared/reveal";
import { getCategories, getProductBySlug, getRelatedProducts } from "@/lib/data";
import { siteConfig } from "@/config/site";

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { title: product.name, description: product.shortDescription, images: [{ url: product.images[0] }] },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [categories, related] = await Promise.all([getCategories(), getRelatedProducts(product, 4)]);
  const category = categories.find((c) => c.slug === product.categorySlug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((i) => (i.startsWith("http") ? i : `${siteConfig.url}${i}`)),
    category: category?.name,
    brand: { "@type": "Brand", name: "Cloud Trek" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-x pt-6">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-navy">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/products" className="hover:text-navy">Products</Link></li>
            {category && (<><li aria-hidden>/</li><li><Link href={`/products?category=${category.slug}`} className="hover:text-navy">{category.name}</Link></li></>)}
          </ol>
        </nav>
      </div>

      <section className="container-x grid gap-10 py-8 lg:grid-cols-2 lg:gap-16 lg:py-12">
        <Reveal distance={20}><ProductGallery images={product.images} name={product.name} /></Reveal>

        <div className="lg:py-4">
          <p className="eyebrow mb-4">{category?.name}</p>
          <h1 className="text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.05] tracking-tight">{product.name}</h1>
          <p className="mt-4 text-sm text-muted-foreground">Branded with your identity and prepared to your brief, from first sample to delivery in Bahrain.</p>
          <p className="mt-6 text-base leading-relaxed text-charcoal/80">{product.description}</p>

          <dl className="mt-8 grid grid-cols-2 gap-px border border-line bg-line text-sm">
            <div className="bg-white p-4">
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Pricing</dt>
              <dd className="mt-1 font-medium text-navy">Quotation-based</dd>
            </div>
            <div className="bg-white p-4">
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Minimum order</dt>
              <dd className="mt-1 font-medium text-navy">
                {product.moq ? `${product.moq} units` : "On request"}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaLink href={`/quote?product=${product.slug}`} variant="red" className="sm:flex-1">Request a Quote</CtaLink>
            <AddToQuoteButton product={product} className="sm:flex-1" />
          </div>

          {product.customizationOptions.length > 0 && (
            <div className="mt-10 border-t border-line pt-8">
              <h2 className="text-lg font-semibold">Customization options</h2>
              <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {product.customizationOptions.map((o) => (
                  <li key={o} className="flex items-start gap-2.5 text-sm text-charcoal/85">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-red" aria-hidden />{o}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.specifications.length > 0 && (
            <div className="mt-10 border-t border-line pt-8">
              <h2 className="text-lg font-semibold">Specifications</h2>
              <dl className="mt-4 divide-y divide-line text-sm">
                {product.specifications.map((s) => (
                  <div key={s.label} className="grid grid-cols-3 gap-4 py-3">
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="col-span-2 text-charcoal">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </section>

      <section className="bg-offwhite py-16 lg:py-24" aria-labelledby="related-title">
        <div className="container-x">
          <h2 id="related-title" className="display-2 !text-[clamp(1.75rem,3vw,2.5rem)]">You may also like</h2>
          <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-12 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} categoryName={categories.find((c) => c.slug === p.categorySlug)?.name} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
