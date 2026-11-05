import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/page-hero";
import { CtaLink } from "@/components/shared/cta";
import { Reveal } from "@/components/shared/reveal";
import { FinalCta } from "@/components/home/final-cta";
import { ProcessSection } from "@/components/home/sections";
import { services } from "@/config/content";
import { getI18n } from "@/i18n/get-locale";
import { localizeAll } from "@/i18n/localize";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getI18n();
  return { title: m.meta.services.title, description: m.meta.services.description, alternates: { canonical: "/services" } };
}

export default async function ServicesPage() {
  const { m, locale } = await getI18n();
  const items = localizeAll(services, locale);
  return (
    <>
      <PageHero eyebrow={m.services.eyebrow} title={m.services.title} intro={m.services.intro} />

      <div className="container-x">
        {items.map((s, i) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-t`} className="scroll-mt-24 border-b border-line py-16 last:border-0 lg:py-24">
            <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
              <Reveal className={`lg:col-span-5 ${i % 2 ? "lg:order-2" : ""}`}>
                <p className="font-display text-6xl font-semibold text-navy/15">{s.n}</p>
                <h2 id={`${s.id}-t`} className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">{s.title}</h2>
                <p className="mt-5 text-base leading-relaxed text-charcoal/80">{s.text}</p>
                <ul className="mt-6 space-y-2.5 border-t border-line pt-6 text-sm text-charcoal/85">
                  {s.points.map((p) => (<li key={p} className="flex gap-3"><span className="mt-2 size-1 shrink-0 bg-brand-red" aria-hidden />{p}</li>))}
                </ul>
                <div className="mt-8"><CtaLink href={s.ctaHref} variant="navy">{s.ctaLabel}</CtaLink></div>
              </Reveal>
              <Reveal className={`grid grid-cols-5 gap-3 lg:col-span-7 ${i % 2 ? "lg:order-1" : ""}`} delay={0.1} distance={30}>
                <div className="img-zoom img-fade relative col-span-3 aspect-[4/5] overflow-hidden bg-offwhite">
                  <Image src={s.images[0]} alt={`${s.title}, ${m.services.imagery}`} fill sizes="(min-width:1024px) 34vw, 60vw" className="object-cover" />
                </div>
                <div className="img-zoom img-fade relative col-span-2 mt-12 aspect-square overflow-hidden bg-offwhite">
                  <Image src={s.images[1]} alt="" fill sizes="(min-width:1024px) 22vw, 40vw" className="object-cover" />
                </div>
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      <ProcessSection />
      <FinalCta />
    </>
  );
}
