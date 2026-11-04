import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/shared/icons";
import { CloudTrekLogo } from "@/components/brand/cloudtrek-logo";
import FadeContent from "@/components/reactbits/FadeContent";
import { navLinks, siteConfig, whatsappLink } from "@/config/site";
import { divisions } from "@/config/content";
import { getCategories } from "@/lib/data";
import type { Dictionary } from "@/i18n/dictionaries";

export async function Footer({ dict }: { dict: Dictionary }) {
  const categories = await getCategories();
  const c = siteConfig.contact;
  const wa = whatsappLink();

  return (
    <footer className="mt-24 border-t border-line bg-offwhite/85 backdrop-blur-[2px]">
      <FadeContent effect="fade" duration={0.9} threshold={0.1} className="container-x grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
        <div className="max-w-sm">
          <CloudTrekLogo variant="full" href="/" className="h-32 sm:h-40" sizes="500px" />
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{siteConfig.description}</p>
          <a
            href={c.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-brand-red"
          >
            <InstagramIcon className="size-4" /> {c.instagramHandle}
          </a>
        </div>

        <FooterCol title="Navigate">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-brand-red">{dict.nav[l.key]}</Link>
            </li>
          ))}
        </FooterCol>

        <FooterCol title="Products">
          {categories.slice(0, 8).map((cat) => (
            <li key={cat.id}>
              <Link href={`/products?category=${cat.slug}`} className="hover:text-brand-red">{cat.name}</Link>
            </li>
          ))}
        </FooterCol>

        <FooterCol title="Services">
          {divisions.map((d) => (
            <li key={d.slug}>
              <Link href={d.href} className="hover:text-brand-red">{d.title}</Link>
            </li>
          ))}
          <li><Link href="/corporate-gifting" className="hover:text-brand-red">Corporate Gifting</Link></li>
        </FooterCol>

        <div>
          <h3 className="mb-5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-navy">Contact</h3>
          <ul className="space-y-3.5 text-sm text-charcoal/80">
            <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-brand-red" aria-hidden /><span>{c.address || siteConfig.locationLabel}</span></li>
            {c.email && <li className="flex gap-3"><Mail className="mt-0.5 size-4 shrink-0 text-brand-red" aria-hidden /><a href={`mailto:${c.email}`} className="hover:text-brand-red">{c.email}</a></li>}
            {c.phone && <li className="flex gap-3"><Phone className="mt-0.5 size-4 shrink-0 text-brand-red" aria-hidden /><a href={`tel:${c.phone}`} className="hover:text-brand-red">{c.phone}</a></li>}
            {wa && <li className="flex gap-3"><MessageCircle className="mt-0.5 size-4 shrink-0 text-brand-red" aria-hidden /><a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-brand-red">WhatsApp us</a></li>}
          </ul>
        </div>
      </FadeContent>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Cloud Trek. All rights reserved.</p>
          <p>For events management, publicity and advertising, Kingdom of Bahrain. Link animations adapted from <a href="https://skiper-ui.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-navy">Skiper UI</a>.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-navy">{title}</h3>
      <ul className="space-y-3 text-sm text-charcoal/80">{children}</ul>
    </div>
  );
}
