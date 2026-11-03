/**
 * buildOffice: turns an office file (OfficeInput, often incomplete) into the full OfficeConfig the
 * site renders, so a missing detail never leaves a broken section.
 *
 *   Missing detail          What the site shows
 *   hours                   typical hours                        (placeholder)
 *   insurances              made-up plan names                   (placeholder)
 *   services                everyday general dentistry           (placeholder)
 *   acceptingNewPatients    "Accepting new patients"             (placeholder until confirmed)
 *   copy, steps, FAQs       friendly generic wording             (generic, fine to ship)
 *   doctors                 team section hidden; "the {name} team" elsewhere
 *   rating / reviews        rating badges hidden; reviews section shows what exists (demo: a note
 *                           that Google reviews appear there)
 *   yearsInPractice, email  left out
 *
 * Placeholders are recorded in `placeholders`. A "live" office (the default) refuses to build while
 * any remain, so a stand-in can never reach a client's real site.
 *
 * Section order is partly fixed (`resolveSections`), whatever the office file lists.
 */
import { GENERIC_FAQS, GENERIC_PERKS, GENERIC_SERVICES, GENERIC_STEPS, PLACEHOLDER_HOURS, PLACEHOLDER_INSURANCES, genericCopy } from "./generic.ts";
import type { OfficeConfig, OfficeInput, SectionId } from "./types.ts";

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
    reviews: o.reviews.length > 0 || !!o.rating,
    gallery: !!o.gallery?.length,
  };
  let middle = (wanted ?? MIDDLE_SECTIONS).filter((s) => MIDDLE_SECTIONS.includes(s) && hasContent[s] !== false);
  // The mid-page "request" band never sits right under the request form itself.
  if (middle[0] === "cta" && middle.length > 1) middle = [middle[1], "cta", ...middle.slice(2)];
  const faq = (!wanted || wanted.includes("faq")) && o.faqs.length > 0;
  return [...TOP_SECTIONS, ...middle, ...(faq ? (["faq"] as SectionId[]) : []), "contact"];
}

export function buildOffice(input: OfficeInput): OfficeConfig {
  const placeholders: string[] = [];
  const stand = <T,>(value: T | undefined, fallback: T, label: string): T => {
    if (value !== undefined) return value;
    placeholders.push(label);
    return fallback;
  };
  const { name } = input.practice;
  const { city, region } = input.contact.address;
  const stage = input.stage ?? "live";
  const description = input.practice.description ?? `${name} is a dental practice in ${city}, ${region}.`;

  const base: Omit<OfficeConfig, "sections"> = {
    ...input,
    stage,
    placeholders,
    practice: {
      name,
      tagline: input.practice.tagline ?? `Dental care in ${city}`,
      logo: { text: name, ...input.practice.logo },
      yearsInPractice: input.practice.yearsInPractice,
      acceptingNewPatients: stand(input.practice.acceptingNewPatients, true, "accepting new patients"),
      description,
    },
    contact: input.contact,
    hours: stand(input.hours, PLACEHOLDER_HOURS, "hours"),
    doctors: input.doctors ?? [],
    services: stand(input.services?.length ? input.services : undefined, GENERIC_SERVICES, "services"),
    insurances: stand(input.insurances?.length ? input.insurances : undefined, PLACEHOLDER_INSURANCES, "insurance plans"),
    rating: input.rating?.value && input.rating.count ? { value: input.rating.value, count: input.rating.count, source: input.rating.source ?? "Google" } : undefined,
    reviews: input.reviews ?? [],
    faqs: input.faqs?.length ? input.faqs : GENERIC_FAQS,
    booking: input.booking ?? {},
    social: input.social ?? {},
    theme: { preset: "warm-neutral", ...input.theme },
    copy: {
      ...genericCopy(name, city),
      firstVisitSteps: GENERIC_STEPS,
      comfortPerks: GENERIC_PERKS,
      ...input.copy,
    },
    seo: {
      siteUrl: stand(input.seo?.siteUrl, `https://demos.butterbite.workers.dev/${input.id}`, "site address"),
      title: `${name} | Dentist in ${city}, ${region}`,
      description,
      ...input.seo,
    },
  } as Omit<OfficeConfig, "sections">;

  if (stage === "live" && placeholders.length) {
    throw new Error(
      `${input.id} is a live site but still has placeholder ${placeholders.join(", ")}. ` +
        `Add the real details to config/offices/${input.id}.ts, or set stage: "demo".`,
    );
  }
  return { ...base, sections: resolveSections(base, input.sections) };
}
