/**
 * OfficeConfig — the complete schema for one dental practice.
 *
 * Every piece of practice-specific content on the site comes from an object of
 * this type. To launch a new office, copy one of the files in /config/offices,
 * edit the values, and point /config/office.ts at it. No component code changes.
 */

import type { ThemePreset } from "./themes";

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

/** Homepage sections. Order in `sections` = order on the page. Omit one to hide it. */
export type SectionId =
  | "hero"
  | "quickInfo"
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

export interface Doctor {
  name: string;
  /** Credentials shown after the name, e.g. "DDS" or "DMD, FAGD". */
  credentials: string;
  /** Role line, e.g. "Founder & General Dentist". */
  title: string;
  bio: string;
  /** Path under /public, e.g. "/doctors/dr-lee.svg". Use a ~4:5 portrait. */
  photo: string;
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
  /** Typical visit length in minutes; drives the booking mock. */
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

export interface OfficeConfig {
  /** Short slug, used for keys and analytics. */
  id: string;

  /**
   * List this practice on the PUBLIC examples page. Leave it off for real
   * prospects: their link still works, but it isn't listed anywhere public.
   */
  showcase?: boolean;

  practice: {
    name: string;
    tagline: string;
    /** Text logo is the default. Set `image` (path under /public) to use an image logo instead. */
    logo: { text: string; mark?: string; image?: string };
    yearsInPractice: number;
    acceptingNewPatients: boolean;
    /** Optional short description used for meta + footer. */
    description: string;
  };

  contact: {
    phone: string; // display format, e.g. "(503) 555-0142"
    email: string;
    address: {
      street: string;
      city: string;
      region: string; // state / province
      postalCode: string;
      country: string; // ISO code, e.g. "US"
    };
    /** Optional lat/lng used by the JSON-LD schema. */
    geo?: { lat: number; lng: number };
    /** Free-text parking / access notes shown under the map. */
    directionsNote?: string;
  };

  /** IANA timezone of the office, used for the "Open now" indicator. */
  timezone: string;
  hours: Record<Day, DayHours>;

  doctors: Doctor[];
  services: Service[];
  insurances: string[];

  rating: { value: number; count: number; source: string };
  reviews: Review[];
  faqs: Faq[];

  /** Optional "Before & after" gallery. Images live in /public/gallery. */
  gallery?: GalleryItem[];

  booking: {
    /**
     * If set, every "Book Appointment" button links here (e.g. a Zocdoc,
     * NexHealth, LocalMed or Dentrix booking page) instead of opening the
     * built-in booking mock.
     */
    url?: string;
    /** Slot length for the booking mock. */
    slotMinutes: number;
  };

  /** Link to the downloadable new patient forms (PDF in /public or external). */
  newPatientFormsUrl?: string;

  social: Partial<Record<"facebook" | "instagram" | "google" | "youtube" | "tiktok" | "yelp", string>>;

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
