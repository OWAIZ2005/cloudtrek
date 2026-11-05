import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/page-hero";
import { CtaLink } from "@/components/shared/cta";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { FinalCta } from "@/components/home/final-cta";
import { bahrainOccasions, giftingOccasions } from "@/config/content";
import { getCollections, getProductsBySlugs } from "@/lib/data";
import { getI18n } from "@/i18n/get-locale";
import { localizeAll } from "@/i18n/localize";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getI18n();
  return { title: m.meta.gifting.title, description: m.meta.gifting.description, alternates: { canonical: "/corporate-gifting" } };
}

export default async function GiftingPage() {
  const { m, locale } = await getI18n();
  const collections = await getCollections();
  const occasions = localizeAll(giftingOccasions, locale);
  const moments = localizeAll(bahrainOccasions, locale);
  const suggested = await Promise.all(collections.map((c) => getProductsBySlugs(c.suggestedProductSlugs)));

  return (
    <>
      <PageHero
        eyebrow={m.gifting.eyebrow}
        title={m.gifting.title}
        intro={m.gifting.intro}
        image="/images/hero/gift-exchange.jpg"
        imageAlt={m.gifting.altHero}
      >
        <CtaLink href="/quote" variant="red">{m.gifting.cta}</CtaLink>
      </PageHero>

      <section className="container-x py-20 lg:py-28" aria-labelledby="occ-title">
        <SectionHeading eyebrow={m.gifting.occEyebrow} id="occ-title" title={m.gifting.occTitle} />
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {occasions.map((g, i) => (
            <Reveal key={g.image} delay={(i % 6) * 0.05} distance={20}>
              <div className="group">
                <div className="img-zoom img-fade relative aspect-[4/5] overflow-hidden bg-offwhite">
                  <Image src={g.image} alt={g.title} fill sizes="(min-width:1024px) 16vw, 33vw" className="object-cover" />
                </div>
                <h3 className="mt-3 text-sm font-semibold leading-snug">{g.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{g.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-offwhite py-20 lg:py-28" aria-labelledby="col-title">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionHeading
              eyebrow={m.gifting.colEyebrow}
              id="col-title" title={m.gifting.colTitle}
              intro={m.gifting.colIntro}
            />
          </div>

          <div className="mt-14 space-y-20 lg:space-y-28">
            {collections.map((c, i) => (
              <Reveal key={c.id} distance={30}>
                <article id={c.slug} className="grid scroll-mt-28 items-center gap-8 lg:grid-cols-12 lg:gap-14">
                  <div className={`img-zoom img-fade img-fade-soft relative aspect-[4/3] overflow-hidden bg-white lg:col-span-7 ${i % 2 ? "lg:order-2" : ""}`}>
                    <Image src={c.image} alt={c.title} fill sizes="(min-width:1024px) 58vw, 100vw" className="object-cover" />
                  </div>
                  <div className="lg:col-span-5">
                    <p className="eyebrow mb-3">{m.gifting.collection} 0{i + 1}</p>
                    <h3 className="text-3xl font-semibold leading-tight sm:text-4xl">{c.title}</h3>
                    <p className="mt-2 font-display text-lg italic text-navy/70">{c.tagline}</p>
                    <p className="mt-5 text-base leading-relaxed text-charcoal/80">{c.description}</p>
                    <p className="mt-5 text-sm text-charcoal/80"><strong className="font-semibold text-navy">{m.gifting.suited}</strong> {c.audience}</p>

                    <div className="mt-6 border-t border-line pt-5">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{m.gifting.suggested}</p>
                      <ul className="flex flex-wrap gap-3">
                        {suggested[i].map((p) => (
                          <li key={p.id}>
                            <Link href={`/products/${p.slug}`} className="group/p flex items-center gap-2.5 border border-line bg-white py-1.5 pe-3 ps-1.5 text-xs hover:border-navy">
                              <span className="relative size-9 overflow-hidden bg-offwhite"><Image src={p.images[0]} alt="" fill sizes="36px" className="object-cover" /></span>
                              <span className="max-w-[9rem] leading-tight text-navy group-hover/p:text-brand-red">{p.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-7"><CtaLink href={`/quote?collection=${c.slug}`} variant="navy">{m.gifting.enquire}</CtaLink></div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20 lg:py-24">
        <div className="grid gap-8 border-y border-line py-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <p className="eyebrow mb-3">{m.gifting.momentsEyebrow}</p>
            <h2 className="text-3xl font-semibold leading-tight">{m.gifting.momentsTitle}</h2>
          </div>
          <div className="md:col-span-7">
            <ul className="flex flex-wrap gap-3">
              {moments.map((o) => (<li key={o.key} className="border border-navy/25 px-5 py-2.5 text-base text-navy">{o.label}</li>))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">{m.gifting.momentsText}</p>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
