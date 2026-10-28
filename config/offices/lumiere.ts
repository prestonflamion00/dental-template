import type { OfficeConfig } from "../types";

/** Demo 2 — a boutique cosmetic & implant studio. Theme: blush sand. */
const lumiere: OfficeConfig = {
  id: "lumiere",
  showcase: true, // fictional demo practice: shown on the public examples page
  fictional: true, // shows the demo banner

  practice: {
    name: "Lumière Dental Studio",
    tagline: "Cosmetic & implant dentistry, thoughtfully done",
    logo: { text: "Lumière", mark: "Dental Studio" },
    yearsInPractice: 12,
    acceptingNewPatients: true,
    description:
      "A calm, boutique dental studio in Scottsdale focused on cosmetic dentistry, porcelain veneers, clear aligners and dental implants.",
  },

  contact: {
    phone: "(480) 555-0187",
    email: "concierge@lumieredental.example",
    address: {
      street: "7014 E Camelback Rd, Suite 310",
      city: "Scottsdale",
      region: "AZ",
      postalCode: "85251",
      country: "US",
    },
    geo: { lat: 33.5023, lng: -111.9282 },
    directionsNote: "Complimentary valet at the main entrance. Studio is on the third floor.",
  },

  timezone: "America/Phoenix",
  hours: {
    mon: { open: "07:30", close: "16:00" },
    tue: { open: "07:30", close: "16:00" },
    wed: { open: "07:30", close: "16:00" },
    thu: { open: "10:00", close: "19:00" },
    fri: { open: "07:30", close: "13:00" },
    sat: null,
    sun: null,
  },

  doctors: [
    {
      name: "Dr. Camille Laurent",
      credentials: "DDS, AAACD",
      title: "Cosmetic Dentist & Founder",
      bio: "Camille blends an artist’s eye with a gentle chairside manner. She designs every smile around your face, your personality and what you actually want, never a one-size-fits-all look.",
      photo: "/doctors/doctor-2.svg",
      highlights: ["Accredited AACD member", "Smile design focus"],
    },
    {
      name: "Dr. Mateo Ruiz",
      credentials: "DMD, MS",
      title: "Periodontist & Implant Surgeon",
      bio: "Mateo focuses on implants and gum health. Patients appreciate his calm, step-by-step explanations and his honest advice about whether an implant is the right fit.",
      photo: "/doctors/doctor-1.svg",
      highlights: ["Board-certified periodontist", "Speaks Spanish"],
    },
  ],

  services: [
    {
      id: "veneers",
      name: "Porcelain Veneers",
      icon: "crown",
      short: "Custom, natural-looking veneers designed around your smile.",
      detail:
        "We start with a conversation and a digital smile preview so you can see a mock-up before committing. Every veneer is shaped and shaded to suit your face.",
      points: ["Digital smile preview", "Hand-finished porcelain", "Trial smile before final"],
      durationMin: 90,
    },
    {
      id: "implants",
      name: "Dental Implants",
      icon: "implant",
      short: "Thoughtfully planned implants to replace one tooth or many.",
      detail:
        "Using 3D imaging, we plan each implant carefully and walk you through timing, recovery and investment before anything begins. Your comfort guides every step.",
      points: ["3D CBCT planning", "Single, multiple or full-arch", "Sedation available"],
      durationMin: 60,
    },
    {
      id: "whitening",
      name: "Professional Whitening",
      icon: "sun",
      short: "A brighter smile with gentle, sensitivity-aware whitening.",
      detail:
        "Choose an in-studio session or custom trays for home. We’ll talk through realistic results and how to keep your smile bright afterward.",
      points: ["In-studio or at-home", "Sensitivity-aware gels", "Touch-up kits"],
      durationMin: 90,
    },
    {
      id: "invisalign",
      name: "Clear Aligners",
      icon: "aligners",
      short: "Discreet aligners with a digital preview of your new smile.",
      detail:
        "A quick 3D scan lets you preview your potential results on screen. Aligners are nearly invisible and removable for meals and special occasions.",
      points: ["iTero 3D scan", "Virtual check-ins", "Retainers included"],
      durationMin: 45,
    },
    {
      id: "smile-makeover",
      name: "Smile Makeovers",
      icon: "wand",
      short: "A personalized plan that combines treatments into one smile.",
      detail:
        "Some smiles benefit from a mix of whitening, bonding, aligners or veneers. We’ll build a phased plan around your goals, timeline and budget.",
      points: ["Complimentary consultation", "Phased treatment plans", "Financing available"],
      durationMin: 60,
    },
    {
      id: "cleanings",
      name: "Cleanings & Exams",
      icon: "sparkles",
      short: "Unhurried cleanings and checkups in a spa-like setting.",
      detail:
        "Healthy gums are the foundation of every beautiful smile. Enjoy gentle cleanings, warm towels and time to ask every question.",
      points: ["Hour-long appointments", "Warm neck pillows", "Digital X-rays"],
      durationMin: 60,
    },
    {
      id: "emergency",
      name: "Urgent Care",
      icon: "siren",
      short: "Chipped veneer or sudden pain? We’ll fit you in quickly.",
      detail: "Call us and we’ll do everything we can to see you the same day and get you comfortable.",
      points: ["Same-day visits when possible", "Cosmetic repairs", "Pain relief first"],
      durationMin: 45,
    },
  ],

  insurances: ["Delta Dental", "Cigna", "Aetna", "MetLife", "Guardian", "Humana", "CareCredit financing", "Sunbit financing"],

  rating: { value: 5.0, count: 268, source: "Google" },
  reviews: [
    {
      name: "Natalie B.",
      rating: 5,
      text: "I was nervous about veneers looking fake. Dr. Laurent showed me a preview first and the final result looks like me, just more confident. I can’t stop smiling.",
      meta: "Veneer patient",
    },
    {
      name: "Robert G.",
      rating: 5,
      text: "Dr. Ruiz walked me through my implant one step at a time. No surprises on cost or recovery. Professional, calm and kind.",
      meta: "Implant patient",
    },
    {
      name: "Sofia M.",
      rating: 5,
      text: "It honestly feels more like a spa than a dentist. Warm towels, soft music, and nobody ever rushed me.",
      meta: "Google review",
    },
    {
      name: "James P.",
      rating: 5,
      text: "Finished aligners in under a year. The virtual check-ins saved me so much time with my work schedule.",
      meta: "Google review",
    },
  ],

  faqs: [
    {
      q: "Do you accept insurance for cosmetic treatments?",
      a: "Insurance typically covers cleanings, exams and some restorative care, but not purely cosmetic treatment. We’ll check your benefits and give you a clear, written estimate before you decide.",
    },
    {
      q: "What if I have a dental emergency?",
      a: "Call us right away and we’ll do our best to see you the same day. If you chip a veneer, keep the piece and bring it with you.",
    },
    {
      q: "I’m anxious about dental work. What are my options?",
      a: "You set the pace. We offer noise-canceling headphones, weighted blankets, frequent check-ins and sedation options for longer procedures. Just tell us what would help.",
    },
    {
      q: "Do you offer financing or payment plans?",
      a: "Yes. We partner with CareCredit and Sunbit for flexible monthly payments, and we can phase larger treatment plans over time.",
    },
    {
      q: "What happens at a cosmetic consultation?",
      a: "We’ll talk about what you’d love to change, take photos and a 3D scan, and show you a digital preview where possible. You’ll leave with options and pricing, with zero pressure.",
    },
  ],

  gallery: [
    { title: "Porcelain veneers", caption: "Six upper veneers", before: "/gallery/before-1.svg", after: "/gallery/after-1.svg" },
    { title: "Implant crown", caption: "Single front tooth replaced", before: "/gallery/before-2.svg", after: "/gallery/after-2.svg" },
    { title: "Smile makeover", caption: "Aligners, whitening & bonding", before: "/gallery/before-3.svg", after: "/gallery/after-3.svg" },
  ],

  booking: {},
  newPatientFormsUrl: "/forms/new-patient-forms.pdf",

  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    google: "https://maps.google.com/",
    youtube: "https://youtube.com/",
  },

  theme: { preset: "blush-sand" },

  // Cosmetic practices lead with results: gallery right after services.
  sections: ["hero", "quickInfo", "request", "services", "gallery", "doctors", "reviews", "cta", "newPatients", "faq", "emergency", "contact"],

  copy: {
    heroEyebrow: "Cosmetic & implant dentistry in Scottsdale",
    heroHeadline: "A smile that feels entirely yours.",
    heroHighlight: "entirely yours",
    heroSubhead: "Unhurried consultations, digital smile previews and a calm, spa-like studio designed around your comfort.",
    servicesIntro: "Artful, conservative treatments tailored to your face, your goals and your timeline.",
    newPatientsIntro: "Your first visit is a conversation, not a sales pitch.",
    firstVisitSteps: [
      { title: "Request a consultation", text: "Request a time online or call our concierge. We’ll send a short questionnaire in advance.", icon: "calendar" },
      { title: "Design together", text: "Photos, a 3D scan and an honest conversation about what you’d love to change.", icon: "scan" },
      { title: "See your options", text: "A clear plan with transparent pricing. Take all the time you need to decide.", icon: "clipboard" },
    ],
    doctorsIntro: "Meticulous clinicians with a soft touch and an eye for natural results.",
    ctaHeadline: "Let’s talk about your smile.",
    ctaText: "Complimentary cosmetic and implant consultations are available most weeks.",
    emergencyHeadline: "Urgent dental issue? Call us.",
    emergencyText: "Chipped veneer, lost crown or sudden pain: call and we’ll do everything we can to see you today.",
    reviewsIntro: "What our patients say after they leave the studio.",
    faqIntro: "Thoughtful answers to common questions.",
    contactIntro: "Our concierge team is happy to help with scheduling, financing and questions.",
    comfortPerks: ["Warm towels", "Weighted blankets", "Digital previews"],
  },

  seo: {
    siteUrl: "https://lumieredental.example",
    title: "Lumière Dental Studio | Cosmetic & Implant Dentist in Scottsdale, AZ",
    description:
      "Boutique cosmetic and implant dentistry in Scottsdale. Porcelain veneers, clear aligners, whitening and dental implants in a calm, spa-like studio. Request a consultation.",
    priceRange: "$$$",
  },
};

export default lumiere;
