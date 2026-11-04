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

export const metadata: Metadata = {
  title: "Corporate Gifting",
  description:
    "Employee welcome kits, executive gifts, client appreciation, festive and event gifting, customized and branded for your organisation in Bahrain.",
  alternates: { canonical: "/corporate-gifting" },
};

export default async function GiftingPage() {
  const collections = await getCollections();
  const suggested = await Promise.all(collections.map((c) => getProductsBySlugs(c.suggestedProductSlugs)));

  return (
    <>
      <PageHero
        eyebrow="Corporate gifting"
        title="Gifts worth opening."
        intro="From employee onboarding to executive appreciation, we help you select, brand and present gifts that reflect well on your organisation."
        image="/images/hero/gift-exchange.jpg"
        imageAlt="Two hands exchanging a wrapped gift box"
      >
        <CtaLink href="/quote" variant="red">Start a Gifting Enquiry</CtaLink>
      </PageHero>

      <section className="container-x py-20 lg:py-28" aria-labelledby="occ-title">
        <SectionHeading eyebrow="Gifting for every audience" id="occ-title" title="Six ways to say thank you." />
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {giftingOccasions.map((g, i) => (
            <Reveal key={g.title} delay={(i % 6) * 0.05} distance={20}>
              <div className="group">
                <div className="img-zoom relative aspect-[4/5] overflow-hidden bg-offwhite">
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
              eyebrow="Gifting collections"
              id="col-title" title="Starting points for your brief."
              intro="Contents are configured around your brand, audience and budget."
            />
          </div>

          <div className="mt-14 space-y-20 lg:space-y-28">
            {collections.map((c, i) => (
              <Reveal key={c.id} distance={30}>
                <article id={c.slug} className="grid scroll-mt-28 items-center gap-8 lg:grid-cols-12 lg:gap-14">
                  <div className={`img-zoom relative aspect-[4/3] overflow-hidden bg-white lg:col-span-7 ${i % 2 ? "lg:order-2" : ""}`}>
                    <Image src={c.image} alt={c.title} fill sizes="(min-width:1024px) 58vw, 100vw" className="object-cover" />
                  </div>
                  <div className="lg:col-span-5">
                    <p className="eyebrow mb-3">Collection 0{i + 1}</p>
                    <h3 className="text-3xl font-semibold leading-tight sm:text-4xl">{c.title}</h3>
                    <p className="mt-2 font-display text-lg italic text-navy/70">{c.tagline}</p>
                    <p className="mt-5 text-base leading-relaxed text-charcoal/80">{c.description}</p>
                    <p className="mt-5 text-sm text-charcoal/80"><strong className="font-semibold text-navy">Suited to:</strong> {c.audience}</p>

                    <div className="mt-6 border-t border-line pt-5">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suggested products</p>
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
                    <div className="mt-7"><CtaLink href={`/quote?collection=${c.slug}`} variant="navy">Enquire about this collection</CtaLink></div>
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
            <p className="eyebrow mb-3">Local moments</p>
            <h2 className="text-3xl font-semibold leading-tight">Gifting around Bahrain&rsquo;s calendar.</h2>
          </div>
          <div className="md:col-span-7">
            <ul className="flex flex-wrap gap-3">
              {bahrainOccasions.map((o) => (<li key={o} className="border border-navy/25 px-5 py-2.5 text-base text-navy">{o}</li>))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">Whether it is Ramadan, Eid or Bahrain National Day, we plan gifting around your calendar, your audience and your brand.</p>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
