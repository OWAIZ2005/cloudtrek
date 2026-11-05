"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/provider";

/**
 * Single source for the official Cloud Trek logo. Assets in /public/images/brand are
 * crops/optimised copies of the supplied artwork (see scripts/prepare-logo.cjs).
 * Never recreate the logo in HTML or recolour it.
 */
export const LOGO_ALT = "Cloud Trek — Corporate Events, Publicity and Advertising";
export const LOGO_ALT_AR = "كلاودترك – تنظيم المعارض والدعاية والإعلان";

const VARIANTS = {
  full: { src: "/images/brand/cloudtrek-logo-full.png", width: 1162, height: 766 },
  navbar: { src: "/images/brand/cloudtrek-logo-navbar.png", width: 1117, height: 615 },
  emblem: { src: "/images/brand/cloudtrek-logo-emblem.png", width: 556, height: 476 },
} as const;

export type LogoVariant = keyof typeof VARIANTS;

export function CloudTrekLogo({
  variant = "navbar",
  className,
  href,
  priority = false,
  sizes,
}: {
  variant?: LogoVariant;
  /** Control size with a height or width class; the aspect ratio is preserved automatically. */
  className?: string;
  /** Wrap in a link (e.g. "/"). */
  href?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const v = VARIANTS[variant];
  const { locale } = useI18n();
  const img = (
    <Image
      src={v.src}
      alt={locale === "ar" ? LOGO_ALT_AR : LOGO_ALT}
      width={v.width}
      height={v.height}
      priority={priority}
      sizes={sizes}
      quality={85}
      className={cn("h-auto w-auto select-none", className)}
    />
  );
  return href ? (
    <Link href={href} aria-label={locale === "ar" ? "كلاودترك – الصفحة الرئيسية" : "Cloud Trek home"} className="inline-flex items-center">
      {img}
    </Link>
  ) : (
    img
  );
}
