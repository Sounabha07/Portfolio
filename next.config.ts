import type { NextConfig } from "next";

// The site is fully static: `next build` writes plain HTML/CSS/JS to out/.
// BASE_PATH is set by the GitHub Pages workflow (the site lives at /Portfolio/ there);
// local builds and Vercel leave it empty and serve from the root.
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
