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
  | "wand"
  // Home services
  | "wrench" | "droplet" | "flame" | "snowflake" | "fan" | "thermometer" | "house" | "trees" | "shovel"
  | "sprout" | "truck" | "bath" | "waves" | "zap" | "hammer" | "flower" | "clock" | "dollar" | "search"
  | "vent" | "fence" | "shower" | "toilet" | "wind" | "scissors";

/**
 * Homepage sections. Some have fixed places (config/build.ts): hero and quick info open the page;
 * the request form, FAQ and contact close it. `sections` orders the rest. Emergency info is a
 * pop-up (the "Emergency?" button), not a section.
 */
export type SectionId =
  | "hero"
  | "quickInfo"
  | "request"
  | "services"
  | "newPatients"
  | "doctors"
  | "reviews"
  | "gallery"
  | "video"
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
  /** Their Google Maps listing ID (Places API "id"), so Directions lands on the listing itself, not a street pin. */
  placeId?: string;
  /** Name shown on maps (the practice name); filled in by the build. */
  label?: string;
}

/** Sets the default wording, services and FAQs for details an office file leaves out (config/generic.ts). */
export type Specialty = "general" | "orthodontics" | "pediatric" | "plumbing" | "hvac" | "landscaping";

/**
 * The words the site uses for this kind of business (config/generic.ts sets them per specialty; an
 * office file can override any). Dental: patients and appointments; home services: customers and
 * service calls or estimates.
 */
export interface Terms {
  /** "Dentist", "Plumber": page titles such as "Plumber in Clearwater, FL". */
  trade: string;
  /** "dental care", "plumbing": "Plumbing in Clearwater". */
  craft: string;
  /** "a dental office", "a plumbing company": the demo banner and default description. */
  business: string;
  customer: string;
  customers: string;
  /** The main button: "Request appointment", "Request service", "Get a free estimate". */
  request: string;
  /** The short version on the phone's sticky bar: "Request visit", "Request service", "Free estimate". */
  requestShort: string;
  /** The form's heading: "Request an appointment". */
  requestTitle: string;
  /** Small label above it: "Appointments". */
  requestEyebrow: string;
  /** The form's first tab: "Appointment", "Service", "Estimate". */
  requestKind: string;
  /** Email subject start: "Appointment request". */
  requestSubject: string;
  /** "I’m a new patient". */
  newCustomer: string;
  /** Whether insurance fields and the insurance list show (dental only). */
  insurance: boolean;
  /** What not to type in the form. */
  privacyNote: string;
  /** Side note next to the form: why requesting online is easy. */
  requestAside: { title: string; text: string };
  /** The red button's label, or null for businesses without emergencies (no red button anywhere). */
  emergency: string | null;
  /** Under the emergency pop-up: when to call 911 instead. */
  emergencyWarning: string;
  /** "Accepting new patients", "Taking new customers". */
  accepting: string;
  /** Nav label and section heading for the first-visit section. */
  newCustomersNav: string;
  newCustomersEyebrow: string;
  newCustomersTitle: string;
  /** "dentists", "team": "Meet our 4 dentists". */
  team: string;
  teamTitle: string;
  reviewsEyebrow: string;
  reviewsTitle: string;
  servicesTitle: string;
  servicesNote: string;
  servicesPageTitle: string;
  galleryEyebrow: string;
  galleryIntro: string;
  galleryNote: string;
  /** Footer disclaimer, if any. */
  disclaimer: string | null;
  /** schema.org type for Google: "Dentist", "Plumber", "HVACBusiness", "HomeAndConstructionBusiness". */
  schemaType: string;
  /** The trade's icon, used in the text logo and the hero card. */
  icon: IconName;
}

export interface Doctor {
  name: string;
  /** Credentials shown after the name, e.g. "DDS" or "DMD, FAGD"; left out when not publicly known. */
  credentials?: string;
  /** Longer bio for the doctor's own page (paragraphs), when the practice has doctor pages. */
  about?: string[];
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
  /** With a full catalog: the page "Learn more" opens, e.g. "/services/implants/" or "/services/#gum-care". */
  page?: string;
  /** A few plain-language sentences for the detail modal. */
  detail: string;
  /** Optional bullet points in the detail modal. */
  points?: string[];
  /** Typical visit length in minutes (for a future online scheduler; not shown yet). */
  durationMin?: number;
}

/** A block of a content page: a heading, a paragraph or a bullet point. */
export type ContentBlock = ["h" | "p" | "li", string];

/** One service in a practice's full list, with its own page. */
export interface CatalogService {
  id: string;
  name: string;
  /** One sentence for lists. */
  summary: string;
  body: ContentBlock[];
}

