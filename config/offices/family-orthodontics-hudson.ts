import type { OfficeInput } from "../types";

/**
 * Prospect demo for Family Orthodontics of Hudson (Hudson, MA). Real practice: built only from public
 * information (their site bracerus.com and directory listings, Nov 2026). Anything not listed here is
 * filled by buildOffice: placeholder insurance plans, sample reviews, generic wording.
 */
const familyOrthodonticsHudson: OfficeInput = {
  id: "family-orthodontics-hudson",
  stage: "demo",

  practice: {
    name: "Family Orthodontics of Hudson",
    tagline: "Orthodontics for kids, teens and adults",
    logo: { text: "Family Orthodontics", mark: "of Hudson" },
    description:
      "Family Orthodontics of Hudson offers braces, Invisalign and early treatment for kids, teens and adults in Hudson, MA.",
  },

  contact: {
    phone: "(978) 562-1234",
    address: { street: "118 Forest Ave, Suite 202", city: "Hudson", region: "MA", postalCode: "01749", country: "US" },
    directionsNote: "We also see patients at our North Cambridge office: (617) 625-1714.",
  },

  timezone: "America/New_York",
  // Hudson office hours from their website; Monday and Wednesday they're in North Cambridge.
  hours: {
    mon: null,
    tue: { open: "09:00", close: "17:00" },
    wed: null,
    thu: { open: "09:00", close: "17:00" },
    fri: null,
    sat: null,
    sun: null,
  },

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

  faqs: [
    {
      q: "When should my child first see an orthodontist?",
      a: "The American Association of Orthodontists recommends a first check by age 7. Most kids won’t need treatment yet, but it helps spot problems early.",
    },
    {
      q: "Braces or Invisalign: which is right for me?",
      a: "Both work well for most people. At your consultation we’ll look at your teeth and talk through what fits your goals and lifestyle.",
    },
    {
      q: "How long does treatment take?",
      a: "It depends on your teeth, but many treatments take about one to two years. You’ll get a clear timeline before you start.",
    },
    {
      q: "Do I need a referral from my dentist?",
      a: "You don’t usually need one. Just request an appointment or give us a call.",
    },
    {
      q: "Do you take my insurance?",
      a: "Tell us your plan when you request an appointment, or call us, and we’ll check your orthodontic benefits before your visit.",
    },
  ],

  design: "butter",
  theme: { preset: "sage-blue" },

  sections: ["services", "newPatients", "doctors", "reviews", "cta", "emergency", "faq"],

  copy: {
    heroEyebrow: "Orthodontics in Hudson, MA",
    heroHeadline: "Straighter smiles for the whole family.",
    heroHighlight: "the whole family",
    heroSubhead: "Braces, Invisalign and early treatment for kids, teens and adults, with clear answers at every step.",
    servicesIntro: "Options for every age and every smile.",
    newPatientsIntro: "Thinking about braces or aligners? Here’s how getting started works.",
    firstVisitSteps: [
      { title: "Request a consultation", text: "Request a time online or call. We’ll confirm by phone or text.", icon: "calendar" },
      { title: "Meet Dr. Thalanki", text: "A friendly exam to see what your smile needs, with time for all your questions.", icon: "smile" },
      { title: "Your plan", text: "Your options, timeline and costs explained clearly before anything starts.", icon: "clipboard" },
    ],
    doctorsIntro: "Experienced orthodontic care, close to home.",
    ctaHeadline: "Ready to start your smile?",
    ctaText: "Request a consultation online or give us a call, and we’ll find a time that works for you.",
    emergencyHeadline: "Broken bracket or poking wire?",
    emergencyText: "Call us and we’ll help you get comfortable fast. Most fixes are quick and simple.",
    reviewsIntro: "What families say about their smiles.",
    faqIntro: "Answers to the questions families ask us most.",
    contactIntro: "Questions about braces or aligners? We’re happy to help.",
    comfortPerks: ["Clear options, no pressure", "Care for kids, teens and adults", "Questions welcome, always"],
  },
};

export default familyOrthodonticsHudson;
