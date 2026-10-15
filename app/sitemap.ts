import type { MetadataRoute } from "next";
import office from "@/config/office";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = office.seo.siteUrl;
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/accessibility`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
