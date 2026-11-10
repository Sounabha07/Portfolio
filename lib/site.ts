// Absolute site URL, used for canonical/Open Graph links, robots.txt and the sitemap.
// GitHub Pages: set by the deploy workflow (NEXT_PUBLIC_SITE_URL).
// Vercel: picked up automatically from the production domain.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

/** Path prefix the site is served under ("/Portfolio" on GitHub Pages, "" elsewhere). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-relative path (like "/resume.pdf") with the base path. Plain <a> links and window.open need this. */
export const withBase = (p: string) => (p.startsWith("/") ? basePath + p : p);
