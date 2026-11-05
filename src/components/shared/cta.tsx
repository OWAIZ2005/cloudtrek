import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Magnet from "@/components/reactbits/Magnet";

type Variant = "navy" | "red" | "outline" | "light" | "link";

const base =
  "group/cta relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium tracking-wide transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy";
const variants: Record<Variant, string> = {
  navy: "bg-navy px-6 py-3.5 text-white hover:bg-navy-deep",
  red: "bg-brand-red px-6 py-3.5 text-white hover:bg-[#a92f37]",
  outline: "border border-navy/30 px-6 py-3.5 text-navy hover:border-navy hover:bg-navy hover:text-white",
  light: "bg-white px-6 py-3.5 text-navy hover:bg-offwhite",
  link: "px-0 py-1 text-navy hover:text-brand-red",
};

export function ctaClass(variant: Variant = "navy", className?: string) {
  return cn(base, variants[variant], className);
}

export function CtaLink({
  href,
  variant = "navy",
  className,
  children,
  arrow = true,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  arrow?: boolean;
}) {
  const link = (
    <Link href={href} className={ctaClass(variant, className)}>
      {children}
      {arrow && (
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover/cta:-translate-x-0.5"
        />
      )}
    </Link>
  );
  // React Bits Magnet: subtle pull on pointer devices for prominent CTAs (no effect on touch).
  if (variant === "link") return link;
  return (
    <Magnet magnetStrength={5} padding={36} wrapperClassName={cn("inline-block", className?.includes("w-full") && "block w-full")}>
      {link}
    </Magnet>
  );
}
