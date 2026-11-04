import type { CSSProperties, ComponentType, HTMLAttributes } from "react";

/** Type declaration for the vendored React Bits FluxLines.jsx (props mirror its destructured defaults). */
export interface FluxLinesProps extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  colors?: string[];
  speed?: number;
  scale?: number;
  turbulence?: number;
  fluidity?: number;
  rimWidth?: number;
  sharpness?: number;
  shimmer?: number;
  glow?: number;
  lineWidth?: number;
  flowDirection?: "up" | "down" | "left" | "right";
  opacity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  mouseRadius?: number;
  mouseDampening?: number;
  clickSwirl?: boolean;
  intro?: boolean;
  lightMode?: boolean;
  transparent?: boolean;
  backgroundColor?: string;
  paused?: boolean;
  dpr?: number;
  mixBlendMode?: CSSProperties["mixBlendMode"];
  className?: string;
  style?: CSSProperties;
}

declare const FluxLines: ComponentType<FluxLinesProps>;
export default FluxLines;
