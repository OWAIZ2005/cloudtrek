import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/page-hero";
import { CtaLink } from "@/components/shared/cta";
import { Reveal } from "@/components/shared/reveal";
import { FinalCta } from "@/components/home/final-cta";
import { ProcessSection } from "@/components/home/sections";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Promotional products and merchandise, events management, and advertising and publicity, three divisions from one Bahrain-based partner.",
  alternates: { canonical: "/services" },
};

const services = [
  {
    id: "promotional-products",
    n: "01",
    title: "Promotional Products & Merchandise",
    text: "We help you choose the right products for your audience, then customise, produce and pack them. From a single executive gift to large staff and event programmes.",
    points: ["Product sourcing and selection", "Branding and personalisation", "Gift sets, kits and hampers", "Packaging and delivery coordination"],
    images: ["/images/products/corporate-backpack.jpg", "/images/products/welcome-kit.jpg"],
    cta: { href: "/products", label: "Explore Products" },
  },
  {
    id: "events-management",
    n: "02",
    title: "Events Management",
    text: "Support for conferences, exhibitions and brand activations, with the merchandise, signage and details that make an event feel considered.",
    points: ["Corporate events and conferences", "Exhibition presence and displays", "Delegate kits and giveaways", "On-site brand touchpoints"],
    images: ["/images/events/conference-stage-portrait.jpg", "/images/events/exhibition-counter-portrait.jpg"],
    cta: { href: "/quote", label: "Discuss an Event" },
  },
  {
    id: "advertising-publicity",
    n: "03",
    title: "Advertising & Publicity",
    text: "Campaign visibility that connects your message with print, display and outdoor presence, working alongside your gifting and events activity.",
    points: ["Campaign concepts", "Print and display media", "Outdoor and branded environments", "Publicity support"],
    images: ["/images/advertising/billboards-night-portrait.jpg", "/images/advertising/digital-billboards-portrait.jpg"],
    cta: { href: "/quote", label: "Plan a Campaign" },
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Brand presence, in every dimension."
        intro="Cloud Trek brings promotional products, events management and advertising together, so your brand looks and feels consistent wherever people meet it."
      />

      <div className="container-x">
        {services.map((s, i) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-t`} className="scroll-mt-24 border-b border-line py-16 last:border-0 lg:py-24">
            <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
              <Reveal className={`lg:col-span-5 ${i % 2 ? "lg:order-2" : ""}`}>
                <p className="font-display text-6xl font-semibold text-navy/15">{s.n}</p>
                <h2 id={`${s.id}-t`} className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">{s.title}</h2>
                <p className="mt-5 text-base leading-relaxed text-charcoal/80">{s.text}</p>
                <ul className="mt-6 space-y-2.5 border-t border-line pt-6 text-sm text-charcoal/85">
                  {s.points.map((p) => (<li key={p} className="flex gap-3"><span className="mt-2 size-1 shrink-0 bg-brand-red" aria-hidden />{p}</li>))}
                </ul>
                <div className="mt-8"><CtaLink href={s.cta.href} variant="navy">{s.cta.label}</CtaLink></div>
              </Reveal>
              <Reveal className={`grid grid-cols-5 gap-3 lg:col-span-7 ${i % 2 ? "lg:order-1" : ""}`} delay={0.1} distance={30}>
                <div className="img-zoom relative col-span-3 aspect-[4/5] overflow-hidden bg-offwhite">
                  <Image src={s.images[0]} alt={`${s.title} imagery`} fill sizes="(min-width:1024px) 34vw, 60vw" className="object-cover" />
                </div>
                <div className="img-zoom relative col-span-2 mt-12 aspect-square overflow-hidden bg-offwhite">
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
