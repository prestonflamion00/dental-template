import type { OfficeInput } from "../types";

/**
 * Prospect demo for Herman Family Dentistry (Vincennes, IN). Real practice: built only from public
 * information on their own site (vincennesdentalpractice.com, Nov 2026), including the doctors'
 * portraits (public/offices/herman/). Anything not listed here is filled by buildOffice: placeholder
 * insurance plans and sample reviews. herman-family-dentistry-hero.ts is the same site with a hero photo.
 */
const hermanFamilyDentistry: OfficeInput = {
  id: "herman-family-dentistry",
  stage: "demo",

  practice: {
    name: "Herman Family Dentistry",
    tagline: "Modern family dental care in Vincennes",
    logo: { text: "Herman Family Dentistry", mark: "Vincennes, Indiana" },
    description:
      "Herman Family Dentistry offers modern family dental care in Vincennes, IN: cleanings, CEREC same-day crowns, implants, clear aligners, sedation and more.",
    // "Serving the Vincennes area for over 25 years"; Dr. Herman since 2001.
    yearsInPractice: 25,
  },

  contact: {
    phone: "(812) 882-1572",
    address: { street: "608 South Quail Run Road", city: "Vincennes", region: "IN", postalCode: "47591", country: "US" },
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
    },
    {
      name: "Dr. Lynn Stine",
      photo: "/offices/herman/dr-stine.jpg",
      title: "General Dentist",
      bio: "Dr. Stine joined the practice in 2007, after a General Practice Residency at Denver Health in Denver, Colorado.",
      highlights: ["Indiana University School of Dentistry", "Since 2007"],
    },
    {
      name: "Dr. Karen Schenk",
      photo: "/offices/herman/dr-schenk.jpg",
      title: "General Dentist",
      bio: "A South Knox High School graduate with a Master's in Biology from Purdue, Dr. Schenk joined in 2017 and focuses on general dentistry and anti-aging treatments.",
      highlights: ["Indiana University School of Dentistry", "Since 2017"],
    },
    {
      name: "Dr. John Anderson",
      photo: "/offices/herman/dr-anderson.jpg",
      title: "General Dentist",
      bio: "A Vincennes native and Rivet High School graduate, Dr. Anderson joined in 2024 and enjoys caring for patients in his hometown.",
      highlights: ["University of Louisville School of Dentistry", "Since 2024"],
    },
  ],

  // Services named on their site.
  services: [
    { id: "cleanings", name: "Cleanings & Checkups", icon: "tooth", short: "Gentle cleanings, exams and digital X-rays.", detail: "Thorough cleanings, exams, fluoride and sealants, with digital X-rays and oral cancer screenings, so small problems stay small." },
    { id: "cerec", name: "CEREC Same-Day Crowns", icon: "crown", short: "A custom crown in a single visit.", detail: "We design and make your crown right here in the office, so you can leave with it the same day. No temporary crown, no second trip." },
    { id: "implants", name: "Implants & Implant Bridges", icon: "implant", short: "Permanent replacements for missing teeth.", detail: "Dental implants and Prettau® implant bridges replace missing teeth with strong, natural-looking results." },
    { id: "aligners", name: "Clear Aligners & Veneers", icon: "aligners", short: "Straighter, brighter smiles.", detail: "Clear aligners straighten teeth without braces, and porcelain veneers or custom crowns can transform your whole smile." },
    { id: "sedation", name: "Sedation & Relaxation", icon: "leaf", short: "Calm, comfortable visits for nervous patients.", detail: "If dental visits make you anxious, sedation options help you relax through your care." },
    { id: "dentures", name: "Dentures & Partials", icon: "smile", short: "Comfortable, natural-looking smiles.", detail: "Full and partial dentures made to fit well, plus cleanings to keep them looking their best." },
    { id: "gums", name: "Gum Care & Laser Therapy", icon: "shield", short: "Healthy gums, gently treated.", detail: "Scaling and root planing, laser periodontal therapy and treatment for gum recession keep your gums healthy." },
    { id: "sleep-tmj", name: "Sleep Apnea & TMJ Relief", icon: "sun", short: "Better sleep and less jaw pain.", detail: "Oral appliances for sleep apnea, BOTOX® for TMD/TMJ, and night and athletic guards." },
  ],

  // Their Google rating, as shown on their own website (Nov 2026).
  rating: { value: 4.9, count: 183, source: "Google" },

  design: "butter",
  // Their brand: sage green (vincennesdentalpractice.com), deepened for readable text.
  theme: { preset: "sage-blue", accent: "#4a7553" },

  sections: ["services", "reviews", "doctors", "newPatients", "faq"],
};

export default hermanFamilyDentistry;
