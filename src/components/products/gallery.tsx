"use client";

import { useState } from "react";
import { SafeImage } from "@/components/shared/safe-image";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden bg-offwhite">
        <SafeImage
          key={images[active]}
          src={images[active]}
          alt={name}
          fill
          priority
          sizes="(min-width:1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              className={cn("relative aspect-square overflow-hidden border bg-offwhite", i === active ? "border-navy" : "border-line opacity-80 hover:opacity-100")}
            >
              <SafeImage src={src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
