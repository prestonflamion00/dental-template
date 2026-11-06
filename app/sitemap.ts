import type { MetadataRoute } from "next";
import office from "@/config/office";
import { doctorSlug } from "@/lib/format";

export const dynamic = "force-static";

/** Every page a practice actually links to: home, its extra pages when it has them, and the policies. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = office.seo.siteUrl;
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "monthly" | "yearly" = "monthly") => ({ url: `${base}${path}`, lastModified: now, changeFrequency, priority });
  return [
    page("/", 1),
    ...(office.catalog ? [page("/services/", 0.8), ...office.catalog.flatMap((c) => c.services.map((s) => page(`/services/${s.id}/`, 0.7)))] : []),
    ...(office.experiments?.doctorPages ? office.doctors.map((d) => page(`/doctors/${doctorSlug(d.name)}/`, 0.6)) : []),
    ...(office.staff?.length ? [page("/team/", 0.6)] : []),
    ...(office.billing ? [page("/billing/", 0.5)] : []),
    ...(office.careers ? [page("/careers/", 0.4)] : []),
    ...(office.areas ?? []).map((a) => page(`/areas/${a.slug}/`, 0.6)),
    page("/privacy", 0.3, "yearly"),
    page("/accessibility", 0.3, "yearly"),
  ];
}
