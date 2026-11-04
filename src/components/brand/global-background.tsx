"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

/** React Bits FluxLines (WebGL2). Loaded client-side only, one shared instance for the whole site. */
const FluxLines = dynamic(() => import("@/components/reactbits/FluxLines"), { ssr: false });

type Capability = "pending" | "webgl" | "static";
let cached: Capability | null = null;

function detect(): Capability {
  if (cached) return cached;
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    const nav = navigator as Navigator & { deviceMemory?: number };
    const weak = (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2;
    cached = gl && !weak ? "webgl" : "static";
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cached = "static";
  }
  return cached;
}

const noopSubscribe = () => () => {};

/**
 * Global animated background identity. Mounted once in the root layout so it persists
 * across route changes. Purely presentational: fixed, behind content, pointer-events
 * disabled (FluxLines listens on `window`, so mouse/click effects still work).
 * Falls back to a static brand-coloured line texture without WebGL2 or on weak devices.
 */
export function GlobalBackground() {
  const pathname = usePathname();
  const capability = useSyncExternalStore<Capability>(noopSubscribe, detect, () => "pending");

  // The admin interface prioritises legibility and performance: no animated background there.
  if (pathname.startsWith("/admin") || capability === "pending") return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {capability === "webgl" ? (
        <FluxLines
          colors={["#C43B43", "#173B70", "#173B70"]}
          speed={0.3}
          scale={1.6}
          turbulence={0.8}
          fluidity={0.1}
          glow={1.6}
          rimWidth={0.16}
          lineWidth={1}
          sharpness={3}
          shimmer={1.2}
          flowDirection="down"
          mouseInteraction
          mouseStrength={0.7}
          mouseRadius={0.35}
          mouseDampening={0.2}
          clickSwirl
          intro
          lightMode
          transparent
          opacity={0.6}
          dpr={typeof window !== "undefined" && window.innerWidth < 768 ? 0.75 : 1}
        />
      ) : (
        <div
          className="size-full opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, #173B70 0 1px, transparent 1px 28px), repeating-linear-gradient(115deg, transparent 0 14px, #C43B43 14px 15px, transparent 15px 84px)",
          }}
        />
      )}
    </div>
  );
}
