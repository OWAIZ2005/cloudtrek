import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaLink } from "@/components/shared/cta";
import { FinalCta } from "@/components/home/final-cta";
import { CloudTrekLogo } from "@/components/brand/cloudtrek-logo";
import { divisions, values } from "@/config/content";
import { getI18n } from "@/i18n/get-locale";
import { localizeAll } from "@/i18n/localize";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getI18n();
  return { title: m.meta.about.title, description: m.meta.about.description, alternates: { canonical: "/about" } };
}

export default async function AboutPage() {
  const { m, locale } = await getI18n();
  const divs = localizeAll(divisions, locale);
  const vals = localizeAll(values, locale);
  return (
    <>
      <PageHero
        eyebrow={m.about.eyebrow}
        title={m.about.title}
        intro={m.about.intro}
        image="/images/gifting/client-appreciation-wide.jpg"
        imageAlt={m.about.altHero}
      />

      <section className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <Reveal className="lg:col-span-5"><h2 className="display-2">{m.about.whoTitle}</h2></Reveal>
        <Reveal className="space-y-5 text-base leading-relaxed text-charcoal/80 lg:col-span-7" delay={0.1}>
          <p>{m.about.p1}</p>
          <p>{m.about.p2}</p>
          <CloudTrekLogo variant="full" className="h-40" sizes="500px" />
        </Reveal>
      </section>

      <section className="bg-offwhite/75 py-20 lg:py-24" aria-label={m.about.approach[0].t}>
        <div className="container-x grid gap-px bg-line md:grid-cols-2">
          {m.about.approach.map((a) => (
            <Reveal key={a.t}>
              <div className="h-full bg-white p-8 lg:p-12">
                <h2 className="text-2xl font-semibold">{a.t}</h2>
                <p className="mt-5 text-base leading-relaxed text-charcoal/80">{a.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x py-20 lg:py-28">
        <SectionHeading eyebrow={m.about.divisionsEyebrow} title={m.about.divisionsTitle} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {divs.map((d, i) => (
            <Reveal key={d.slug} delay={i * 0.1}>
              <div className="group">
                <div className="img-zoom img-fade img-fade-soft relative aspect-[4/3] overflow-hidden bg-offwhite"><Image src={d.imageWide} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" /></div>
                <h3 className="mt-5 text-xl font-semibold leading-snug">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-white/70 py-20 lg:py-24" aria-labelledby="values-title">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4"><SectionHeading eyebrow={m.about.valuesEyebrow} id="values-title" title={m.about.valuesTitle} /></div>
          <div role="list" className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
            {vals.map((v, i) => (
              <Reveal key={v.title} delay={(i % 2) * 0.1} distance={18}>
                <div role="listitem" className="border-t border-line py-7">
                  <h3 className="text-xl font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-16 text-center">
        <p className="display-2 mx-auto max-w-3xl !text-[clamp(1.6rem,3vw,2.5rem)]">{m.about.projectQ}</p>
        <div className="mt-7 flex justify-center gap-3"><CtaLink href="/contact" variant="navy">{m.cta.contactUs}</CtaLink><CtaLink href="/quote" variant="red">{m.cta.quote}</CtaLink></div>
      </section>
      <FinalCta />
    </>
  );
}
