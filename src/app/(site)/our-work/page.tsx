import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { FinalCta } from "@/components/home/final-cta";
import { getProjects } from "@/lib/data";
import { getI18n } from "@/i18n/get-locale";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getI18n();
  return { title: m.meta.work.title, description: m.meta.work.description, alternates: { canonical: "/our-work" } };
}

export default async function WorkPage() {
  const { m } = await getI18n();
  const { projects } = await getProjects();
  return (
    <>
      <PageHero
        eyebrow={m.work.eyebrow}
        title={m.work.title}
        intro={m.work.intro}
      >
        <p className="max-w-xl text-sm text-charcoal/70">{m.work.line}</p>
      </PageHero>

      <div className="container-x space-y-20 py-16 lg:space-y-28 lg:py-24">
        {projects.map((p, i) => (
          <Reveal key={p.id} distance={28}>
            <article id={p.slug} className="grid scroll-mt-28 gap-8 lg:grid-cols-12 lg:gap-12">
              <div className={`grid grid-cols-5 gap-3 lg:col-span-8 ${i % 2 ? "lg:order-2" : ""}`}>
                <div className={`img-zoom img-fade img-fade-soft relative aspect-[4/3] overflow-hidden bg-offwhite ${p.images[1] ? "col-span-3" : "col-span-5"}`}>
                  <Image src={p.images[0]} alt={`${p.title}, ${m.work.main}`} fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" />
                </div>
                {p.images[1] && (
                  <div className="img-zoom img-fade relative col-span-2 aspect-square self-end overflow-hidden bg-offwhite">
                    <Image src={p.images[1]} alt={`${p.title}, ${m.work.detail}`} fill sizes="(min-width:1024px) 25vw, 40vw" className="object-cover" />
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
