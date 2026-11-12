import type { OfficeInput } from "../types";

/**
 * Fictional home-services demo: a plumber in St. Petersburg, FL (Tampa Bay). Everything here is made
 * up (name, people, phone in the 555-01xx range, reviews) and the demo banner says so.
 * Photos: public-domain stock (public/offices/HOME-SERVICES-PHOTO-CREDITS.txt).
 */
const pelicanPlumbing: OfficeInput = {
  id: "pelican-plumbing",
  stage: "demo",
  showcase: true,
  fictional: true,

  practice: {
    name: "Pelican Point Plumbing",
    specialty: "plumbing",
    logo: { text: "Pelican Point", mark: "St. Petersburg, FL", image: "/offices/pelican-plumbing/logo.svg", width: 389, height: 96 },
    yearsInPractice: 14,
    acceptingNewPatients: true,
    description:
      "A family-owned plumbing company in St. Petersburg, FL. Licensed, insured plumbers for drains, leaks, water heaters, repiping and 24/7 emergencies across Pinellas County.",
  },

  contact: {
    phone: "(727) 555-0148",
    email: "hello@pelicanpointplumbing.example",
    address: { street: "4120 Central Ave", city: "St. Petersburg", region: "FL", postalCode: "33711", country: "US" },
    geo: { lat: 27.7708, lng: -82.6876 },
  },

  timezone: "America/New_York",
  hours: {
    mon: { open: "07:00", close: "18:00" },
    tue: { open: "07:00", close: "18:00" },
    wed: { open: "07:00", close: "18:00" },
    thu: { open: "07:00", close: "18:00" },
    fri: { open: "07:00", close: "18:00" },
    sat: { open: "08:00", close: "14:00" },
    sun: null,
  },

  doctors: [
    {
      name: "Marco Delgado",
      title: "Owner & Master Plumber",
      bio: "Marco started Pelican Point after 10 years working for big companies, so customers would get the same plumber who answers the phone. He still runs most emergency calls himself.",
      highlights: ["Master plumber", "St. Pete native", "Habla español"],
    },
    {
      name: "Tasha Greene",
      title: "Lead Service Plumber",
      bio: "Tasha handles water heaters and repipes, and she’s known for explaining every option before she touches a wrench.",
      highlights: ["Water heater specialist", "8 years with us"],
    },
  ],

  rating: { value: 4.9, count: 186, source: "Google" },
  reviews: [
    { name: "Renee K.", rating: 5, text: "Pipe burst under our kitchen sink at 10pm. Marco picked up, talked me through shutting off the water and was here in 40 minutes. Fair price, no upsell.", meta: "Google review" },
    { name: "Jason P.", rating: 5, text: "Got three quotes for a new water heater. Pelican Point explained the options best and came in under the other two. Tasha left the garage cleaner than she found it.", meta: "Google review" },
    { name: "The Okafor family", rating: 5, text: "They repiped our 1950s house in two days and patched every hole. Clear schedule, clear price, and they showed up exactly when they said.", meta: "Customers since 2019" },
    { name: "Linda M.", rating: 5, text: "Slow drains for months. They ran a camera, showed me the root problem on a screen and fixed it the same visit.", meta: "Google review" },
    { name: "Carlos R.", rating: 4, text: "Quick, friendly and honest about what didn’t need replacing. Booked online in a minute.", meta: "Google review" },
  ],

  areas: [
    { slug: "st-petersburg-fl", town: "St. Petersburg", region: "FL" },
    { slug: "clearwater-fl", town: "Clearwater", region: "FL" },
    { slug: "largo-fl", town: "Largo", region: "FL" },
    { slug: "pinellas-park-fl", town: "Pinellas Park", region: "FL" },
    { slug: "seminole-fl", town: "Seminole", region: "FL" },
  ],

  heroImage: {
    src: "/offices/pelican-plumbing/kitchen-sink.webp",
    alt: "A bright kitchen sink with a new faucet",
    position: "50% 60%",
    team: { src: "/offices/pelican-plumbing/hero-wrenches.webp", alt: "Plumbing wrenches on a copper and steel pipe" },
  },
  heroLayout: "bleed",

  social: { facebook: "https://facebook.com/", google: "https://maps.google.com/" },

  design: "honey",
  theme: { preset: "sage-blue", accent: "#1f5d86" },
  sections: ["services", "gallery", "reviews", "newPatients", "doctors", "faq"],
  // Recent work: no photos yet, so each shows a clearly-marked "before/after photo here" placeholder.
  gallery: [
    { title: "Water heater swap", caption: "Old 40-gallon tank out, new one in the same day" },
    { title: "Bathroom repipe", caption: "Corroded galvanized lines replaced with PEX" },
    { title: "Kitchen drain", caption: "Slow drain cleared and the trap rebuilt" },
  ],

  copy: {
    heroEyebrow: "Plumbing in St. Petersburg & Pinellas County",
    heroHeadline: "Plumbing fixed right, the first time.",
    heroHighlight: "the first time",
    heroSubhead: "Licensed plumbers, upfront prices and a real person on the phone, day or night.",
    phoneNote: "24/7 emergency line",
    comfortPerks: ["Licensed & insured", "Upfront pricing", "24/7 emergencies", "Clean, on-time plumbers"],
    ctaText: "Request service online or call. Most jobs are scheduled the same or next day.",
  },
};

export default pelicanPlumbing;
