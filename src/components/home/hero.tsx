import Image from "next/image";
import Link from "next/link";
import { HeroHeadline, HeroBackdrop } from "./hero-client";
import { CtaLink } from "@/components/shared/cta";
import { Reveal } from "@/components/shared/reveal";
import { divisions } from "@/config/content";
import { getI18n } from "@/i18n/get-locale";
import { localizeAll } from "@/i18n/localize";

export async function Hero() {
  const { m, locale } = await getI18n();
  const divs = localizeAll(divisions, locale);
  return (
    <section className="relative overflow-hidden border-b border-line">
      <HeroBackdrop />
      <div className="container-x relative grid gap-12 pb-14 pt-10 lg:grid-cols-12 lg:gap-8 lg:pb-20 lg:pt-16">
        <div className="flex flex-col justify-center lg:col-span-6 xl:col-span-6">
          <Reveal distance={16} duration={0.6}>
            <p className="eyebrow mb-6">{m.hero.eyebrow}</p>
          </Reveal>
          <HeroHeadline text={m.hero.title} />
          <Reveal delay={0.25} distance={20}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-charcoal/75 sm:text-lg">
              {m.hero.text}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <CtaLink href="/products" variant="navy">{m.cta.explore}</CtaLink>
              <CtaLink href="/quote" variant="outline">{m.cta.quote}</CtaLink>
            </div>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-6" delay={0.1} distance={30} duration={1}>
          <div className="relative mx-auto grid max-w-xl grid-cols-12 gap-3 sm:gap-4 lg:ms-auto lg:max-w-[88%]">
            <div className="img-zoom img-shade-strong relative col-span-8 aspect-[4/5] overflow-hidden bg-offwhite">
              <Image
                src="/images/hero/gift-exchange.jpg"
                alt={m.hero.altGift}
                fill
                priority
                quality={85}
                sizes="(min-width:1024px) 34vw, 66vw"
                className="object-cover"
              />
            </div>
            <div className="col-span-4 flex flex-col gap-3 sm:gap-4">
              <div className="img-zoom img-shade-strong relative flex-1 overflow-hidden bg-offwhite">
                <Image
                  src="/images/products/welcome-kit-tall.jpg"
                  alt={m.hero.altKit}
                  fill
                  sizes="(min-width:1024px) 16vw, 33vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="img-zoom img-shade-strong relative aspect-square overflow-hidden bg-offwhite">
                <Image
                  src="/images/products/leather-notebook.jpg"
                  alt={m.hero.altNotebook}
                  fill
                  sizes="(min-width:1024px) 16vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="img-zoom img-shade-strong img-fade-soft relative col-span-12 aspect-[2.6/1] overflow-hidden bg-offwhite sm:col-span-7">
              <Image
                src="/images/hero/gift-boxes-strip.jpg"
                alt={m.hero.altStrip}
                fill
                sizes="(min-width:1024px) 24vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="col-span-12 flex items-center text-[13px] leading-snug text-charcoal/70 sm:col-span-5">
              {m.hero.caption}
            </p>
          </div>
        </Reveal>
      </div>

      <div className="border-t border-line bg-white/70 backdrop-blur-sm">
        <ul className="container-x grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0 rtl:sm:divide-x-reverse">
          {divs.map((d, i) => (
            <li key={d.slug} className="sm:px-8 sm:first:ps-0 sm:last:pe-0">
              <Link
                href={d.href}
                className="group flex items-center justify-between gap-4 py-5 transition-colors"
              >
                <span className="flex items-baseline gap-3">
                  <span className="text-xs font-semibold tabular-nums text-brand-red">0{i + 1}</span>
                  <span className="text-sm font-medium leading-snug text-navy group-hover:text-brand-red">{d.title}</span>
                </span>
                <span aria-hidden className="shrink-0 text-navy transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
