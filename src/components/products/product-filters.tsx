"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { LayoutGroup, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SORT_OPTIONS, type SortValue } from "@/lib/catalogue";
import { useI18n } from "@/i18n/provider";
import type { Category } from "@/types";

export function ProductFilters({
  categories,
  counts,
  total,
  q,
  category,
  sort,
}: {
  categories: Category[];
  counts: Record<string, number>;
  total: number;
  q: string;
  category: string;
  sort: SortValue;
}) {
  const { m } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(q);
  const [, start] = useTransition();
  const first = useRef(true);

  const push = (next: { q?: string; category?: string; sort?: string }) => {
    const params = new URLSearchParams();
    const nq = (next.q ?? value).trim();
    const nc = next.category ?? category;
    const ns = next.sort ?? sort;
    if (nq) params.set("q", nq);
    if (nc) params.set("category", nc);
    if (ns && ns !== "featured") params.set("sort", ns);
    const qs = params.toString();
    start(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => push({ q: value }), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const chips = [{ id: "", name: m.products.all, count: total }, ...categories.map((c) => ({ id: c.slug, name: c.name, count: counts[c.slug] ?? 0 }))];

  return (
    <div className="sticky top-[76px] z-30 -mx-5 border-b border-line bg-white/90 px-5 py-4 backdrop-blur-md sm:mx-0 sm:px-0 lg:top-[84px]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            push({ q: value });
          }}
          className="relative w-full lg:max-w-md"
        >
          <label htmlFor="product-search" className="sr-only">{m.a11y.searchProducts}</label>
          <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="product-search"
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={m.products.searchPlaceholder}
            className="h-11 w-full border border-input bg-white ps-11 pe-11 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-navy"
          />
          {value && (
            <button type="button" aria-label={m.a11y.clearSearch} onClick={() => setValue("")} className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-navy">
              <X className="size-4" />
            </button>
          )}
        </form>

        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="sort" className="text-muted-foreground">{m.products.sort}</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => push({ sort: e.target.value })}
            className="h-11 border border-input bg-white px-3 text-sm text-navy outline-none focus:border-navy"
          >
            {SORT_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{m.products.sortOptions[o.value]}</option>))}
          </select>
        </div>
      </div>

      <LayoutGroup id="cat-chips">
        <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label={m.a11y.filterCategory}>
          {chips.map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id || "all"}
                type="button"
                aria-pressed={active}
                onClick={() => push({ category: c.id })}
                className={cn(
                  "relative shrink-0 border px-4 py-2 text-[13px] font-medium transition-colors",
                  active ? "border-navy text-white" : "border-line bg-white text-charcoal/80 hover:border-navy hover:text-navy",
                )}
              >
                {active && <motion.span layoutId="chip-active" className="absolute inset-0 -z-0 bg-navy" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
                <span className="relative z-10">
                  {c.name} <span className="ms-1 text-xs opacity-70">{c.count}</span>
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}
