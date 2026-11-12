import type { CatalogService, OfficeConfig, ServiceCategory } from "@/config/types";

/**
 * The practice's full list of services: its catalog when it has one, otherwise its service cards as
 * one group (so every practice gets service pages, whether or not they're linked).
 */
export function allCategories(o: OfficeConfig): ServiceCategory[] {
  if (o.catalog?.length) return o.catalog;
  return [
    {
      id: "services",
      name: "Services",
      services: o.services.map((s) => ({ id: s.id, name: s.name, summary: s.short, body: [["p", s.detail]] })),
    },
  ];
}

export function findService(o: OfficeConfig, id: string): { service: CatalogService; category: ServiceCategory } | undefined {
  for (const category of allCategories(o)) {
    const service = category.services.find((s) => s.id === id);
    if (service) return { service, category };
  }
}
