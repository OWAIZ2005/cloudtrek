import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaLink } from "@/components/shared/cta";
import { FinalCta } from "@/components/home/final-cta";
import { CloudTrekLogo } from "@/components/brand/cloudtrek-logo";
import { divisions, values } from "@/config/content";

export const metadata: Metadata = {
  title: "About Us",
  description: "Cloud Trek is a Bahrain-based B2B partner for promotional products, corporate gifting, events management, publicity and advertising.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Cloud Trek"
        title="A brand-first partner for Bahrain's businesses."
        intro="Cloud Trek works with organisations to turn brand identity into things people hold, events they attend and campaigns they see."
        image="/images/gifting/client-appreciation-wide.jpg"
        imageAlt="Colleagues sharing a gift box in an office"
      />

      <section className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <Reveal className="lg:col-span-5"><h2 className="display-2">Who we are</h2></Reveal>
        <Reveal className="space-y-5 text-base leading-relaxed text-charcoal/80 lg:col-span-7" delay={0.1}>
          <p>Cloud Trek is a B2B company based in the Kingdom of Bahrain, working across promotional products, corporate gifting, events management, publicity and advertising.</p>
          <p>We believe a brand is most convincing when it is consistent: on the notebook on a client&rsquo;s desk, the lanyard at a conference and the display at an exhibition.</p>
          <CloudTrekLogo variant="full" className="h-40" sizes="500px" />
        </Reveal>
      </section>

      <section className="bg-offwhite/75 py-20 lg:py-24" aria-label="Our approach">
        <div className="container-x grid gap-px bg-line md:grid-cols-2">
          {[
            { t: "What we focus on", d: "Helping organisations in Bahrain turn their identity into products, events and campaigns that people notice and keep." },
            { t: "How we work", d: "We listen to the brief, recommend the right products and techniques, show you the artwork, and deliver what we agreed." },
          ].map((m) => (
            <Reveal key={m.t}>
              <div className="h-full bg-white p-8 lg:p-12">
                <h2 className="text-2xl font-semibold">{m.t}</h2>
                <p className="mt-5 text-base leading-relaxed text-charcoal/80">{m.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x py-20 lg:py-28">
        <SectionHeading eyebrow="Business divisions" title="Three divisions, one standard." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {divisions.map((d, i) => (
            <Reveal key={d.slug} delay={i * 0.1}>
              <div className="group">
                <div className="img-zoom relative aspect-[4/3] overflow-hidden bg-offwhite"><Image src={d.imageWide} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" /></div>
                <h3 className="mt-5 text-xl font-semibold leading-snug">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-white/70 py-20 lg:py-24" aria-labelledby="values-title">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4"><SectionHeading eyebrow="Values" id="values-title" title="What guides our work." /></div>
          <div role="list" className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
            {values.map((v, i) => (
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
        <p className="display-2 mx-auto max-w-3xl !text-[clamp(1.6rem,3vw,2.5rem)]">Have a project in mind?</p>
        <div className="mt-7 flex justify-center gap-3"><CtaLink href="/contact" variant="navy">Contact Us</CtaLink><CtaLink href="/quote" variant="red">Request a Quote</CtaLink></div>
      </section>
      <FinalCta />
    </>
  );
}
