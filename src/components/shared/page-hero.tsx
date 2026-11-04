import Image from "next/image";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt = "",
  children,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-b border-line", className)}>
      <div className={cn("container-x grid gap-10 py-14 lg:py-20", image && "lg:grid-cols-12 lg:items-end")}>
        <Reveal distance={24} className={image ? "lg:col-span-7" : ""}>
          <p className="eyebrow mb-5">{eyebrow}</p>
          <h1 className="display-1 !text-[clamp(2.4rem,5.6vw,4.75rem)]">{title}</h1>
          {intro && <p className="mt-6 max-w-2xl text-base leading-relaxed text-charcoal/75 sm:text-lg">{intro}</p>}
          {children && <div className="mt-8">{children}</div>}
        </Reveal>
        {image && (
          <Reveal className="lg:col-span-5" delay={0.1} distance={28}>
            <div className="img-zoom relative aspect-[4/3] overflow-hidden bg-offwhite lg:aspect-[5/4]">
              <Image src={image} alt={imageAlt} fill priority sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
