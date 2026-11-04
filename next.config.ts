import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Bits FluxLines releases its WebGL context in cleanup; StrictMode's dev-only
  // simulated unmount would leave the canvas on a lost context (production is unaffected).
  reactStrictMode: false,
  // A stray lockfile in the user's home directory confuses workspace-root detection.
  turbopack: {
    root: path.resolve(__dirname),
    // Tailwind CSS v4 via its Turbopack loader (as configured by create-next-app).
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
  images: {
    qualities: [60, 75, 85],
    formats: ["image/avif", "image/webp"],
    // Supabase Storage (product / portfolio uploads) is allowed once configured.
    remotePatterns: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? [
          {
            protocol: "https",
            hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  experimental: {
    serverActions: { bodySizeLimit: "8mb" },
  },
};

export default nextConfig;
