import type { OfficeConfig } from "@/config/types";

/** Town pages (/areas/<slug>/): the practice's list, or one for its own town when it has none. */
export function areaList(office: Pick<OfficeConfig, "areas" | "contact">) {
  const a = office.contact.address;
  return office.areas?.length
    ? office.areas
    : [{ slug: `${a.city}-${a.region}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"), town: a.city, region: a.region }];
}

/** The town page for the main office's own town (falls back to the first town page). */
export function homeArea(office: Pick<OfficeConfig, "areas" | "contact">) {
  const list = areaList(office);
  const city = office.contact.address.city.toLowerCase();
  return list.find((x) => x.town.toLowerCase() === city) ?? list[0];
}
