import type { OfficeInput } from "../types";
import { hermanCatalog } from "../herman-catalog.ts";

/**
 * Prospect demo for Herman Family Dentistry (Vincennes, IN). Real practice: built only from public
 * information on their own site (vincennesdentalpractice.com, Nov 2026), including the doctors'
 * portraits (public/offices/herman/). Anything not listed here is filled by buildOffice: placeholder
 * insurance plans and sample reviews. Photos and the video (public/offices/herman/) are theirs too.
 */
const hermanFamilyDentistry: OfficeInput = {
  id: "herman-family-dentistry",
  stage: "demo",

  practice: {
    name: "Herman Family Dentistry",
    tagline: "Modern family dental care in Vincennes",
    // Their logo (vincennesdentalpractice.com), with the silver parts darkened so they read on our light bar.
    logo: { text: "Herman Family Dentistry", mark: "Vincennes, Indiana", image: "/offices/herman/logo.png", width: 578, height: 144 },
    description:
      "Herman Family Dentistry offers modern family dental care in Vincennes, IN: cleanings, CEREC same-day crowns, implants, clear aligners, sedation and more.",
    // "Serving the Vincennes area for over 25 years"; Dr. Herman since 2001.
    yearsInPractice: 25,
  },

  contact: {
    phone: "(812) 882-1572",
    address: { street: "608 South Quail Run Road", city: "Vincennes", region: "IN", postalCode: "47591", country: "US" },
    // Their main Google listing (not the duplicate "Eric L. Herman DDS" one), from the Places API.
    geo: { lat: 38.65216, lng: -87.49646 },
    placeId: "ChIJiV1-jpz_bYgR6LhK4blmppg",
  },

  timezone: "America/Indiana/Vincennes",
  // From their website.
  hours: {
    mon: { open: "09:00", close: "17:00" },
    tue: { open: "07:00", close: "17:00" },
    wed: { open: "09:00", close: "17:00" },
    thu: { open: "07:00", close: "17:00" },
    fri: { open: "08:00", close: "15:00" },
    sat: null,
    sun: null,
  },

  // From their doctor pages (bios and portraits). Only Dr. Herman's degree is stated (Eric L. Herman DDS).
  doctors: [
    {
      name: "Dr. Eric Herman",
      photo: "/offices/herman/dr-herman.jpg",
      credentials: "DDS",
      title: "General Dentist",
      bio: "Since 2001, Dr. Herman has brought healthier, brighter smiles to Knox County and the surrounding area. He's a Fellow of the Academy of General Dentistry and of the International Congress of Oral Implantologists.",
      highlights: ["Indiana University School of Dentistry", "Since 2001"],
      about: ["Since 2001, Dr. Herman has brought healthier, brighter smiles to Knox County and the surrounding area.", "A graduate of the Indiana University School of Dentistry, he is a member of the American Dental Association and the Indiana Dental Association, a Fellow of the Academy of General Dentistry, and a Fellow of the International Congress of Oral Implantologists.", "Dr. Herman and his staff use the most advanced, state-of-the-art technology to provide their patients with the best dental care in the area."],
    },
    {
      name: "Dr. Lynn Stine",
      photo: "/offices/herman/dr-stine.jpg",
      title: "General Dentist",
      bio: "Dr. Stine joined the practice in 2007, after a General Practice Residency at Denver Health in Denver, Colorado.",
      highlights: ["Indiana University School of Dentistry", "Since 2007"],
      about: ["Dr. Stine joined Herman Family Dentistry in 2007. She specializes in general dentistry and provides happier and healthier smiles to our patients.", "Dr. Stine graduated from the Indiana University School of Dentistry and gained valuable experience in her General Practice Residency at Denver Health in Denver, Colorado. She is a member of the American Dental Association and the Indiana Dental Association.", "Her knowledge and attention to detail help her provide outstanding care to our patients."],
    },
    {
      name: "Dr. Karen Schenk",
      photo: "/offices/herman/dr-schenk.jpg",
      title: "General Dentist",
      bio: "A South Knox High School graduate with a Master's in Biology from Purdue, Dr. Schenk joined in 2017 and focuses on general dentistry and anti-aging treatments.",
      highlights: ["Indiana University School of Dentistry", "Since 2017"],
      about: ["Dr. Schenk joined Herman Family Dentistry in 2017 and specializes in general dentistry and anti-aging treatments.", "A South Knox High School graduate, she earned a Master's in Biology from Purdue and later graduated from the Indiana University School of Dentistry. She completed her General Practice Residency at the Roudebush VA Medical Center.", "Dr. Schenk is a member of the American Dental Association and Indiana Dental Association. Her background and experience allow her to provide our patients with excellent, high-quality care."],
    },
    {
      name: "Dr. John Anderson",
      photo: "/offices/herman/dr-anderson.jpg",
      title: "General Dentist",
      bio: "A Vincennes native and Rivet High School graduate, Dr. Anderson joined in 2024 and enjoys caring for patients in his hometown.",
      highlights: ["University of Louisville School of Dentistry", "Since 2024"],
      about: ["Dr. John Anderson joined the Herman Family Dentistry team in 2024. He is a native of Vincennes and is a graduate of Vincennes Rivet High School.", "Dr. Anderson has an undergraduate degree from Indiana University-Purdue University Indianapolis and is a Louisville School of Dentistry graduate.", "He enjoys serving patients in his hometown and providing them with the best dental care."],
    },
  ],

  // Highlights for the home page; the full list (every service, with its own page) is in hermanCatalog.
  services: [
    { id: "cleanings", page: "/services/exams-cleanings/", name: "Cleanings & Checkups", icon: "tooth", short: "Gentle cleanings, exams and digital X-rays.", detail: "Thorough cleanings, exams, fluoride and sealants, with digital X-rays and oral cancer screenings, so small problems stay small." },
    { id: "cerec", page: "/services/same-day-crowns/", name: "CEREC Same-Day Crowns", icon: "crown", short: "A custom crown in a single visit.", detail: "We design and make your crown right here in the office, so you can leave with it the same day. No temporary crown, no second trip." },
    { id: "implants", page: "/services/implants/", name: "Implants & Implant Bridges", icon: "implant", short: "Permanent replacements for missing teeth.", detail: "Dental implants and Prettau® implant bridges replace missing teeth with strong, natural-looking results." },
    { id: "aligners", page: "/services/clear-aligners/", name: "Clear Aligners & Veneers", icon: "aligners", short: "Straighter, brighter smiles.", detail: "Clear aligners straighten teeth without braces, and porcelain veneers or custom crowns can transform your whole smile." },
    { id: "sedation", page: "/services/sedation/", name: "Sedation & Relaxation", icon: "leaf", short: "Calm, comfortable visits for nervous patients.", detail: "If dental visits make you anxious, sedation options help you relax through your care." },
    { id: "dentures", page: "/services/dentures-partials/", name: "Dentures & Partials", icon: "smile", short: "Comfortable, natural-looking smiles.", detail: "Full and partial dentures made to fit well, plus cleanings to keep them looking their best." },
    { id: "gums", page: "/services/#gum-care", name: "Gum Care & Laser Therapy", icon: "shield", short: "Healthy gums, gently treated.", detail: "Scaling and root planing, laser periodontal therapy and treatment for gum recession keep your gums healthy." },
    { id: "sleep-tmj", page: "/services/#specialty", name: "Sleep Apnea & TMJ Relief", icon: "sun", short: "Better sleep and less jaw pain.", detail: "Oral appliances for sleep apnea, BOTOX® for TMD/TMJ, and night and athletic guards." },
  ],

  // Their own photos, from their website: the office for the hero and the 2025 group shot of the four doctors.
  heroImage: {
    src: "/offices/herman/office.jpg",
    alt: "The Herman Family Dentistry office on South Quail Run Road, Vincennes",
    position: "72% 55%",
    team: { src: "/offices/herman/team.webp", alt: "Dr. Anderson, Dr. Stine, Dr. Herman and Dr. Schenk" },
  },

  // Their staff page (names, roles and photos), Nov 2026. Raven's photo file is named McCrary; the page lists Marchino.
  staff: [
    { name: "Krissy Burrows", role: "Registered Dental Hygienist", photo: "/offices/herman/staff/krissy-burrows.webp" },
    { name: "Lauren Carie", role: "Registered Dental Hygienist", photo: "/offices/herman/staff/lauren-carie.webp" },
    { name: "Connie Harrington", role: "Registered Dental Hygienist", photo: "/offices/herman/staff/connie-harrington.webp" },
    { name: "Katlyn Jones", role: "Registered Dental Hygienist", photo: "/offices/herman/staff/katlyn-jones.webp" },
    { name: "Lauren Karges", role: "Registered Dental Hygienist", photo: "/offices/herman/staff/lauren-karges.webp" },
    { name: "Raven Marchino", role: "Registered Dental Hygienist", photo: "/offices/herman/staff/raven-mccrary.webp" },
    { name: "Molly Niehaus", role: "Registered Dental Hygienist", photo: "/offices/herman/staff/molly-niehaus.webp" },
    { name: "Riley Beaman", role: "Registered Dental Hygienist", photo: "/offices/herman/staff/riley-beaman.webp" },
    { name: "Rachel Beaman", role: "Expanded Function Dental Assistant, Office Manager", photo: "/offices/herman/staff/rachel-beaman.webp" },
    { name: "Kaitlin Wagler", role: "Expanded Function Dental Assistant", photo: "/offices/herman/staff/kaitlin-wagler.webp" },
    { name: "Katrina Gardner", role: "Dental Assistant", photo: "/offices/herman/staff/katrina-gardner.webp" },
    { name: "Jazzman Barnett", role: "Dental Assistant", photo: "/offices/herman/staff/jazzman-barnett.webp" },
    { name: "Jessica Harper", role: "Dental Assistant", photo: "/offices/herman/staff/jessica-harper.webp" },
    { name: "Bailey Kempfer", role: "Dental Assistant", photo: "/offices/herman/staff/bailey-kempfer.webp" },
    { name: "Macy Cliver", role: "Reception", photo: "/offices/herman/staff/macy-cliver.webp" },
    { name: "Bri Shoults", role: "Director of Accounts, EFDA", photo: "/offices/herman/staff/bri-shoults.webp" },
    { name: "Kelsey Emmons", role: "Director of Administrative Services", photo: "/offices/herman/staff/kelsey-emmons.webp" },
    { name: "Victoria Jackson", role: "Administrative", photo: "/offices/herman/staff/victoria-jackson.webp" },
    { name: "Dani Nowaskie", role: "Insurance Coordinator", photo: "/offices/herman/staff/dani-nowaskie.webp" },
    { name: "Jennifer Bilskie", role: "Insurance Coordinator", photo: "/offices/herman/staff/jennifer-bilskie.webp" },
    { name: "Staci Gentry", role: "Supply Coordinator", photo: "/offices/herman/staff/staci-gentry.webp" },
  ],

  // Their "Pay Your Bill" and "Financing" pages, combined.
  billing: {
    intro: "You deserve a beautiful, healthy smile, and we don’t want cost to stand in the way. We accept a variety of payment methods and dental insurance plans, and offer third-party financing.",
    payUrl: "https://portal.simplifeye.co/login/external-invoice?practiceId=4XV1qUdbOi8Vh0U6&locationId=Xxt4BvweVZsyT3On",
    methods: ["Cash", "Check", "Visa", "Mastercard", "Discover", "CareCredit", "Cherry", "LendingClub"],
    financing: [
      { name: "CareCredit", url: "https://www.carecredit.com/apply/" },
      { name: "Cherry", url: "https://withcherry.com/consumers" },
      { name: "LendingClub", url: "https://www.lendingclub.com/patient-solutions?loanPurpose=medical" },
    ],
  },

  // Their careers page.
  careers: {
    intro: "At Herman Family Dentistry we strive for a caring team of professionals. With a modern building and state-of-the-art dentistry, we are a very busy practice! We are looking for detail-oriented people to help with serving our patients and doctors.",
    applyUrl: "https://www.vincennesdentalpractice.com/job-application",
    jobs: [
      {
        title: "Expanded Duty Dental Assistant",
        type: "Full-time",
        pay: "$25+ per hour, based on experience",
        perks: ["Monday – Friday, no weekends", "Off at 3 PM on Fridays", "401(k) after 1 year", "Fun place to work"],
        details: [
          "Direct patient care, sterilization, placing restorations and CEREC design.",
          "Good time management, organization and being a team player.",
          "X-ray certification required.",
        ],
      },
      {
        title: "Dental Hygienist",
        type: "Full-time",
        pay: "Top pay, based on experience",
        perks: ["Monday – Friday, no weekends", "Off at 3 PM on Fridays", "401(k) after 1 year", "Fun place to work"],
        details: [
          "Graduate of an accredited dental hygiene program, licensed in Indiana, with continuing education.",
          "Operatory set-up, direct patient care, new patient exams, record keeping and documentation.",
          "Patient treatment plans: debridement, root planing and scaling, fluoride, sealants and irrigation therapy.",
          "Strong interpersonal skills and clear communication.",
        ],
      },
    ],
  },

  // Their town pages ("serving patients from Vincennes IN, Washington IN, Lawrenceville IL").
  areas: [
    { slug: "vincennes-in", town: "Vincennes", region: "IN" },
    { slug: "washington-in", town: "Washington", region: "IN" },
    { slug: "lawrenceville-il", town: "Lawrenceville", region: "IL" },
  ],

  social: {
    facebook: "https://www.facebook.com/VincennesDentist/",
    youtube: "https://www.youtube.com/@hermanfamilydentistry3500",
  },

  // Every service on their site, grouped, in their words (config/herman-catalog.ts).
  catalog: hermanCatalog,

  // Phones: photo-first hero, edge to edge (option B, chosen Nov 2026).
  heroLayout: "bleed",

  // Their 30-second video, from their website (compressed for the web).
  // The private page we send Eric (/welcome/): automatic walkthrough + snapshot highlights.
  welcome: {
    greeting: "Dr. Herman",
    video: "/offices/herman/welcome.mp4",
    poster: "/offices/herman/welcome-poster.jpg",
    captions: "/offices/herman/welcome.vtt",
    snapshot: {
      score: 6.1,
      band: "Warming up",
      url: "https://claude.ai/artifact/YAVhVLJPx4343m9JY5favS",
      findings: [
        "Patients can't request a visit online; every request is a phone call.",
        "Your current site takes about 9 seconds to show on a phone.",
        "24 links on your current site lead to \"page not found\".",
      ],
    },
  },
  video: {
    src: "/offices/herman/video.mp4",
    poster: "/offices/herman/video-poster.jpg",
    title: "See Herman Family Dentistry",
    caption: "Cleanings, checkups, aligners and more, with the team you'll meet.",
  },

  // Each doctor gets their own page.
  experiments: { doctorPages: true },

  // Their Google rating, as shown on their own website (Nov 2026).
  rating: { value: 4.9, count: 183, source: "Google" },

  design: "butter",
  // Their brand: sage green (vincennesdentalpractice.com), deepened for readable text.
  theme: { preset: "sage-blue", accent: "#4a7553" },

  sections: ["services", "reviews", "doctors", "video", "newPatients", "faq"],
};

export default hermanFamilyDentistry;
