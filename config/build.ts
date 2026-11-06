/**
 * buildOffice: turns an office file (OfficeInput, often incomplete) into the full OfficeConfig the
 * site renders, so a missing detail never leaves a broken section.
 *
 *   Missing detail          What the site shows
 *   hours (any office)      typical hours                        (placeholder)
 *   insurances              made-up plan names                   (placeholder)
 *   services                everyday general dentistry           (placeholder)
 *   acceptingNewPatients    "Accepting new patients"             (placeholder until confirmed)
 *   copy, steps, FAQs       friendly generic wording for the      (generic, fine to ship)
 *                           practice's specialty (general, orthodontics, pediatric)
 *   doctors                 team section hidden; "the {name} team" elsewhere
 *   rating / reviews        rating badges hidden; reviews section shows what exists (demo: playful
 *                           sample cards that are obviously not real reviews)
 *   yearsInPractice, email  left out
 *
 * Placeholders are recorded in `placeholders`. A "live" office (the default) refuses to build while
 * any remain, so a stand-in can never reach a client's real site.
 *
 * Section order is partly fixed (`resolveSections`), whatever the office file lists.
 */
import { PLACEHOLDER_HOURS, PLACEHOLDER_INSURANCES, SPECIALTY } from "./generic.ts";
import type { Location, OfficeConfig, OfficeInput, SectionId } from "./types.ts";

/**
 * Page order follows the usual pattern for dental sites: who you are and how to reach you, then what
 * you do and why to trust you, then the request form once they've decided. Every "Request
 * appointment" button scrolls to the form, and the sticky bar on phones keeps it one tap away.
 */
/** Always open the page: who you are (with Request and Call buttons), then hours, location and phone. */
export const TOP_SECTIONS: SectionId[] = ["hero", "quickInfo"];
/** Ordered per practice (by `sections`), between the fixed top and bottom. */
export const MIDDLE_SECTIONS: SectionId[] = ["services", "reviews", "doctors", "newPatients", "gallery"];
/** Always close the page: the request form, FAQ (when shown), then contact and the map. */
export const BOTTOM_SECTIONS: SectionId[] = ["request", "faq", "contact"];

/** Fixed top, the practice's chosen middle (minus sections with nothing to show), fixed bottom. */
export function resolveSections(o: Omit<OfficeConfig, "sections">, wanted?: SectionId[]): SectionId[] {
  const hasContent: Partial<Record<SectionId, boolean>> = {
    doctors: o.doctors.length > 0,
    // Demos always show it: real reviews, or obviously-sample cards marking where theirs will go.
    reviews: o.reviews.length > 0 || !!o.rating || o.stage === "demo",
    gallery: !!o.gallery?.length,
  };
  const middle = (wanted ?? MIDDLE_SECTIONS).filter((s) => MIDDLE_SECTIONS.includes(s) && hasContent[s] !== false);
  const faq = (!wanted || wanted.includes("faq")) && o.faqs.length > 0;
  return [...TOP_SECTIONS, ...middle, "request", ...(faq ? (["faq"] as SectionId[]) : []), "contact"];
}

/** Placeholder keys (OfficeConfig.placeholders) and how the live-site error names them. */
export const PLACEHOLDER_LABELS = {
  acceptingNewPatients: "accepting new patients",
  hours: "hours",
  services: "services",
  insurances: "insurance plans",
  siteUrl: "site address",
} as const;
export type PlaceholderKey = keyof typeof PLACEHOLDER_LABELS;

