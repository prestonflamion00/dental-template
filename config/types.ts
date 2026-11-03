/**
 * OfficeConfig — the complete schema for one dental practice, as the site renders it.
 *
 * Office files in /config/offices are written as `OfficeInput` (only the name, phone, address
 * and timezone are required) and completed by `buildOffice` (config/build.ts): missing details
 * get generic dental content or a marked placeholder, so no section breaks when a fact is missing.
 */

import type { ThemePreset } from "./themes";
import type { Design } from "./designs";

/** Icon names available to services, steps and badges (see components/ui/Icon.tsx). */
export type IconName =
  | "tooth"
  | "sparkles"
  | "smile"
  | "shield"
  | "aligners"
  | "implant"
  | "siren"
  | "baby"
  | "heart"
  | "crown"
  | "stethoscope"
  | "calendar"
  | "clipboard"
  | "coffee"
  | "sun"
  | "leaf"
  | "star"
  | "scan"
  | "wand";

/**
 * Homepage sections. Some have fixed places (config/build.ts): hero, quick info and the request
 * form always open the page; FAQ and contact always close it. `sections` orders the rest.
 */
export type SectionId =
  | "hero"
  | "quickInfo"
  | "request"
  | "services"
  | "emergency"
  | "newPatients"
  | "doctors"
  | "cta"
  | "reviews"
  | "gallery"
  | "faq"
  | "contact";

export type Day = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

/** 24h "HH:MM" strings in the office's local timezone. `null` = closed all day. */
export type DayHours = { open: string; close: string } | null;

export interface Address {
  street: string;
  city: string;
  region: string; // state / province
  postalCode: string;
  country: string; // ISO code, e.g. "US"
}

/** One office. `locations[0]` is the main office (from `contact` and `hours`). */
export interface Location {
  /** Short name used when a practice has several offices, e.g. "Hudson". */
  name: string;
  phone: string;
  address: Address;
  hours: Record<Day, DayHours>;
  directionsNote?: string;
  geo?: { lat: number; lng: number };
}

/** Sets the default wording, services and FAQs for details an office file leaves out (config/generic.ts). */
export type Specialty = "general" | "orthodontics" | "pediatric";

export interface Doctor {
  name: string;
  /** Credentials shown after the name, e.g. "DDS" or "DMD, FAGD". */
  credentials: string;
  /** Role line, e.g. "Founder & General Dentist". */
  title: string;
  bio?: string;
  /** Path under /public, e.g. "/doctors/dr-lee.svg". Use a ~4:5 portrait. Without one, initials are shown. */
  photo?: string;
  /** Optional short facts shown as chips, e.g. ["UCSF graduate", "Speaks Spanish"]. */
  highlights?: string[];
}

export interface Service {
  /** Stable id used for anchors and the booking picker. */
  id: string;
  name: string;
  icon: IconName;
  /** One sentence for the card. */
  short: string;
  /** A few plain-language sentences for the detail modal. */
  detail: string;
  /** Optional bullet points in the detail modal. */
  points?: string[];
  /** Typical visit length in minutes (for a future online scheduler; not shown yet). */
  durationMin?: number;
}

export interface Review {
  name: string;
  text: string;
  /** 1–5 */
  rating: number;
  /** e.g. "Patient since 2019" or "Google review" */
  meta?: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Step {
  title: string;
  text: string;
  icon: IconName;
}

export interface GalleryItem {
  title: string;
  caption: string;
  before: string;
  after: string;
}

/**
 * "demo": a preview for a prospect (placeholders allowed; real practices get a "Private preview" line).
 * "live": a client's real site; the build refuses to run while any placeholder remains.
 */
export type Stage = "demo" | "live";

export interface OfficeConfig {
  /** Short slug, used for keys and analytics. */
  id: string;

  stage: Stage;

  /** Details filled with a stand-in because we didn't have them (keys in config/build.ts). Set by buildOffice. */
  placeholders: ("acceptingNewPatients" | "hours" | "services" | "insurances" | "siteUrl")[];

  /**
   * List this practice on the PUBLIC examples page. Leave it off for real
   * prospects: their link still works, but it isn't listed anywhere public.
   */
  showcase?: boolean;

  /**
   * Made-up practice used for demos. Shows a "fictional practice" banner on every page so
   * nobody mistakes it for a real office once it's live on a real domain.
   */
  fictional?: boolean;

