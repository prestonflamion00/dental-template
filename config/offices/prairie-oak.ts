import type { OfficeInput } from "../types";

/**
 * Fictional home-services demo: a landscaping company in Carmel, IN (Indianapolis). All made up
 * (name, people, 555-01xx phone, reviews); the demo banner says so. Landscaping has no emergencies,
 * so the site has no red Emergency button, and the main button asks for a free estimate.
 * Photos: public-domain stock (public/offices/HOME-SERVICES-PHOTO-CREDITS.txt).
 */
const prairieOak: OfficeInput = {
  id: "prairie-oak",
  stage: "demo",
  showcase: true,
  fictional: true,

  practice: {
    name: "Prairie Oak Landscaping",
    specialty: "landscaping",
    logo: {
      text: "Prairie Oak", mark: "Carmel, IN", shape: "seal",
      image: "/offices/prairie-oak/logo.svg", width: 200, height: 200, icon: "/offices/prairie-oak/icon.svg",
      bar: { image: "/offices/prairie-oak/logo-bar.svg", width: 339, height: 96 },
    },
    yearsInPractice: 11,
    acceptingNewPatients: true,
    description:
      "A family-owned landscaping company in Carmel, IN. Lawn care, landscape design, patios and seasonal cleanups across Hamilton County and north Indianapolis.",
  },

  contact: {
    phone: "(317) 555-0123",
    email: "hello@prairieoak.example",
    address: { street: "1320 S Rangeline Rd", city: "Carmel", region: "IN", postalCode: "46032", country: "US" },
    geo: { lat: 39.9614, lng: -86.1261 },
  },

  timezone: "America/Indiana/Indianapolis",
  hours: {
    mon: { open: "07:00", close: "17:00" },
    tue: { open: "07:00", close: "17:00" },
    wed: { open: "07:00", close: "17:00" },
    thu: { open: "07:00", close: "17:00" },
    fri: { open: "07:00", close: "17:00" },
    sat: { open: "08:00", close: "12:00" },
    sun: null,
  },

  doctors: [
    {
      name: "Ben & Kelsey Hartman",
      title: "Owners",
      bio: "Ben runs the crews and Kelsey designs the projects. They started Prairie Oak with one truck in 2015 and still walk every new property themselves.",
      highlights: ["Founded 2015", "Carmel residents"],
    },
  ],

  rating: { value: 4.9, count: 143, source: "Google" },
  reviews: [
    { name: "Stephanie R.", rating: 5, text: "Kelsey turned our bare backyard into the place we spend every evening. The paver patio and fire pit came out better than the drawing.", meta: "Google review" },
    { name: "Dan M.", rating: 5, text: "Weekly mowing for three years. Same crew, sharp lines, gate always latched. They text the day before.", meta: "Customers since 2022" },
    { name: "The Nguyen family", rating: 5, text: "Spring cleanup done in one day: beds edged, fresh mulch, shrubs shaped. The house looks brand new from the street.", meta: "Google review" },
    { name: "Gary L.", rating: 5, text: "Clear written estimate, started the week they said, finished on budget. Cleaned up every day. Rare these days.", meta: "Google review" },
    { name: "Rachel B.", rating: 4, text: "Love our new front beds. Took a few weeks to get on the schedule in May, but worth the wait.", meta: "Google review" },
  ],

  areas: [
    { slug: "carmel-in", town: "Carmel", region: "IN" },
    { slug: "fishers-in", town: "Fishers", region: "IN" },
    { slug: "westfield-in", town: "Westfield", region: "IN" },
    { slug: "zionsville-in", town: "Zionsville", region: "IN" },
    { slug: "indianapolis-in", town: "Indianapolis", region: "IN" },
  ],

  heroImage: {
    src: "/offices/prairie-oak/stone-path.webp",
    alt: "A curving stone path through a planted garden",
    position: "50% 60%",
    team: { src: "/offices/prairie-oak/lawn-house.webp", alt: "A freshly striped lawn in front of a white house" },
  },
  heroLayout: "bleed",
  // Round seal: on phones it overlaps the photo like a stamp, and the name fades into the bar.
  nameMorph: "fade",

  social: { facebook: "https://facebook.com/", instagram: "https://instagram.com/", google: "https://maps.google.com/" },

  design: "butter",
  theme: { preset: "sage-blue", accent: "#3f6b3a" },
  sections: ["services", "gallery", "reviews", "newPatients", "doctors", "faq"],
  // Recent work: no photos yet, so each shows a clearly-marked "before/after photo here" placeholder.
  gallery: [
    { title: "Backyard patio", caption: "Paver patio and planting beds" },
    { title: "Front yard refresh", caption: "New beds, edging and fresh mulch" },
    { title: "Lawn renovation", caption: "Patchy lawn aerated and overseeded" },
  ],

  copy: {
    heroEyebrow: "Landscaping in Carmel & Hamilton County",
    heroHeadline: "A yard you’ll love coming home to.",
    heroHighlight: "love coming home to",
    heroSubhead: "Design, patios, lawn care and seasonal cleanups from a local, insured crew. Free estimates.",
    comfortPerks: ["Licensed & insured", "Free written estimates", "Same crew every visit", "Tidy job sites"],
  },
};

export default prairieOak;
