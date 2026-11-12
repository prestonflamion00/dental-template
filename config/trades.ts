/**
 * Default content for home-services businesses (plumbing, HVAC, landscaping): services, FAQs,
 * "what to expect" steps, reassurance chips, copy and wording (Terms). Used by config/generic.ts
 * when an office file leaves these out. Built from what homeowners look for before calling:
 * licensed and insured, reviews, fast response, upfront pricing, real photos of the work.
 * Generic statements only: never a license number, price, warranty length or claim we can't back.
 */
import type { Faq, Service, Step, Terms } from "./types.ts";

type Copy = {
  heroEyebrow: string; heroHeadline: string; heroHighlight?: string; heroSubhead: string; servicesIntro: string;
  newPatientsIntro: string; doctorsIntro: string; ctaHeadline: string; ctaText: string; emergencyHeadline: string;
  emergencyText: string; reviewsIntro: string; faqIntro: string; contactIntro: string;
};

/** Wording shared by every home-services trade; each trade overrides what differs. */
const homeTerms = (o: Partial<Terms> & Pick<Terms, "trade" | "craft" | "business" | "schemaType" | "icon">): Terms => ({
  customer: "customer",
  customers: "customers",
  request: "Request service",
  requestShort: "Request service",
  requestTitle: "Request service",
  requestEyebrow: "Service",
  requestKind: "Service",
  requestSubject: "Service request",
  newCustomer: "I’m a new customer",
  insurance: false,
  privacyNote: "Please don’t include payment or card details.",
  requestAside: { title: "Upfront pricing", text: "We’ll explain the options and the price before any work starts. No surprises on the bill." },
  emergency: "Emergency",
  emergencyWarning: "Smell gas, see sparks or have a fire? Leave the house and call 911 first.",
  accepting: "Taking new customers",
  newCustomersNav: "What to Expect",
  newCustomersEyebrow: "What to expect",
  newCustomersTitle: "How it works",
  team: "team",
  teamTitle: "Meet the team",
  reviewsEyebrow: "Reviews",
  reviewsTitle: "What our customers say",
  servicesTitle: "What we do",
  servicesNote: "Every home is different. We’ll give you a clear price before any work starts.",
  servicesPageTitle: "Services",
  galleryEyebrow: "Our work",
  galleryIntro: "Slide to compare. Real jobs, before and after.",
  galleryNote: "Sample images shown. We’ll swap in photos of your own projects.",
  disclaimer: null,
  ...o,
});

/* ── Plumbing ── */
export const PLUMBING_SERVICES: Service[] = [
  { id: "drains", name: "Drain Cleaning", icon: "droplet", short: "Slow or clogged drains cleared, and the cause found.", detail: "Kitchen, bath and main lines. We clear the clog and tell you what caused it, so it doesn’t come right back." },
  { id: "leaks", name: "Leak Repair", icon: "waves", short: "Drips, leaks and burst pipes found and fixed.", detail: "From a dripping faucet to a burst pipe in the wall, we find the source and fix it properly." },
  { id: "water-heaters", name: "Water Heaters", icon: "flame", short: "Repair and replacement, tank or tankless.", detail: "No hot water? We repair what can be fixed and give you honest options when it’s time to replace." },
  { id: "fixtures", name: "Toilets & Fixtures", icon: "toilet", short: "Toilets, faucets, showers and sinks, repaired or installed.", detail: "Running toilets, leaky faucets, new fixtures for a remodel: done neatly, with no mess left behind." },
  { id: "sewer", name: "Sewer & Main Lines", icon: "search", short: "Camera inspections and sewer line repair.", detail: "We look inside the line with a camera, show you what we see, and recommend the simplest fix." },
  { id: "repipes", name: "Repiping", icon: "wrench", short: "Old or failing pipes replaced, room by room.", detail: "For older homes with low pressure, rust or repeated leaks. Planned around your schedule." },
  { id: "emergency", name: "Emergency Plumbing", icon: "siren", short: "Burst pipe or backup? Call us right away.", detail: "Shut off the water at the main if you can, then call. We’ll talk you through it and get there fast." },
];
export const PLUMBING_FAQS: Faq[] = [
  { q: "Are you licensed and insured?", a: "Yes. We’re licensed and fully insured, and we’re happy to share proof before any job." },
  { q: "Do you charge for estimates?", a: "We’ll tell you on the phone exactly how our pricing works, and you’ll get a clear price before any work starts." },
  { q: "How fast can you get here?", a: "Call or request service and we’ll give you an honest arrival window. Emergencies go to the front of the line." },
  { q: "What should I do while I wait for an emergency plumber?", a: "Turn off the water at the main shut-off valve (or the valve under the fixture) and move anything valuable away from the water. Then call us." },
  { q: "Do you guarantee your work?", a: "Yes. Ask about our workmanship guarantee; we’ll explain exactly what it covers before we start." },
  { q: "Which areas do you serve?", a: "See the towns listed on this page. Not sure if you’re in our area? Just call and ask." },
];

