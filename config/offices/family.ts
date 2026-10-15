import type { OfficeConfig } from "../types";

/** Demo 1 — a warm, general family practice. Theme: warm neutral. */
const family: OfficeConfig = {
  id: "maple-grove",

  practice: {
    name: "Maple Grove Family Dental",
    tagline: "Gentle dental care for every generation",
    logo: { text: "Maple Grove", mark: "Family Dental" },
    yearsInPractice: 18,
    acceptingNewPatients: true,
    description:
      "A friendly neighborhood dental office caring for kids, parents and grandparents in Portland, with gentle cleanings, checkups, cosmetic and emergency care.",
  },

  contact: {
    phone: "(503) 555-0142",
    email: "hello@maplegrovedental.example",
    address: {
      street: "2140 NE Alberta St, Suite 200",
      city: "Portland",
      region: "OR",
      postalCode: "97211",
      country: "US",
    },
    geo: { lat: 45.5589, lng: -122.6432 },
    directionsNote: "Free parking behind the building. Elevator access from the rear entrance.",
  },

  timezone: "America/Los_Angeles",
  hours: {
    mon: { open: "08:00", close: "17:00" },
    tue: { open: "08:00", close: "17:00" },
    wed: { open: "09:00", close: "18:30" },
    thu: { open: "08:00", close: "17:00" },
    fri: { open: "08:00", close: "14:00" },
    sat: { open: "09:00", close: "13:00" },
    sun: null,
  },

  doctors: [
    {
      name: "Dr. Elena Marsh",
      credentials: "DMD",
      title: "Founder & General Dentist",
      bio: "Elena opened Maple Grove so families could have one place they actually look forward to visiting. She’s known for explaining everything in plain language and never rushing an appointment.",
      photo: "/doctors/doctor-1.svg",
      highlights: ["OHSU School of Dentistry", "18 years in practice"],
    },
    {
      name: "Dr. Samuel Okafor",
      credentials: "DDS",
      title: "General & Restorative Dentist",
      bio: "Sam loves helping nervous patients feel at ease. Outside the office you’ll find him coaching his daughter’s soccer team and hunting for the best coffee in town.",
      photo: "/doctors/doctor-2.svg",
      highlights: ["Sedation certified", "Speaks Igbo"],
    },
    {
      name: "Dr. Priya Nair",
      credentials: "DDS",
      title: "Family & Pediatric Dentist",
      bio: "Priya has a gift for making first visits fun. She sees patients of all ages and takes extra time with little ones and anyone who’s had a tough experience before.",
      photo: "/doctors/doctor-3.svg",
      highlights: ["Kid-friendly care", "Speaks Hindi"],
    },
  ],

  services: [
    {
      id: "general",
      name: "General Dentistry",
      icon: "tooth",
      short: "Checkups, fillings and everyday care to keep your smile healthy.",
      detail:
        "Regular checkups help us spot small things before they become big things. We’ll take a look, talk through what we see, and make a plan together. No surprises, no pressure.",
      points: ["Exams & digital X-rays", "Tooth-colored fillings", "Oral cancer screening"],
      durationMin: 60,
    },
    {
      id: "cleanings",
      name: "Cleanings",
      icon: "sparkles",
      short: "Gentle, thorough cleanings that leave you feeling fresh.",
      detail:
        "Our hygienists take their time and check in with you throughout. If you have sensitive teeth, just let us know. We have numbing gel and plenty of patience.",
      points: ["Gentle polishing", "Fluoride options", "Gum health check"],
      durationMin: 60,
    },
    {
      id: "whitening",
      name: "Teeth Whitening",
      icon: "sun",
      short: "Brighten your smile in-office or with custom take-home trays.",
      detail:
        "We’ll help you choose between an in-office session or custom trays you use at home. Results vary from person to person, so we’ll set realistic expectations up front.",
      points: ["In-office whitening", "Custom take-home trays", "Sensitivity-friendly options"],
      durationMin: 90,
    },
    {
      id: "invisalign",
      name: "Invisalign® Clear Aligners",
      icon: "aligners",
      short: "Straighten teeth discreetly with clear, removable aligners.",
      detail:
        "A quick digital scan shows a preview of how your teeth could move. Aligners are removable, so you can eat what you like and brush normally.",
      points: ["Digital 3D scan, no goopy impressions", "Teens and adults", "Flexible payment plans"],
      durationMin: 45,
    },
    {
      id: "implants",
      name: "Dental Implants",
      icon: "implant",
      short: "A long-lasting option for replacing missing teeth.",
      detail:
        "Implants can be a great way to replace a missing tooth. We’ll walk you through every step, timing and cost before anything begins, and partner with trusted local specialists when needed.",
      points: ["Free implant consultation", "Single tooth or full arch", "Clear cost estimates"],
      durationMin: 60,
    },
    {
      id: "emergency",
      name: "Emergency Care",
      icon: "siren",
      short: "Toothache or chipped tooth? We hold same-day spots for you.",
      detail:
        "Call us as early as you can and we’ll do our best to see you the same day. If you’re a current patient and it’s after hours, our voicemail has an on-call number.",
      points: ["Same-day appointments", "After-hours line for patients", "Pain relief first"],
      durationMin: 45,
    },
    {
      id: "pediatric",
      name: "Kids’ Dentistry",
      icon: "baby",
      short: "Fun, friendly first visits that build healthy habits early.",
      detail:
        "We keep kids’ visits light and positive, with tell-show-do explanations, a treasure box and lots of high-fives. Parents are always welcome to stay.",
      points: ["First visit by age one", "Sealants & fluoride", "Parents welcome chairside"],
      durationMin: 45,
    },
  ],

  insurances: ["Delta Dental", "Cigna", "Aetna", "MetLife", "Guardian", "United Concordia", "Regence BlueCross", "Moda Health"],

  rating: { value: 4.9, count: 412, source: "Google" },
  reviews: [
    {
      name: "Jessica R.",
      rating: 5,
      text: "I hadn’t been to a dentist in six years and was so embarrassed. Not one ounce of judgment here, just kindness and a clear plan. I actually look forward to my cleanings now.",
      meta: "Patient since 2021",
    },
    {
      name: "Marcus T.",
      rating: 5,
      text: "Dr. Okafor fixed a cracked tooth the same day I called. He explained everything and checked in on me constantly. Total pro.",
      meta: "Google review",
    },
    {
      name: "The Alvarez family",
      rating: 5,
      text: "All five of us come here, from our toddler to grandma. Scheduling back-to-back appointments is easy and the kids beg to go back for the treasure box.",
      meta: "Patients since 2016",
    },
    {
      name: "Helen W.",
      rating: 5,
      text: "Warm front desk, on-time appointments and they sorted out my insurance before I even asked. It’s the little things.",
      meta: "Google review",
    },
    {
      name: "David L.",
      rating: 4,
      text: "Very thorough cleaning and a calm, relaxing office. Parking out back is a nice bonus in this neighborhood.",
      meta: "Google review",
    },
    {
      name: "Amara K.",
      rating: 5,
      text: "Started Invisalign here and the whole team has been encouraging the entire way. They make you feel like family.",
      meta: "Patient since 2022",
    },
  ],

  faqs: [
    {
      q: "Do you take my insurance?",
      a: "We work with most major PPO plans, including the ones listed on this page, and we’re happy to check your benefits before your visit. Just send us your plan details or call the front desk.",
    },
    {
      q: "What should I do in a dental emergency?",
      a: "Call us right away. We keep same-day spots open for emergencies. If it’s after hours and you’re a current patient, our voicemail will give you the on-call number. For severe swelling or trouble breathing, please go to the ER.",
    },
    {
      q: "I get really nervous at the dentist. Can you help?",
      a: "Absolutely, and you’re far from alone. Tell us what worries you and we’ll go at your pace. We offer cozy blankets, headphones, breaks whenever you need them, and sedation options for some treatments.",
    },
    {
      q: "Do you offer payment plans?",
      a: "Yes. We offer flexible monthly payment plans through third-party financing, plus an in-house membership plan for patients without insurance. We’ll always share costs before any treatment.",
    },
    {
      q: "What happens at my first visit?",
      a: "We’ll get to know you, take any needed X-rays, do a gentle exam and cleaning (if time allows), and talk through what we see. You’ll leave with a clear picture and no pressure to decide anything on the spot.",
    },
    {
      q: "At what age should my child first see a dentist?",
      a: "We recommend a first visit around your child’s first birthday or when their first tooth appears. It’s mostly a quick, happy hello so they get comfortable with us.",
    },
  ],

  gallery: [
    { title: "Whitening", caption: "Two in-office sessions", before: "/gallery/before-1.svg", after: "/gallery/after-1.svg" },
    { title: "Bonding", caption: "Chipped front tooth repaired", before: "/gallery/before-2.svg", after: "/gallery/after-2.svg" },
    { title: "Clear aligners", caption: "14 months with Invisalign", before: "/gallery/before-3.svg", after: "/gallery/after-3.svg" },
  ],

  booking: { slotMinutes: 30 },
  newPatientFormsUrl: "/forms/new-patient-forms.pdf",

  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    google: "https://maps.google.com/",
  },

  theme: { preset: "warm-neutral" },

  sections: ["hero", "quickInfo", "services", "newPatients", "doctors", "cta", "reviews", "gallery", "emergency", "faq", "contact"],

  copy: {
    heroEyebrow: "Family dentistry in Northeast Portland",
    heroHeadline: "Dental care that feels like coming home.",
    heroHighlight: "coming home",
    heroSubhead: "Gentle, unhurried visits for the whole family, with no judgment, ever, and a team that remembers your name.",
    servicesIntro: "Everything your family needs under one roof, explained in plain language.",
    newPatientsIntro: "New here? Welcome. Here’s exactly what to expect, so there are no surprises.",
    firstVisitSteps: [
      { title: "Say hello", text: "Book online or call. We’ll check your insurance and send forms ahead of time.", icon: "calendar" },
      { title: "Get comfortable", text: "Settle in with a warm drink. We’ll chat about your goals and any worries first.", icon: "coffee" },
      { title: "Leave with a plan", text: "A gentle exam, clear answers, and a plan you can take your time thinking about.", icon: "clipboard" },
    ],
    doctorsIntro: "Experienced, down-to-earth dentists who take the time to listen.",
    ctaHeadline: "Ready when you are.",
    ctaText: "New patients are always welcome. Most visits can be booked within the week.",
    emergencyHeadline: "Dental emergency? Call now.",
    emergencyText: "Toothache, broken tooth or swelling: we keep same-day spots open and will get you out of pain quickly.",
    reviewsIntro: "Kind words from the families we’re lucky to care for.",
    faqIntro: "Quick answers to the questions we hear most.",
    contactIntro: "Questions, scheduling, or just want to say hi? We’re here.",
    comfortPerks: ["Cozy blankets", "Noise-canceling headphones", "Breaks anytime"],
  },

  seo: {
    siteUrl: "https://maplegrovedental.example",
    title: "Maple Grove Family Dental | Gentle Family Dentist in Portland, OR",
    description:
      "Gentle, judgment-free dental care for the whole family in NE Portland. Cleanings, checkups, Invisalign, implants and same-day emergencies. Accepting new patients.",
    priceRange: "$$",
  },
};

export default family;
