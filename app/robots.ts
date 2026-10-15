import type { MetadataRoute } from "next";
import office from "@/config/office";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${office.seo.siteUrl}/sitemap.xml`,
    host: office.seo.siteUrl,
  };
}