/* ── Heating and air ── */
export const HVAC_SERVICES: Service[] = [
  { id: "ac-repair", name: "AC Repair", icon: "snowflake", short: "Not cooling? We find the problem and fix it.", detail: "Warm air, strange noises or a unit that won’t turn on: we diagnose it and explain your options before any repair." },
  { id: "heating", name: "Furnace & Heating Repair", icon: "flame", short: "No heat? We get your home warm again.", detail: "Furnaces, heat pumps and boilers. Safety checks included, because heating problems can be dangerous." },
  { id: "installation", name: "New System Installation", icon: "house", short: "Right-sized heating and cooling, installed cleanly.", detail: "We size the system to your home, explain efficiency in plain words and give you clear options and prices." },
  { id: "maintenance", name: "Maintenance Plans", icon: "calendar", short: "Seasonal tune-ups that prevent breakdowns.", detail: "A tune-up before summer and winter keeps your system efficient, catches small problems early and helps it last longer." },
  { id: "air-quality", name: "Indoor Air Quality", icon: "wind", short: "Filters, purifiers and humidity control.", detail: "Cleaner, more comfortable air for allergies, pets and dry winters." },
  { id: "ducts", name: "Ductwork", icon: "vent", short: "Leaky or uneven airflow fixed.", detail: "Rooms too hot or too cold? Duct sealing and repairs can make every room comfortable." },
  { id: "emergency", name: "Emergency Service", icon: "siren", short: "No heat or no AC in extreme weather? Call us.", detail: "When the weather turns dangerous, a broken system can’t wait. Call and we’ll get to you as fast as we can." },
];
export const HVAC_FAQS: Faq[] = [
  { q: "Are you licensed and insured?", a: "Yes. Our technicians are licensed and we’re fully insured. We’re happy to share proof." },
  { q: "Should I repair or replace my system?", a: "It depends on its age, how often it breaks and the cost of the repair. We’ll give you both options with prices, and an honest recommendation." },
  { q: "How often should I service my system?", a: "Once a year for each system: cooling in spring and heating in fall. A maintenance plan takes care of the reminders for you." },
  { q: "Do you offer financing?", a: "Ask us about financing options for new systems; we’ll explain them clearly, with no pressure." },
  { q: "My AC is running but not cooling. What can I check first?", a: "Make sure the thermostat is set to cool, replace a dirty filter and check that the outdoor unit isn’t blocked. If it still isn’t cooling, call us." },
  { q: "Which areas do you serve?", a: "See the towns listed on this page. Not sure if you’re in our area? Just call and ask." },
];

