// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Force Turbopack to treat THIS folder as the root
    root: __dirname,
  },
};

export default nextConfig;