/** A group in the full list of services (e.g. "Preventive care"). */
export interface ServiceCategory {
  id: string;
  name: string;
  intro?: string;
  services: CatalogService[];
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
  /** Leave out on a demo to show a clearly-marked "before photo here" placeholder. */
  before?: string;
  after?: string;
}

/**
 * "demo": a preview for a prospect (placeholders allowed; real practices get a "Private preview" line).
 * "live": a client's real site; the build refuses to run while any placeholder remains.
 */
export type Stage = "demo" | "live";

export interface OfficeConfig {
  /** Words for this kind of business (see Terms). */
  terms: Terms;
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
    /**
     * Text logo is the default. Set `image` (path under /public) to use their logo artwork instead, but
     * only when it clearly spells out the practice name, since it replaces the text (and the `mark`
     * line) in the bar and the phone hero. `width`/`height`: the image's pixel size.
     */
    logo: { text: string; mark?: string; image?: string; width?: number; height?: number };
    /** Shown only when known. */
    yearsInPractice?: number;
    acceptingNewPatients: boolean;
    /** Optional short description used for meta + footer. */
    description: string;
    specialty: Specialty;
    /**
     * Where the practice serves, as it says it in its own words (e.g. "the Twin Cities"). Optional:
     * by default the offices' towns are named (up to 3), or the state with more. Required only when
     * 4+ offices span more than one state, since there's no safe automatic wording for that.
     */
    area?: string;
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
    /** Their Google Maps listing ID (Places API "id"): Directions opens that listing, not a street pin. */
    placeId?: string;
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

  /** Features being tried on one practice before they go to every site. */
  /**
   * Optional hero photo (path under /public): the business's own office, team or work (never stock on a real business's site; fictional samples use public-domain stock). Desktop
   * shows it in a framed card beside the headline; phones show it above the headline where it fits.
   */
  heroImage?: {
    src: string;
    alt: string;
    /** CSS object-position, e.g. "50% 40%". */
    position?: string;
    /** Line under the small photo card on computers; "Our office · <street>" for dental, the tagline otherwise. */
    caption?: string;
    /**
     * Optional team photo: when set it greets visitors first (the big hero card on bigger screens,
     * the first image on phones) and the building photo sits alongside it.
     */
    team?: { src: string; alt: string };
  };

  /**
   * Optional full list of services, grouped (for practices that offer a lot). The home page keeps
   * the highlight cards and adds a compact "everything we offer" list; each service gets its own page.
   */
  catalog?: ServiceCategory[];

  /** Optional team beyond the doctors (hygienists, assistants, front office): their own page, /team/. */
  staff?: { name: string; role: string; photo?: string }[];

  /** Optional payments & financing page (/billing/): online bill pay, accepted payments, financing partners. */
  billing?: {
    payUrl?: string;
    methods: string[];
    financing?: { name: string; url: string }[];
    intro?: string;
  };

  /** Optional careers page (/careers/). */
  careers?: {
    intro: string;
    applyUrl: string;
    jobs: { title: string; type?: string; pay?: string; perks: string[]; details: string[] }[];
  };

  /** Optional pages for nearby towns the practice serves (/areas/<slug>/), e.g. "washington-in". */
  areas?: { slug: string; town: string; region: string }[];

  /**
   * Phones: photo-first hero. The photo (or, on demos without one, a placeholder) leads the first
   * screen; the headline is smaller and the subhead steps aside. "card": a rounded photo card;
   * "bleed": edge to edge, fading into the page; "soft": no frame, soft edges, centered text.
   */
  heroLayout?: "card" | "bleed" | "soft";

  /**
   * Phones with a big hero name (heroLayout): how it hands over to the top bar as you scroll.
   * "glide" (default): it flies into the bar's logo; "fade": iPhone large-title style; "expand":
   * the call/menu capsule stretches into the full bar.
   */
  nameMorph?: "glide" | "fade" | "expand";

  /** Optional video tour (their own, path under /public), shown in its own section with a still frame until played. */
  video?: { src: string; poster: string; title: string; caption?: string };

  /**
   * Prospects only: the private page we send them (/welcome/), with the automatic walkthrough of
   * their demo (scripts/demo-video/record.mjs) and the highlights of their First Bite snapshot.
   * Not linked from the site and kept out of search.
   */
  welcome?: {
    /** How we address them, e.g. "Dr. Herman". */
    greeting: string;
    video: string;
    poster: string;
    captions: string;
    /** Our shared "who we are" clip, once it's recorded. */
    intro?: { video: string; poster: string };
    snapshot?: { score: number; band: string; url: string; findings: string[] };
  };

  experiments?: {
    /** The pen underline that draws itself under the hero headline's highlight. On unless set to false. */
    smileLine?: boolean;
    /** Each doctor gets their own page (/doctors/<name>/), and the team cards link to it. */
    doctorPages?: boolean;
  };

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