export function buildOffice(input: OfficeInput): OfficeConfig {
  const placeholders: PlaceholderKey[] = [];
  const stand = <T,>(value: T | undefined, fallback: T, key: PlaceholderKey): T => {
    if (value !== undefined) return value;
    if (!placeholders.includes(key)) placeholders.push(key);
    return fallback;
  };
  const { name } = input.practice;
  const { city, region } = input.contact.address;
  const stage = input.stage ?? "live";
  const specialty = input.practice.specialty ?? "general";
  const defaults = SPECIALTY[specialty];
  const description = input.practice.description ?? `${name} is a dental practice in ${city}, ${region}.`;
  const hours = stand(input.hours, PLACEHOLDER_HOURS, "hours");
  const locations: Location[] = [
    { name: input.contact.locationName ?? city, phone: input.contact.phone, address: input.contact.address, hours, directionsNote: input.contact.directionsNote, geo: input.contact.geo },
    ...(input.otherLocations ?? []).map((l) => ({ ...l, hours: stand(l.hours, PLACEHOLDER_HOURS, "hours") })),
  ];
  const area = serviceArea(input.practice.area, locations, name);

  const base: Omit<OfficeConfig, "sections"> = {
    ...input,
    stage,
    placeholders,
    practice: {
      name,
      tagline: input.practice.tagline ?? `Dental care in ${area}`,
      logo: { text: name, ...input.practice.logo },
      yearsInPractice: input.practice.yearsInPractice,
      acceptingNewPatients: stand(input.practice.acceptingNewPatients, true, "acceptingNewPatients"),
      description,
      specialty,
    },
    contact: input.contact,
    hours,
    locations,
    doctors: input.doctors ?? [],
    services: stand(input.services?.length ? input.services : undefined, defaults.services, "services"),
    insurances: stand(input.insurances?.length ? input.insurances : undefined, PLACEHOLDER_INSURANCES, "insurances"),
    rating: input.rating?.value && input.rating.count ? { value: input.rating.value, count: input.rating.count, source: input.rating.source ?? "Google" } : undefined,
    reviews: input.reviews ?? [],
    faqs: input.faqs?.length ? input.faqs : defaults.faqs,
    booking: input.booking ?? {},
    social: input.social ?? {},
    theme: { preset: "warm-neutral", ...input.theme },
    copy: {
      ...defaults.copy(name, area),
      firstVisitSteps: defaults.steps,
      comfortPerks: defaults.perks,
      ...input.copy,
    },
    seo: {
      siteUrl: stand(input.seo?.siteUrl, `https://demos.butterbite.workers.dev/${input.id}`, "siteUrl"),
      title: `${name} | ${defaults.label} in ${city}, ${region}`,
      description,
      ...input.seo,
    },
  } as Omit<OfficeConfig, "sections">;

  if (stage === "live" && placeholders.length) {
    throw new Error(
      `${input.id} is a live site but still has placeholder ${placeholders.map((k) => PLACEHOLDER_LABELS[k]).join(", ")}. ` +
        `Add the real details to config/offices/${input.id}.ts, or set stage: "demo".`,
    );
  }
  return { ...base, sections: resolveSections(base, input.sections) };
}

/* ── Service area: the "Orthodontics in ___" wording ── */

const US_STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado", CT: "Connecticut",
  DE: "Delaware", DC: "Washington, DC", FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana",
  NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah",
  VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

/**
 * Up to 3 offices: name them all ("Hudson & North Cambridge", "A, B & C"). More than 3 in one state:
 * the state ("Massachusetts"). More than 3 across states: the practice must say it (`practice.area`),
 * ideally borrowed from how they describe their region on their own site.
 */
export function serviceArea(explicit: string | undefined, locations: Pick<Location, "name" | "address">[], practiceName: string): string {
  if (explicit) return explicit;
  const names = [...new Set(locations.map((l) => l.name))];
  if (names.length <= 3) return names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} & ${names.at(-1)}`;
  const states = [...new Set(locations.map((l) => l.address.region.toUpperCase()))];
  if (states.length === 1) return US_STATES[states[0]] ?? states[0];
  throw new Error(
    `${practiceName}: ${locations.length} offices across ${states.join(", ")}. Set practice.area to describe the region (borrow their own wording if they have it).`,
  );
}