/* ── Landscaping ── */
export const LANDSCAPING_SERVICES: Service[] = [
  { id: "lawn-care", name: "Lawn Care & Mowing", icon: "scissors", short: "Weekly or every-other-week mowing, edging and cleanup.", detail: "A sharp, healthy lawn all season, on a schedule that works for you." },
  { id: "design", name: "Landscape Design", icon: "flower", short: "Plans and planting that fit your yard and budget.", detail: "We walk the property with you, sketch a plan and plant it, from small beds to full makeovers." },
  { id: "hardscape", name: "Patios & Hardscapes", icon: "hammer", short: "Patios, walkways, retaining walls and fire pits.", detail: "Built on a solid base so it lasts, with clean lines that fit your home." },
  { id: "cleanups", name: "Spring & Fall Cleanups", icon: "leaf", short: "Leaves, beds, mulch and pruning, done in a day.", detail: "Start and end each season with a tidy yard: bed edging, mulch, pruning and leaf removal." },
  { id: "trees-shrubs", name: "Tree & Shrub Care", icon: "trees", short: "Pruning, planting and removal of shrubs and small trees.", detail: "Healthy, well-shaped trees and shrubs that frame your home instead of hiding it." },
  { id: "irrigation", name: "Irrigation", icon: "droplet", short: "Sprinkler installs, repairs and seasonal start-ups.", detail: "Even watering without the waste, with start-up and shut-down service each season." },
  { id: "snow", name: "Snow Removal", icon: "snowflake", short: "Driveways and walks cleared after every storm.", detail: "Seasonal contracts for homes and small businesses, so you never have to shovel." },
];
export const LANDSCAPING_FAQS: Faq[] = [
  { q: "Are you licensed and insured?", a: "Yes. We’re fully insured, and we’re happy to share proof before any project." },
  { q: "Are estimates free?", a: "Yes. We’ll visit, listen to what you want, and give you a written estimate with no obligation." },
  { q: "How soon can you start?", a: "It depends on the season and the size of the project. We’ll give you an honest start date with your estimate." },
  { q: "Do you offer ongoing maintenance?", a: "Yes. Weekly or every-other-week lawn care and seasonal cleanups, on a plan that fits your yard." },
  { q: "Do I need to be home?", a: "Not for routine maintenance. For design and new projects, we’ll walk the property with you first." },
  { q: "Which areas do you serve?", a: "See the towns listed on this page. Not sure if you’re in our area? Just call and ask." },
];

