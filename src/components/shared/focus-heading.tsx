"use client";

import TrueFocus from "@/components/reactbits/TrueFocus";
import { cn } from "@/lib/utils";

/**
 * React Bits TrueFocus used for typographic emphasis. The heading keeps the full
 * sentence as its accessible name; the animated words are decorative (aria-hidden).
 * Blur is kept low and unfocused words stay legible. The animation stops under
 * prefers-reduced-motion (TrueFocus uses motion's useReducedMotion).
 */
export function FocusHeading({
  text,
  id,
  tone = "navy",
  as: Tag = "h2",
  className,
  align = "start",
}: {
  text: string;
  id?: string;
  tone?: "navy" | "light";
  as?: "h1" | "h2";
  className?: string;
  align?: "start" | "center";
}) {
  return (
    <Tag id={id} aria-label={text} className={cn("ct-focus", align === "center" && "ct-focus-center", tone === "light" && "!text-white", className)}>
      <span aria-hidden="true">
        <TrueFocus
          sentence={text}
          focusStyle="brackets"
          easing="smooth"
          blurAmount={2.5}
          unfocusedOpacity={0.7}
          borderColor="#C43B43"
          cornerSize={14}
          borderWidth={2}
          animationDuration={0.6}
          pauseBetweenAnimations={1.4}
        />
      </span>
    </Tag>
  );
}
