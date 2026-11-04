"use client";

import BlurText from "@/components/reactbits/BlurText";
import DotGrid from "@/components/reactbits/DotGrid";

/**
 * Hero headline: React Bits BlurText. The full sentence is rendered in an
 * sr-only node by the component, so it stays readable without animation.
 */
export function HeroHeadline({ text }: { text: string }) {
  return (
    <div role="heading" aria-level={1}>
      <BlurText
        text={text}
        animateBy="words"
        direction="bottom"
        delay={90}
        stepDuration={0.4}
        blur={8}
        distance={28}
        trigger="load"
        className="display-1 gap-x-[0.22em]"
      />
    </div>
  );
}

/** Subtle React Bits DotGrid texture, kept very light so product imagery leads. */
export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden opacity-70 [mask-image:linear-gradient(to_right,black,transparent_60%)] md:block">
      <DotGrid
        dotSize={2}
        gap={26}
        baseColor="#d3dbe8"
        activeColor="#c43b43"
        proximity={110}
        shockRadius={140}
        shockStrength={2}
        className="size-full"
      />
    </div>
  );
}
