import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { InstagramIcon } from "@/components/shared/icons";
import { siteConfig, whatsappLink } from "@/config/site";
import { getI18n } from "@/i18n/get-locale";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getI18n();
  return { title: m.meta.contact.title, description: m.meta.contact.description, alternates: { canonical: "/contact" } };
}

export default async function ContactPage() {
  const { m } = await getI18n();
  const c = siteConfig.contact;
  const wa = whatsappLink();

  const rows = [
    { icon: Mail, label: m.contact.email, value: c.email, href: c.email ? `mailto:${c.email}` : null },
    { icon: Phone, label: m.contact.phone, value: c.phone, href: c.phone ? `tel:${c.phone}` : null },
    { icon: MessageCircle, label: m.contact.whatsapp, value: wa ? m.contact.whatsappChat : "", href: wa },
    { icon: MapPin, label: m.contact.location, value: c.address || m.brand.location, href: null },
  ];

  return (
    <>
      <PageHero eyebrow={m.contact.eyebrow} title={m.contact.title} intro={m.contact.intro} />
      <section className="container-x grid gap-14 py-14 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-5">
          <p className="mb-6 text-base leading-relaxed text-charcoal/80">{m.contact.lead}</p>
          <ul className="divide-y divide-line border-y border-line">
            {rows.filter((r) => r.value).map((r) => (
              <li key={r.label} className="flex gap-4 py-5">
                <r.icon className="mt-0.5 size-5 shrink-0 text-brand-red" aria-hidden />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{r.label}</p>
                  {r.href ? (
                    <a href={r.href} {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="mt-1 block text-base text-navy hover:text-brand-red" dir={r.href.startsWith("http") ? undefined : "ltr"} style={r.href.startsWith("http") ? undefined : { textAlign: "start" }}>{r.value}</a>
                  ) : (
                    <p className="mt-1 text-base text-navy">{r.value}</p>
                  )}
                </div>
              </li>
            ))}
            <li className="flex gap-4 py-5">
              <InstagramIcon className="mt-0.5 size-5 shrink-0 text-brand-red" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{m.contact.instagram}</p>
                <a href={c.instagram} target="_blank" rel="noopener noreferrer" className="mt-1 block text-base text-navy hover:text-brand-red">{c.instagramHandle}</a>
              </div>
            </li>
          </ul>

          {c.mapEmbedUrl && (
            <div className="mt-8 aspect-[4/3] overflow-hidden border border-line bg-offwhite">
              <iframe title={m.contact.mapTitle} src={c.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="size-full border-0" />
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          <h2 className="text-2xl font-semibold">{m.contact.sendTitle}</h2>
          <div className="mt-6"><ContactForm /></div>
        </div>
      </section>
    </>
  );
}
