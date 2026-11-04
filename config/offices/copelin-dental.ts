import type { OfficeInput } from "../types";

/**
 * Prospect demo for Copelin Dental (Norman, OK). Real practice: built only from public information
 * (directory listings, Nov 2026; their own site was down). Anything not listed here is filled by
 * buildOffice: placeholder insurance plans, sample reviews, generic general-dentistry wording.
 */
const copelinDental: OfficeInput = {
  id: "copelin-dental",
  stage: "demo",

  practice: {
    name: "Copelin Dental",
    tagline: "Family dentistry in Norman",
    logo: { text: "Copelin Dental", mark: "Norman, Oklahoma" },
    description: "Copelin Dental offers cleanings, fillings, crowns, root canals and dentures for families in Norman, OK.",
  },

  contact: {
    phone: "(405) 801-3147",
    address: { street: "2408 Palmer Circle", city: "Norman", region: "OK", postalCode: "73069", country: "US" },
  },

  timezone: "America/Chicago",
  // From their website (as indexed by search engines) and Yelp; closed Wednesdays and weekends.
  hours: {
    mon: { open: "08:00", close: "15:00" },
    tue: { open: "08:00", close: "15:00" },
    wed: null,
    thu: { open: "08:00", close: "17:00" },
    fri: { open: "08:00", close: "15:00" },
    sat: null,
    sun: null,
  },

  doctors: [
    {
      name: "Dr. Rebecca Copelin",
      credentials: "DDS",
      title: "General Dentist",
      highlights: ["University of Oklahoma College of Dentistry, 2012"],
    },
  ],

  // Services named in directory listings (Nextdoor, PatientConnect365).
  services: [
    {
      id: "cleanings",
      name: "Cleanings & Exams",
      icon: "tooth",
      short: "Gentle cleanings and exams that keep small problems small.",
      detail: "A thorough cleaning, a careful exam and any X-rays you need, with a clear explanation of what we see.",
    },
    {
      id: "fillings",
      name: "Fillings",
      icon: "shield",
      short: "Tooth-colored fillings that blend right in.",
      detail: "We repair cavities with natural-looking materials and keep you comfortable the whole time.",
    },
    {
      id: "crowns",
      name: "Crowns",
      icon: "crown",
      short: "Strong, natural-looking repairs for damaged teeth.",
      detail: "A crown protects a weak or broken tooth so you can chew and smile with confidence.",
    },
    {
      id: "root-canals",
      name: "Root Canals",
      icon: "stethoscope",
      short: "Relief from tooth pain, and your tooth saved.",
      detail: "A root canal removes infection inside a tooth and relieves pain, so you can keep your natural tooth.",
    },
    {
      id: "dentures",
      name: "Dentures",
      icon: "smile",
      short: "Comfortable, natural-looking replacement teeth.",
      detail: "Full or partial dentures made to fit comfortably, so you can eat and smile with ease.",
    },
  ],

  // Their Google rating, as shown on Google Maps (Nov 2026).
  rating: { value: 4.9, count: 344, source: "Google" },

  design: "butter",
  theme: { preset: "warm-neutral" },

  sections: ["services", "reviews", "doctors", "newPatients", "faq"],
};

export default copelinDental;
