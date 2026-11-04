"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { motion } from "motion/react";
import { ClipboardList, Languages, Menu } from "lucide-react";
import { CloudTrekLogo } from "@/components/brand/cloudtrek-logo";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { navLinks } from "@/config/site";
import { setLocale } from "@/i18n/server";
import { useQuote } from "@/components/quote/quote-provider";
import Magnet from "@/components/reactbits/Magnet";
import { ctaClass } from "@/components/shared/cta";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/types";

export function Header({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { count } = useQuote();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const nextLocale: Locale = locale === "ar" ? "en" : "ar";

  const switchLang = () => startTransition(() => void setLocale(nextLocale));

  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-[border-color,box-shadow] duration-300",
        scrolled ? "border-line shadow-[0_1px_0_0_rgba(23,59,112,0.04)]" : "border-transparent",
      )}
    >
      <div className="container-x flex h-[84px] items-center justify-between gap-6 lg:h-[96px]">
        <CloudTrekLogo variant="navbar" href="/" priority className="h-[60px] sm:h-16 lg:h-[76px]" sizes="300px" />

        <nav aria-label="Primary" className="hidden items-center xl:flex">
          {navLinks.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative whitespace-nowrap px-3 py-2 text-[13.5px] font-medium transition-colors duration-200",
                  active ? "text-navy" : "text-charcoal/70 hover:text-navy",
                )}
              >
                {dict.nav[l.key]}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-px h-[2px] bg-brand-red"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={switchLang}
            disabled={pending}
            lang={nextLocale}
            aria-label={locale === "ar" ? "Switch to English" : "Switch to Arabic"}
            className="hidden items-center gap-1.5 px-2 py-2 text-[13px] font-medium text-charcoal/70 transition-colors hover:text-navy sm:inline-flex"
          >
            <Languages className="size-4" aria-hidden />
            <span className="hidden 2xl:inline">{dict.cta.language}</span>
          </button>

          <Link
            href="/quote"
            aria-label={`${dict.list}${count ? `, ${count} item${count > 1 ? "s" : ""}` : ""}`}
            className="relative inline-flex size-10 items-center justify-center text-navy transition-colors hover:text-brand-red"
          >
            <ClipboardList className="size-5" aria-hidden />
            {count > 0 && (
              <span className="absolute end-0.5 top-0.5 flex size-4 items-center justify-center bg-brand-red text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>

          <div className="hidden md:block">
            <Magnet magnetStrength={4} padding={40}>
              <Link href="/quote" className={ctaClass("red", "px-5 py-3")}>
                {dict.cta.quote}
              </Link>
            </Magnet>
          </div>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center text-navy xl:hidden"
            aria-label={dict.cta.menu}
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu className="size-6" aria-hidden />
          </button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side={locale === "ar" ? "left" : "right"} className="w-full max-w-none bg-white p-0 sm:max-w-md">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">Main site navigation</SheetDescription>
          <div className="flex h-full flex-col px-6 pb-8 pt-6">
            <div className="mb-8">
              <CloudTrekLogo variant="navbar" href="/" className="h-14" sizes="240px" />
            </div>
            <nav aria-label="Mobile" className="flex flex-1 flex-col">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: 16 }}
                  animate={open ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.35 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-baseline justify-between border-b border-line py-4 font-display text-2xl font-medium tracking-tight",
                      isActive(l.href) ? "text-brand-red" : "text-navy",
                    )}
                  >
                    {dict.nav[l.key]}
                    <span className="text-xs font-normal text-muted-foreground">0{i + 1}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-8 flex flex-col gap-3">
              <Link href="/quote" onClick={() => setOpen(false)} className={ctaClass("red", "w-full")}>
                {dict.cta.quote}
              </Link>
              <button
                type="button"
                onClick={switchLang}
                disabled={pending}
                className="inline-flex items-center justify-center gap-2 border border-line py-3 text-sm font-medium text-navy"
              >
                <Languages className="size-4" aria-hidden /> {dict.cta.language}
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </motion.header>
  );
}