  practice: {
    name: string;
    tagline: string;
    /** Text logo is the default. Set `image` (path under /public) to use an image logo instead. */
    logo: { text: string; mark?: string; image?: string };
    /** Shown only when known. */
    yearsInPractice?: number;
    acceptingNewPatients: boolean;
    /** Optional short description used for meta + footer. */
    description: string;
    specialty: Specialty;
  };

  contact: {
    phone: string; // display format, e.g. "(503) 555-0142"
    /** Shown only when known. */
    email?: string;
    address: Address;
    /** Name of the main office when there are several (default: its city). */
    locationName?: string;
    /** Optional lat/lng used by the JSON-LD schema. */
    geo?: { lat: number; lng: number };
    /** Free-text parking / access notes shown under the map. */
    directionsNote?: string;
  };

  /** IANA timezone of the office, used for the "Open now" indicator. */
  timezone: string;
  hours: Record<Day, DayHours>;

  /** Every office, main office first (built from `contact`, `hours` and `otherLocations`). */
  locations: Location[];

  doctors: Doctor[];
  services: Service[];
  insurances: string[];

  /** Google rating; the rating badges and reviews section hide without it. */
  rating?: { value: number; count: number; source: string };
  reviews: Review[];
  faqs: Faq[];

  /** Optional "Before & after" gallery. Images live in /public/gallery. */
  gallery?: GalleryItem[];

  booking: {
    /**
     * If set, every "Request appointment" button links here (e.g. a Zocdoc,
     * NexHealth, LocalMed or Dentrix booking page) instead of opening the
     * site's request form.
     */
    url?: string;
  };

  /** Link to the downloadable new patient forms (PDF in /public or external). */
  newPatientFormsUrl?: string;

  social: Partial<Record<"facebook" | "instagram" | "google" | "youtube" | "tiktok" | "yelp", string>>;

  /** Overall look (config/designs.ts). Defaults to "butter", which uses `theme` for its colours. */
  design?: Design;

  theme: {
    preset: ThemePreset;
    /** Optional brand color override, hex. Text colors adjust automatically to stay readable. */
    accent?: string;
  };

  /** Which homepage sections render, and in what order. */
  sections: SectionId[];

  /** Copy blocks — tone is warm, plain-language, no clinical claims. */
  copy: {
    heroEyebrow: string;
    heroHeadline: string;
    /** Word or phrase within heroHeadline to render in italic serif accent. */
    heroHighlight?: string;
    heroSubhead: string;
    servicesIntro: string;
    newPatientsIntro: string;
    firstVisitSteps: Step[];
    doctorsIntro: string;
    ctaHeadline: string;
    ctaText: string;
    emergencyHeadline: string;
    emergencyText: string;
    reviewsIntro: string;
    faqIntro: string;
    contactIntro: string;
    /** Small line under the phone number in the quick-info strip, e.g. "Same-day emergency visits". */
    phoneNote?: string;
    /** Intro under "Request an appointment"; a friendly default is used when left out. */
    requestIntro?: string;
    /** Small reassurance chips shown in the hero card. */
    comfortPerks: string[];
  };

  seo: {
    /** Canonical site URL, no trailing slash. */
    siteUrl: string;
    title: string;
    description: string;
    /** Price range for schema.org, e.g. "$$". */
    priceRange?: string;
  };
}

type DeepPartial<T> = { [K in keyof T]?: T[K] extends (infer U)[] ? U[] : T[K] extends object ? DeepPartial<T[K]> : T[K] };

/**
 * What an office file provides. Only `id`, the practice name, phone, address and timezone are
 * required; buildOffice fills everything else (see config/build.ts for what gets filled how).
 */
export type OfficeInput = DeepPartial<Omit<OfficeConfig, "placeholders" | "practice" | "contact" | "hours" | "locations">> & {
  id: string;
  practice: DeepPartial<OfficeConfig["practice"]> & { name: string };
  contact: Omit<OfficeConfig["contact"], "email"> & { email?: string };
  timezone: string;
  /** Leave out to show placeholder hours (marked as a placeholder). */
  hours?: Record<Day, DayHours>;
  /** More offices, if the practice has several. Each without `hours` gets placeholder hours. */
  otherLocations?: (Omit<Location, "hours"> & { hours?: Record<Day, DayHours> })[];
};
