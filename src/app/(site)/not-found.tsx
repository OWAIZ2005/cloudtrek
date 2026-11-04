import { CtaLink } from "@/components/shared/cta";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="eyebrow mb-4">Error 404</p>
      <h1 className="display-1 !text-[clamp(2.5rem,6vw,5rem)]">This page has wandered off.</h1>
      <p className="mt-5 max-w-lg text-lg text-muted-foreground">The page you are looking for does not exist or has moved.</p>
      <div className="mt-8 flex gap-3">
        <CtaLink href="/" variant="navy">Back to home</CtaLink>
        <CtaLink href="/products" variant="outline">Browse products</CtaLink>
      </div>
    </section>
  );
}
