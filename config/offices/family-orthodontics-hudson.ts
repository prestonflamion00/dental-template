import type { OfficeInput } from "../types";

/**
 * Prospect demo for Family Orthodontics of Hudson (Hudson, MA). Real practice: built only from public
 * information (their site bracerus.com and directory listings, Nov 2026). Anything not listed here is
 * filled by buildOffice: placeholder insurance plans, sample reviews, and orthodontics wording.
 */
const familyOrthodonticsHudson: OfficeInput = {
  id: "family-orthodontics-hudson",
  stage: "demo",

  practice: {
    name: "Family Orthodontics of Hudson",
    tagline: "Orthodontics for kids, teens and adults",
    logo: { text: "Family Orthodontics", mark: "of Hudson" },
    description:
      "Family Orthodontics of Hudson offers braces, Invisalign and early treatment for kids, teens and adults in Hudson and North Cambridge, MA.",
    specialty: "orthodontics",
  },

  contact: {
    phone: "(978) 562-1234",
    address: { street: "118 Forest Ave, Suite 202", city: "Hudson", region: "MA", postalCode: "01749", country: "US" },
    locationName: "Hudson",
  },

  timezone: "America/New_York",
  // Hudson hours from their website (Monday and Wednesday they're in North Cambridge).
  hours: {
    mon: null,
    tue: { open: "09:00", close: "17:00" },
    wed: null,
    thu: { open: "09:00", close: "17:00" },
    fri: null,
    sat: null,
    sun: null,
  },

  // Second office: address from NPI and AAO listings, hours and phone from their website.
  otherLocations: [
    {
      name: "North Cambridge",
      phone: "(617) 625-1714",
      address: { street: "182 Elm St", city: "Cambridge", region: "MA", postalCode: "02140", country: "US" },
      directionsNote: "Near Davis Square.",
      hours: {
        mon: { open: "08:30", close: "17:00" },
        tue: null,
        wed: { open: "08:30", close: "17:00" },
        thu: null,
        fri: null,
        sat: null,
        sun: null,
      },
    },
  ],

  doctors: [
    {
      name: "Dr. Lakshmi Thalanki",
      credentials: "DMD, MS",
      title: "Orthodontist",
    },
  ],

  services: [
    {
      id: "braces",
      name: "Traditional Braces",
      icon: "smile",
      short: "Reliable, proven braces for every age.",
      detail: "Metal braces gently guide teeth into place over time. They work for nearly every kind of bite and crowding.",
    },
    {
      id: "invisalign",
      name: "Invisalign",
      icon: "aligners",
      short: "Clear aligners that are nearly invisible.",
      detail: "A series of clear, removable aligners straightens teeth without brackets or wires. Take them out to eat and brush.",
    },
    {
      id: "invisalign-teen",
      name: "Invisalign Teen",
      icon: "aligners",
      short: "Clear aligners made for busy teens.",
      detail: "The same clear-aligner approach, designed for teens, so treatment fits school, sports and photos.",
    },
    {
      id: "early-treatment",
      name: "Early Treatment",
      icon: "baby",
      short: "A head start for growing smiles.",
      detail: "Some bite and spacing problems are easier to fix while a child is still growing. We’ll tell you if waiting is better.",
    },
    {
      id: "adult-treatment",
      name: "Adult Treatment",
      icon: "heart",
      short: "It’s never too late for a straighter smile.",
      detail: "Braces and clear aligners work for adults too, with options that fit around work and life.",
    },
    {
      id: "emergency",
      name: "Emergency Care",
      icon: "siren",
      short: "Broken bracket or poking wire? Call us.",
      detail: "Most orthodontic problems aren’t urgent, but they can be uncomfortable. Call and we’ll help you fix it fast.",
    },
  ],

  // Their Google rating, as shown on Google Maps (Nov 2026).
  rating: { value: 4.7, count: 93, source: "Google" },

  design: "butter",
  // Their brand: blue lettering and pink teeth in the logo (bracerus.com). Pink-toned set + their blue.
  theme: { preset: "blush-sand", accent: "#066aab" },

  sections: ["services", "reviews", "doctors", "newPatients", "faq"],
};

export default familyOrthodonticsHudson;
