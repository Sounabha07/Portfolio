// Absolute site URL, used for canonical/Open Graph links, robots.txt and the sitemap.
// On Vercel this is picked up automatically from the production domain.
// To use a custom domain, set NEXT_PUBLIC_SITE_URL (e.g. https://sounabha.dev) in Vercel's env settings.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
