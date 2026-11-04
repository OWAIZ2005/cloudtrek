import Link from "next/link";
import { ArrowUpRight, Paintbrush } from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";
import { AddToQuoteButton } from "@/components/quote/add-to-quote";
import GlareHover from "@/components/reactbits/GlareHover";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import { Link000 } from "@/components/ui/skiper-ui/skiper40";
import type { Product } from "@/types";

function CustomizationLine({ options }: { options: string[] }) {
  if (!options.length) return null;
  const shown = options.slice(0, 2).join(", ");
  const more = options.length - 2;
  return (
    <p className="flex items-start gap-1.5 text-xs leading-snug text-charcoal/70">
      <Paintbrush className="mt-0.5 size-3.5 shrink-0 text-brand-red" aria-hidden />
      <span>
        <span className="font-medium text-navy">Customizable:</span> {shown}
        {more > 0 && <span className="text-muted-foreground"> +{more} more</span>}
      </span>
    </p>
  );
}

/** Standard catalogue card: image-led, hairline border, hover reveals customization options. */
export function ProductCard({
  product,
  categoryName,
  priority = false,
}: {
  product: Product;
  categoryName?: string;
  priority?: boolean;
}) {
  return (
    <article className="group/card flex h-full flex-col border border-line bg-white transition-[border-color,box-shadow] duration-300 hover:border-navy/35 hover:shadow-[0_18px_40px_-28px_rgba(23,59,112,0.45)] focus-within:border-navy/35">
      <Link
        href={`/products/${product.slug}`}
        aria-label={`View details: ${product.name}`}
        className="img-zoom relative block aspect-square overflow-hidden bg-offwhite"
      >
        <GlareHover width="100%" height="100%" borderRadius="0" glareOpacity={0.2} glareSize={38} rimGlint={false} className="absolute inset-0">
          <SafeImage
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width:1280px) 22vw, (min-width:768px) 33vw, 50vw"
            priority={priority}
            className="object-cover"
          />
        </GlareHover>
        {product.isFeatured && (
          <span className="absolute start-3 top-3 z-10 bg-brand-red px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
            Featured
          </span>
        )}
        {product.customizationOptions.length > 0 && (
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 z-10 hidden translate-y-full flex-wrap gap-1.5 bg-navy/92 p-3 transition-transform duration-300 group-hover/card:translate-y-0 [@media(hover:hover)]:flex"
          >
            {product.customizationOptions.slice(0, 4).map((o) => (
              <span key={o} className="border border-white/30 px-2 py-0.5 text-[10.5px] text-white/95">{o}</span>
            ))}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow !text-[10px]">{categoryName ?? product.categorySlug.replace(/-/g, " ")}</p>
          {product.moq ? (
            <p className="shrink-0 text-[11px] text-muted-foreground">
              MOQ <span className="font-semibold text-navy">{product.moq}</span>
            </p>
          ) : null}
        </div>

        <h3 className="text-lg font-semibold leading-snug tracking-tight">
          <Link000 href={`/products/${product.slug}`} className="inline-flex text-navy">
            {product.name}
          </Link000>
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.shortDescription}</p>
        <CustomizationLine options={product.customizationOptions} />

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
          <Link000 href={`/products/${product.slug}`} className="inline-flex gap-1 text-[13px] font-medium text-navy hover:text-brand-red">
            View details <ArrowUpRight className="size-3.5 rtl:-scale-x-100" aria-hidden />
          </Link000>
          <AddToQuoteButton product={product} size="sm" />
        </div>
      </div>
    </article>
  );
}

/** Larger editorial card for the featured band (React Bits SpotlightCard surface). */
export function FeaturedProductCard({ product, categoryName }: { product: Product; categoryName?: string }) {
  return (
    <SpotlightCard theme="light" spotlightColor="#173b70" intensity={0.1} style={{ borderRadius: 2 }} className="h-full overflow-hidden !p-0">
      <article className="grid h-full sm:grid-cols-[1.05fr_1fr] lg:grid-cols-1 xl:grid-cols-[1.05fr_1fr]">
        <Link href={`/products/${product.slug}`} aria-label={`View details: ${product.name}`} className="img-zoom relative block aspect-square overflow-hidden bg-offwhite sm:aspect-auto sm:min-h-[260px]">
          <SafeImage src={product.images[0]} alt={product.name} fill sizes="(min-width:1280px) 20vw, (min-width:640px) 30vw, 100vw" className="object-cover" />
        </Link>
        <div className="flex flex-col gap-3 p-5">
          <p className="eyebrow !text-[10px]">{categoryName ?? "Featured"}</p>
          <h3 className="text-xl font-semibold leading-snug">
            <Link000 href={`/products/${product.slug}`} className="inline-flex text-navy">{product.name}</Link000>
          </h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{product.shortDescription}</p>
          <CustomizationLine options={product.customizationOptions} />
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
            <AddToQuoteButton product={product} size="sm" variant="solid" />
            <Link000 href={`/products/${product.slug}`} className="inline-flex gap-1 text-[13px] font-medium text-navy hover:text-brand-red">
              Details <ArrowUpRight className="size-3.5 rtl:-scale-x-100" aria-hidden />
            </Link000>
          </div>
        </div>
      </article>
    </SpotlightCard>
  );
}
