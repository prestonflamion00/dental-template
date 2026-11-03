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

/** Always open the page, in this order: who you are, when you're open, how to request a visit. */
export const TOP_SECTIONS: SectionId[] = ["hero", "quickInfo", "request"];
/** Ordered per practice (by `sections`), between the fixed top and bottom. */
export const MIDDLE_SECTIONS: SectionId[] = ["services", "newPatients", "doctors", "reviews", "cta", "gallery", "emergency"];
/** Always close the page: FAQ (when shown), then contact and the map. */
export const BOTTOM_SECTIONS: SectionId[] = ["faq", "contact"];

/** Fixed top, the practice's chosen middle (minus sections with nothing to show), fixed bottom. */
export function resolveSections(o: Omit<OfficeConfig, "sections">, wanted?: SectionId[]): SectionId[] {
  const hasContent: Partial<Record<SectionId, boolean>> = {
    doctors: o.doctors.length > 0,
    // Demos always show it: real reviews, or obviously-sample cards marking where theirs will go.
    reviews: o.reviews.length > 0 || !!o.rating || o.stage === "demo",
    gallery: !!o.gallery?.length,
  };
  let middle = (wanted ?? MIDDLE_SECTIONS).filter((s) => MIDDLE_SECTIONS.includes(s) && hasContent[s] !== false);
  // The mid-page "request" band never sits right under the request form itself.
  if (middle[0] === "cta" && middle.length > 1) middle = [middle[1], "cta", ...middle.slice(2)];
  const faq = (!wanted || wanted.includes("faq")) && o.faqs.length > 0;
  return [...TOP_SECTIONS, ...middle, ...(faq ? (["faq"] as SectionId[]) : []), "contact"];
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

  const base: Omit<OfficeConfig, "sections"> = {
    ...input,
    stage,
    placeholders,
    practice: {
      name,
      tagline: input.practice.tagline ?? `Dental care in ${city}`,
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
      ...defaults.copy(name, city),
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
