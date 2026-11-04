import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { CtaLink } from "@/components/shared/cta";
import { SectionHeading } from "@/components/shared/section-heading";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import { FocusHeading } from "@/components/shared/focus-heading";
import { ProductCard } from "@/components/products/product-card";
import { bahrainOccasions, divisions, giftingOccasions, processSteps, techniques, whyPoints } from "@/config/content";
import type { Category, PortfolioProject, Product } from "@/types";

/* ------------------------------ Divisions ------------------------------ */
export function Divisions() {
  return (
    <section className="container-x py-20 lg:py-28" aria-labelledby="divisions-title">
      <SectionHeading
        eyebrow="What we do"
        id="divisions-title" title="Three divisions. One brand-first partner."
        intro="From the objects people hold to the events they attend and the campaigns they see, Cloud Trek brings your brand to life across every touchpoint."
      />
      <div className="mt-14 grid gap-x-6 gap-y-12 md:grid-cols-3">
        {divisions.map((d, i) => (
          <Reveal key={d.slug} delay={i * 0.12}>
            <article className="group flex h-full flex-col">
              <Reveal wipe="up" distance={0} initialOpacity={1} duration={1.1}>
                <Link href={d.href} className="img-zoom img-fade relative block aspect-[4/5] overflow-hidden bg-offwhite" aria-label={d.title}>
                  <Image src={d.image} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
                  <span className="absolute start-4 top-4 bg-white px-2.5 py-1 text-[11px] font-semibold tracking-widest text-navy">0{i + 1}</span>
                </Link>
              </Reveal>
              <h3 className="mt-6 text-2xl font-semibold leading-tight">{d.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.short}</p>
              <ul className="mt-5 space-y-2 border-t border-line pt-5 text-sm text-charcoal/80">
                {d.points.map((pt) => (
                  <li key={pt} className="flex gap-2.5"><span className="mt-2 size-1 shrink-0 bg-brand-red" aria-hidden />{pt}</li>
                ))}
              </ul>
              <div className="mt-auto pt-7">
                <CtaLink href={d.href} variant="link">{d.cta}</CtaLink>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Categories ------------------------------ */
export function CategoryGrid({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  return (
    <section className="bg-offwhite/75 py-20 lg:py-28" aria-labelledby="cats-title">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Catalogue" id="cats-title" title="Explore product categories" />
          <Reveal><CtaLink href="/products" variant="link">View the full catalogue</CtaLink></Reveal>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {categories.slice(0, 8).map((c, i) => (
            <Reveal key={c.id} delay={(i % 4) * 0.07} distance={24} className={i === 0 ? "col-span-2 md:row-span-2" : ""}>
              <Link
                href={`/products?category=${c.slug}`}
                className={`img-zoom group relative block overflow-hidden bg-navy ${i === 0 ? "aspect-[4/3] md:aspect-auto md:h-full md:min-h-[520px]" : "aspect-[4/5]"}`}
              >
                <Image src={c.image} alt="" fill sizes={i === 0 ? "(min-width:768px) 50vw, 100vw" : "(min-width:768px) 25vw, 50vw"} className="object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-navy-deep/10 to-transparent" aria-hidden />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white sm:p-5">
                  <span className="min-w-0">
                    <span className="block font-display text-lg font-semibold leading-tight sm:text-xl">{c.name}</span>
                    <span className="mt-1 block text-xs text-white/75">{counts[c.slug] ?? 0} {(counts[c.slug] ?? 0) === 1 ? "product" : "products"}</span>
                    <span className="mt-1 line-clamp-1 hidden text-xs text-white/70 sm:block">{c.description}</span>
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
          <Reveal delay={0.1} distance={24}>
            <Link
              href="/quote"
              className="group relative flex aspect-[4/5] h-full flex-col justify-between overflow-hidden bg-navy p-5 text-white transition-colors duration-300 hover:bg-navy-deep sm:p-6"
            >
              <span className="eyebrow !text-white/60">Custom requests</span>
              <span>
                <span className="block font-display text-xl font-semibold leading-tight sm:text-2xl">Something specific in mind?</span>
                <span className="mt-2 block text-sm leading-relaxed text-white/70">
                  Tell us what you need and we will source, brand and quote it.
                </span>
                <span className="mt-5 inline-flex items-center gap-2 border-b border-brand-red pb-1 text-sm font-medium">
                  Request a custom quote
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" aria-hidden />
                </span>
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Featured ------------------------------ */
export function FeaturedProducts({ products, categories }: { products: Product[]; categories: Category[] }) {
  const name = (slug: string) => categories.find((c) => c.slug === slug)?.name;
  return (
    <section className="container-x py-20 lg:py-28" aria-labelledby="featured-title">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          eyebrow="Featured"
          id="featured-title" title="A curated selection"
          intro="Quotation-based pricing, tailored to your quantities and branding."
        />
        <Reveal><CtaLink href="/products" variant="outline">Browse all products</CtaLink></Reveal>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-x-5 gap-y-12 min-[480px]:grid-cols-2 lg:grid-cols-4">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 0.08} distance={24}>
            <ProductCard product={p} categoryName={name(p.categorySlug)} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Gifting ------------------------------ */
export function GiftingSection() {
  return (
    <section className="bg-offwhite/75 py-20 lg:py-28" aria-labelledby="gifting-title">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Corporate gifting"
              id="gifting-title" title="Gifts that say the right thing, quietly."
              intro="Whether it is a first-day kit or an executive thank-you, we help you choose, brand and present gifts with the care your relationships deserve."
            />
            <Reveal delay={0.15}>
              <div className="mt-8 border-t border-line pt-6">
                <p className="eyebrow mb-3">Moments that matter in Bahrain</p>
                <ul className="flex flex-wrap gap-2">
                  {bahrainOccasions.map((o) => (
                    <li key={o} className="border border-navy/20 bg-white px-3.5 py-1.5 text-sm text-navy">{o}</li>
                  ))}
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Plan ahead with us: seasonal gifts selected, branded and packed for your recipient list.</p>
              </div>
              <div className="mt-8"><CtaLink href="/corporate-gifting" variant="red">Explore Gifting Solutions</CtaLink></div>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-7 lg:gap-4">
            {giftingOccasions.map((g, i) => (
              <Reveal key={g.title} delay={(i % 3) * 0.08} distance={24} className={i % 4 === 1 ? "sm:mt-10" : ""}>
                <Link href="/corporate-gifting" className="group block">
                  <div className="img-zoom img-fade relative aspect-[4/5] overflow-hidden bg-white">
                    <Image src={g.image} alt={g.title} fill sizes="(min-width:1024px) 20vw, 33vw" className="object-cover" />
                  </div>
                  <h3 className="mt-3 text-base font-semibold leading-snug group-hover:text-brand-red">{g.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{g.text}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Customization ------------------------------ */
export function CustomizationSection() {
  return (
    <section className="container-x py-20 lg:py-28" aria-labelledby="custom-title">
      <div>
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">Customization &amp; branding</p>
            <FocusHeading id="custom-title" text="Your Brand. Your Identity. Our Craft." className="display-2" />
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Every product can carry your identity. Share your logo and brief, and we recommend the technique that suits the material and the quantity.
            </p>
          </div>
        </Reveal>
      </div>
      <div className="mt-12 grid gap-px bg-line md:grid-cols-2 lg:grid-cols-3">
        {techniques.map((t, i) => (
          <Reveal key={t.name} delay={(i % 3) * 0.08} distance={20}>
            <div className="group flex h-full gap-5 bg-white p-5 sm:p-6">
              <div className="img-zoom relative size-24 shrink-0 overflow-hidden bg-offwhite sm:size-28">
                <Image src={t.image} alt={`${t.name} close-up`} fill sizes="112px" className="object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[11px] font-semibold tracking-widest text-brand-red">0{i + 1}</span>
                <h3 className="mt-1 text-lg font-semibold leading-snug">{t.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Process ------------------------------ */
export function ProcessSection() {
  return (
    <section className="bg-navy py-20 text-white lg:py-28" aria-labelledby="process-title">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow mb-4 !text-white/60">How it works</p>
          <h2 id="process-title" className="display-2 max-w-3xl !text-white">From first idea to doorstep, in five clear steps.</h2>
        </Reveal>
        <div role="list" className="mt-14 grid gap-10 md:grid-cols-5 md:gap-6">
          {processSteps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12} distance={26}>
              <div role="listitem" className="relative border-t border-white/25 pt-6">
                <span className="absolute -top-px start-0 h-px w-10 bg-brand-red" aria-hidden />
                <span className="font-display text-4xl font-semibold text-white/90">0{i + 1}</span>
                <h3 className="mt-5 text-lg font-semibold leading-snug !text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Why ------------------------------ */
export function WhySection() {
  return (
    <section className="container-x py-20 lg:py-28" aria-labelledby="why-title">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow="Why Cloud Trek?" id="why-title" title="A partner built around your brief." />
        </div>
        <div role="list" className="grid gap-x-10 gap-y-0 sm:grid-cols-2 lg:col-span-8">
          {whyPoints.map((w, i) => (
            <Reveal key={w.title} delay={(i % 2) * 0.1} distance={20}>
              <SpotlightCard role="listitem" theme="light" spotlightColor="#c43b43" intensity={0.12} style={{ borderRadius: 2 }} className="mb-5 h-[calc(100%-1.25rem)] p-6 sm:p-7">
                <span className="text-xs font-semibold text-brand-red">0{i + 1}</span>
                <h3 className="mt-2 text-xl font-semibold leading-snug">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.text}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Selected work ------------------------------ */
export function WorkSection({ projects }: { projects: PortfolioProject[] }) {
  return (
    <section className="bg-offwhite/75 py-20 lg:py-28" aria-labelledby="work-title">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Selected work"
            id="work-title" title="Project concepts"
            intro="A selection of project work, from welcome kits to conference merchandise and recognition awards."
          />
          <Reveal><CtaLink href="/our-work" variant="outline">View all work</CtaLink></Reveal>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-6">
          {projects.slice(0, 5).map((p, i) => {
            const span = i === 0 ? "md:col-span-4 md:row-span-2" : i === 1 || i === 2 ? "md:col-span-2" : "md:col-span-3";
            return (
              <Reveal key={p.id} delay={(i % 3) * 0.08} distance={24} className={span}>
                <Link href={`/our-work#${p.slug}`} className={`img-zoom group relative block aspect-[4/3] overflow-hidden bg-navy ${i === 0 ? "md:aspect-auto md:h-full" : ""}`}>
                  <Image src={p.images[0]} alt={p.title} fill sizes={i === 0 ? "(min-width:768px) 66vw, 100vw" : "(min-width:768px) 33vw, 100vw"} className="object-cover" />
                  <span className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-transparent to-transparent" aria-hidden />
                  <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">{p.category}</span>
                    <span className="mt-1 block font-display text-xl font-semibold leading-snug">{p.title}</span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Positioning ------------------------------ */
/** Shown instead of testimonials until verified testimonials / client logos exist. */
export function PositioningSection() {
  const caps = [
    { t: "Promotional products", d: "Selection, sourcing and branding of merchandise across categories." },
    { t: "Corporate gifting", d: "Gift sets, kits and hampers designed around occasions and audiences." },
    { t: "Events & advertising", d: "Support for events, publicity and campaigns that need physical presence." },
  ];
  return (
    <section className="container-x py-20 lg:py-28" aria-labelledby="pos-title">
      <div className="grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <p className="eyebrow mb-4">Our positioning</p>
          <h2 id="pos-title" className="sr-only">Our positioning</h2>
          <ScrollReveal mode="scrub" baseOpacity={0.12} enableBlur blurStrength={3} baseRotation={0} containerClassName="m-0" textClassName="display-2 !text-[clamp(1.9rem,3.8vw,3.25rem)]">
            We help businesses be remembered, through the things people keep, the events they attend and the campaigns they see.
          </ScrollReveal>
        </Reveal>
        <div className="lg:col-span-5">
          {caps.map((c, i) => (
            <Reveal key={c.t} delay={i * 0.1} distance={18}>
              <div className="border-t border-line py-6">
                <h3 className="text-lg font-semibold">{c.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
