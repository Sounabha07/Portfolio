import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Required for static export (output: "export").
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${siteUrl}/`, changeFrequency: "monthly", priority: 1 }];
}
