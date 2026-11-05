import { CtaLink } from "@/components/shared/cta";
import { getI18n } from "@/i18n/get-locale";

export default async function NotFound() {
  const { m } = await getI18n();
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="eyebrow mb-4">{m.notFound.eyebrow}</p>
      <h1 className="display-1 !text-[clamp(2.5rem,6vw,5rem)]">{m.notFound.title}</h1>
      <p className="mt-5 max-w-lg text-lg text-muted-foreground">{m.notFound.text}</p>
      <div className="mt-8 flex gap-3">
        <CtaLink href="/" variant="navy">{m.cta.backHome}</CtaLink>
        <CtaLink href="/products" variant="outline">{m.cta.browseProducts}</CtaLink>
      </div>
    </section>
  );
}
