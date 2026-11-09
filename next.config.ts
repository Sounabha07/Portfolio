import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Inline the (small) CSS into the HTML so first paint doesn't wait on extra stylesheet requests.
  experimental: { inlineCss: true },
};

export default nextConfig;