export const TRADES: Record<"plumbing" | "hvac" | "landscaping", { label: string; services: Service[]; faqs: Faq[]; steps: Step[]; perks: string[]; terms: Terms; copy: (name: string, area: string) => Copy }> = {
  plumbing: {
    label: "Plumber",
    services: PLUMBING_SERVICES,
    faqs: PLUMBING_FAQS,
    steps: [
      { title: "Call or request service", text: "Tell us what’s going on. We’ll give you an honest arrival window.", icon: "calendar" },
      { title: "We find the problem", text: "A licensed plumber diagnoses it and explains what we see, in plain words.", icon: "search" },
      { title: "Clear price, then the fix", text: "You approve the price before we start, and we leave the space clean.", icon: "wrench" },
    ],
    perks: ["Licensed & insured", "Upfront pricing", "Clean, on-time techs"],
    terms: homeTerms({ trade: "Plumber", craft: "plumbing", business: "a plumbing company", schemaType: "Plumber", icon: "wrench", emergency: "Emergency", servicesPageTitle: "Plumbing services" }),
    copy: (name, area) => ({
      heroEyebrow: `Plumbing in ${area}`,
      heroHeadline: "Plumbing fixed right, the first time.",
      heroHighlight: "the first time",
      heroSubhead: "Licensed plumbers, honest prices and fast help when you need it.",
      servicesIntro: "From a dripping faucet to a burst pipe, here’s how we help.",
      newPatientsIntro: "Here’s what happens when you call us.",
      doctorsIntro: "The people who’ll show up at your door.",
      ctaHeadline: "Need a plumber?",
      ctaText: "Request service online or give us a call, and we’ll get you on the schedule.",
      emergencyHeadline: "Plumbing emergency? Call us now.",
      emergencyText: "Burst pipe, backup or no water: shut off the main water valve if you can, then call. We’ll get to you as fast as we can.",
      reviewsIntro: "What homeowners say about working with us.",
      faqIntro: "Answers to the questions we hear most.",
      contactIntro: "Questions, a quote or ready to book? We’re here.",
    }),
  },
  hvac: {
    label: "Heating & Air Conditioning",
    services: HVAC_SERVICES,
    faqs: HVAC_FAQS,
    steps: [
      { title: "Call or request service", text: "Tell us what your system is doing. We’ll give you an honest arrival window.", icon: "calendar" },
      { title: "A clear diagnosis", text: "Our technician finds the problem and explains repair and replace options.", icon: "thermometer" },
      { title: "Your choice, upfront price", text: "You pick the option and approve the price before any work starts.", icon: "wrench" },
    ],
    perks: ["Licensed & insured", "Upfront pricing", "Maintenance plans"],
    terms: homeTerms({ trade: "HVAC company", craft: "heating and air", business: "a heating and air conditioning company", schemaType: "HVACBusiness", icon: "thermometer", emergency: "Emergency", servicesPageTitle: "Heating & cooling services" }),
    copy: (name, area) => ({
      heroEyebrow: `Heating & cooling in ${area}`,
      heroHeadline: "Comfortable all year, in every room.",
      heroHighlight: "in every room",
      heroSubhead: "Repairs, new systems and tune-ups from licensed, friendly technicians.",
      servicesIntro: "Heating, cooling and cleaner air, all from one team.",
      newPatientsIntro: "Here’s what happens when you call us.",
      doctorsIntro: "The technicians who’ll take care of your home.",
      ctaHeadline: "Too hot, too cold or just due for a tune-up?",
      ctaText: "Request service online or give us a call, and we’ll get you on the schedule.",
      emergencyHeadline: "No heat or no AC? Call us now.",
      emergencyText: "In extreme heat or cold, a broken system can’t wait. Call and we’ll get to you as fast as we can.",
      reviewsIntro: "What homeowners say about working with us.",
      faqIntro: "Answers to the questions we hear most.",
      contactIntro: "Questions, a quote or ready to book? We’re here.",
    }),
  },
  landscaping: {
    label: "Landscaping",
    services: LANDSCAPING_SERVICES,
    faqs: LANDSCAPING_FAQS,
    steps: [
      { title: "Request a free estimate", text: "Tell us about your yard and what you have in mind.", icon: "calendar" },
      { title: "We walk the property", text: "We listen, measure and share ideas, then send a written estimate.", icon: "trees" },
      { title: "We get to work", text: "On the schedule we agreed, with a tidy site at the end of every day.", icon: "shovel" },
    ],
    perks: ["Licensed & insured", "Free estimates", "Tidy, on-time crews"],
    terms: homeTerms({
      trade: "Landscaper", craft: "landscaping", business: "a landscaping company", schemaType: "HomeAndConstructionBusiness", icon: "leaf",
      request: "Get a free estimate", requestShort: "Free estimate", requestTitle: "Get a free estimate", requestEyebrow: "Estimates",
      requestKind: "Estimate", requestSubject: "Estimate request",
      requestAside: { title: "Free, written estimates", text: "We’ll walk the property with you and send a clear written estimate, with no obligation." },
      emergency: null, servicesPageTitle: "Landscaping services",
    }),
    copy: (name, area) => ({
      heroEyebrow: `Landscaping in ${area}`,
      heroHeadline: "A yard you’ll love coming home to.",
      heroHighlight: "love coming home to",
      heroSubhead: "Design, patios, lawn care and seasonal cleanups from a local, insured crew.",
      servicesIntro: "Everything your yard needs, from weekly mowing to a brand-new patio.",
      newPatientsIntro: "Here’s how a project with us works.",
      doctorsIntro: "The crew who’ll take care of your yard.",
      ctaHeadline: "Ready for a yard you love?",
      ctaText: "Request a free estimate online or give us a call.",
      emergencyHeadline: "Storm damage? Call us.",
      emergencyText: "Fallen branches or a damaged yard after a storm: call and we’ll help clean it up.",
      reviewsIntro: "What homeowners say about their yards.",
      faqIntro: "Answers to the questions we hear most.",
      contactIntro: "Questions or ready for an estimate? We’re here.",
    }),
  },
};
