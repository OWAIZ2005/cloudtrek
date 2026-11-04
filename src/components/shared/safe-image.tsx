"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const FALLBACK = "/images/hero/gift-boxes-ribbon.jpg";

/** next/image with a graceful fallback if the source fails to load. */
export function SafeImage({ src, alt, ...rest }: ImageProps) {
  const [failed, setFailed] = useState(false);
  return <Image {...rest} src={failed ? FALLBACK : src} alt={alt} quality={75} onError={() => setFailed(true)} />;
}
