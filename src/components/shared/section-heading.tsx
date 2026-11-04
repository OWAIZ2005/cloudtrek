import { Reveal } from "./reveal";
import SplitText from "@/components/reactbits/SplitText";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  id,
  intro,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  id?: string;
  intro?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal>
      <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h2 id={id} aria-label={title} className="display-2">
          <SplitText text={title} tag="span" splitType="words" effect="blur" delay={55} duration={0.8} threshold={0.2} textAlign={align === "center" ? "center" : "left"} />
        </h2>
        {intro && <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{intro}</p>}
      </div>
    </Reveal>
  );
}
