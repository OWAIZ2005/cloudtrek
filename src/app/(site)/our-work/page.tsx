import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { FinalCta } from "@/components/home/final-cta";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Work",
  description: "Project showcase: corporate gifting, events and promotional merchandise by Cloud Trek.",
  alternates: { canonical: "/our-work" },
};

export default async function WorkPage() {
  const { projects } = await getProjects();
  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Ideas, made tangible."
        intro="A selection of project work, from welcome kits to conference merchandise and recognition awards."
      >
        <p className="max-w-xl text-sm text-charcoal/70">Every project starts with a brief: audience, quantity, timeline and brand. We handle the rest, from sourcing to delivery.</p>
      </PageHero>

      <div className="container-x space-y-20 py-16 lg:space-y-28 lg:py-24">
        {projects.map((p, i) => (
          <Reveal key={p.id} distance={28}>
            <article id={p.slug} className="grid scroll-mt-28 gap-8 lg:grid-cols-12 lg:gap-12">
              <div className={`grid grid-cols-5 gap-3 lg:col-span-8 ${i % 2 ? "lg:order-2" : ""}`}>
                <div className={`img-zoom relative aspect-[4/3] overflow-hidden bg-offwhite ${p.images[1] ? "col-span-3" : "col-span-5"}`}>
                  <Image src={p.images[0]} alt={`${p.title}, main image`} fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" />
                </div>
                {p.images[1] && (
                  <div className="img-zoom relative col-span-2 aspect-square self-end overflow-hidden bg-offwhite">
                    <Image src={p.images[1]} alt={`${p.title}, detail`} fill sizes="(min-width:1024px) 25vw, 40vw" className="object-cover" />
                  </div>
                )}
              </div>
              <div className="lg:col-span-4">
                <p className="eyebrow mb-3">{p.category}</p>
                <h2 className="text-3xl font-semibold leading-tight">{p.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-charcoal/80">{p.description}</p>
                {p.details.length > 0 && (
                  <dl className="mt-6 divide-y divide-line border-t border-line text-sm">
                    {p.details.map((d) => (
                      <div key={d.label} className="grid grid-cols-3 gap-3 py-3">
                        <dt className="text-muted-foreground">{d.label}</dt>
                        <dd className="col-span-2 text-charcoal">{d.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <FinalCta />
    </>
  );
}
