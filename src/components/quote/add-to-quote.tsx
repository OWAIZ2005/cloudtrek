"use client";

import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { useQuote } from "./quote-provider";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/provider";
import type { Product } from "@/types";

export function AddToQuoteButton({
  product,
  variant = "outline",
  size = "md",
  className,
}: {
  product: Pick<Product, "id" | "slug" | "name" | "images">;
  variant?: "outline" | "solid";
  size?: "md" | "sm";
  className?: string;
}) {
  const { add, has } = useQuote();
  const { m } = useI18n();
  const added = has(product.id);
  const base =
    cn(
      "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy",
      size === "sm" ? "px-3 py-2 text-xs" : "px-5 py-3 text-sm",
    );

  if (added) {
    return (
      <Link href="/quote" className={cn(base, "border border-brand-red text-brand-red hover:bg-brand-red hover:text-white", className)}>
        <Check className="size-4" aria-hidden /> {size === "sm" ? m.products.added : m.products.inList}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => add({ productId: product.id, slug: product.slug, name: product.name, image: product.images[0] })}
      className={cn(
        base,
        variant === "solid" ? "bg-navy text-white hover:bg-navy-deep" : "border border-navy/30 text-navy hover:border-navy hover:bg-navy hover:text-white",
        className,
      )}
    >
      <Plus className="size-4" aria-hidden /> {size === "sm" ? m.products.add : m.products.addToEnquiry}
    </button>
  );
}
