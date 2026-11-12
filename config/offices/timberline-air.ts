import type { OfficeInput } from "../types";

/**
 * Fictional home-services demo: a heating and air conditioning company in Lakewood, CO (Denver). All
 * made up (name, people, 555-01xx phone, reviews); the demo banner says so.
 * Photos: public-domain stock (public/offices/HOME-SERVICES-PHOTO-CREDITS.txt).
 */
const timberlineAir: OfficeInput = {
  id: "timberline-air",
  stage: "demo",
  showcase: true,
  fictional: true,

  practice: {
    name: "Timberline Heating & Air",
    specialty: "hvac",
    logo: {
      text: "Timberline", mark: "Lakewood, CO", shape: "stacked",
      image: "/offices/timberline-air/logo.svg", width: 295, height: 176, icon: "/offices/timberline-air/icon.svg",
      bar: { image: "/offices/timberline-air/logo-bar.svg", width: 361, height: 96 },
    },
    yearsInPractice: 22,
    acceptingNewPatients: true,
    description:
      "A locally owned heating and air conditioning company in Lakewood, CO. Furnace and AC repair, new systems, tune-ups and maintenance plans across the west Denver metro.",
  },

  contact: {
    phone: "(303) 555-0177",
    email: "service@timberlineair.example",
    address: { street: "740 Garrison St", city: "Lakewood", region: "CO", postalCode: "80215", country: "US" },
    geo: { lat: 39.7277, lng: -105.1081 },
  },

  timezone: "America/Denver",
  hours: {
    mon: { open: "07:00", close: "19:00" },
    tue: { open: "07:00", close: "19:00" },
    wed: { open: "07:00", close: "19:00" },
    thu: { open: "07:00", close: "19:00" },
    fri: { open: "07:00", close: "19:00" },
    sat: { open: "08:00", close: "16:00" },
    sun: null,
  },

  doctors: [
    {
      name: "Dana Whitfield",
      title: "Owner & Lead Technician",
      bio: "Dana has fixed furnaces through two decades of Colorado winters. She started Timberline so homeowners would get straight answers on repair versus replace.",
      highlights: ["22 years in HVAC", "NATE-certified"],
    },
    {
      name: "Luis Romero",
      title: "Install Manager",
      bio: "Luis plans every new system install, from sizing it to your home to cleaning up after.",
      highlights: ["Heat pump specialist"],
    },
  ],

  services: [
    { id: "heating", name: "Furnace & Heating Repair", icon: "flame", short: "No heat? We get your home warm again, fast.", detail: "Furnaces, boilers and heat pumps, with a safety check on every visit, because a heating problem can be dangerous." },
    { id: "ac-repair", name: "AC Repair", icon: "snowflake", short: "Not cooling? We find the problem and fix it.", detail: "Warm air, odd noises or a unit that won’t start: we diagnose it and explain your options before any repair." },
    { id: "installation", name: "New Systems & Heat Pumps", icon: "house", short: "Right-sized heating and cooling, installed cleanly.", detail: "We size the system to your home, explain efficiency in plain words and give clear options and prices. Ask about available rebates." },
    { id: "maintenance", name: "Comfort Club Maintenance", icon: "calendar", short: "Two tune-ups a year and priority service.", detail: "A spring AC tune-up and a fall furnace tune-up, priority scheduling when something breaks, and reminders so you never have to remember." },
    { id: "air-quality", name: "Indoor Air Quality", icon: "wind", short: "Humidifiers, filters and purifiers for dry Colorado air.", detail: "Whole-home humidifiers and better filtration for dry winters, wildfire smoke, allergies and pets." },
    { id: "emergency", name: "Emergency Service", icon: "siren", short: "No heat in a cold snap? Call us.", detail: "When temperatures drop, a broken furnace can’t wait. Call and we’ll get to you as fast as we can." },
  ],

  rating: { value: 4.8, count: 312, source: "Google" },
  reviews: [
    { name: "Megan T.", rating: 5, text: "Furnace died the first cold night of the year. Dana came out that evening, found a cracked igniter and had heat back in an hour. Honest and fast.", meta: "Google review" },
    { name: "Brian & Sue L.", rating: 5, text: "Luis told us our old AC had a few good years left instead of selling us a new one. That’s why we called them when it finally did need replacing.", meta: "Customers since 2018" },
    { name: "Priya S.", rating: 5, text: "The Comfort Club is worth it. They remind us, show up on time, and we jumped the line in January when everyone else was waiting days.", meta: "Google review" },
    { name: "Tom H.", rating: 5, text: "Heat pump install was clean, quick and they walked us through the rebates. Our gas bill dropped noticeably.", meta: "Google review" },
    { name: "Angela W.", rating: 4, text: "Great tech, clear pricing, booked online. Would have liked an earlier arrival window but they called ahead.", meta: "Google review" },
  ],

  faqs: [
    { q: "Are you licensed and insured?", a: "Yes. Our technicians are licensed and certified, and we’re fully insured. We’re happy to share proof." },
    { q: "Should I repair or replace my furnace or AC?", a: "It depends on its age, how often it breaks and the cost of the repair. We’ll give you both options with prices and an honest recommendation." },
    { q: "What’s in the Comfort Club?", a: "Two tune-ups a year (AC in spring, furnace in fall), priority scheduling and reminders. Ask us for the current price." },
    { q: "Do you offer financing?", a: "Yes, for new systems. We’ll explain the options clearly, with no pressure." },
    { q: "Do heat pumps work in Colorado winters?", a: "Today’s cold-climate heat pumps work well in most Denver-area winters, often paired with a furnace for the coldest days. We’ll tell you honestly whether one fits your home." },
    { q: "Which areas do you serve?", a: "Lakewood and the west Denver metro: see the towns listed on this page. Not sure? Just call and ask." },
  ],

  areas: [
    { slug: "lakewood-co", town: "Lakewood", region: "CO" },
    { slug: "denver-co", town: "Denver", region: "CO" },
    { slug: "arvada-co", town: "Arvada", region: "CO" },
    { slug: "golden-co", town: "Golden", region: "CO" },
    { slug: "littleton-co", town: "Littleton", region: "CO" },
  ],

  heroImage: {
    src: "/offices/timberline-air/thermostat.webp",
    alt: "A hand adjusting a smart thermostat",
    position: "60% 50%",
    team: { src: "/offices/timberline-air/house-twilight.webp", alt: "A warm, well-lit home at dusk" },
  },
  // Stacked, centred logo: the phone hero centres everything around it, and the name fades into the bar.
  heroLayout: "bleed",
  nameMorph: "fade",

  social: { facebook: "https://facebook.com/", google: "https://maps.google.com/" },

  design: "cinnamon",
  theme: { preset: "warm-neutral", accent: "#a2412a" },
  sections: ["services", "gallery", "reviews", "newPatients", "doctors", "faq"],
  // Recent work: no photos yet, so each shows a clearly-marked "before/after photo here" placeholder.
  gallery: [
    { title: "Furnace replacement", caption: "20-year-old furnace swapped for a high-efficiency model" },
    { title: "Heat pump install", caption: "A quiet heat pump that heats and cools" },
    { title: "Duct cleanup", caption: "Tangled ductwork rerouted and sealed" },
  ],

  copy: {
    heroEyebrow: "Heating & cooling in Lakewood & west Denver",
    heroHeadline: "Warm winters, cool summers, honest prices.",
    heroHighlight: "honest prices",
    heroSubhead: "Furnace and AC repair, new systems and tune-ups from licensed, friendly technicians.",
    phoneNote: "Emergency service in extreme weather",
    comfortPerks: ["Licensed & insured", "Upfront pricing", "Comfort Club maintenance", "Financing available"],
  },
};

export default timberlineAir;
