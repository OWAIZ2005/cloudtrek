"use client";

import AnimatedContent, { type AnimatedContentProps } from "@/components/reactbits/AnimatedContent";

/** Cloud Trek defaults for React Bits AnimatedContent: restrained, once-only scroll reveals. */
export function Reveal({ children, distance = 36, duration = 0.8, delay = 0, ...rest }: AnimatedContentProps) {
  return (
    <AnimatedContent distance={distance} duration={duration} delay={delay} ease="power3.out" threshold={0.12} once {...rest}>
      {children}
    </AnimatedContent>
  );
}
