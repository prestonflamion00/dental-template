/**
 * Content for details an office file leaves out (used by config/build.ts).
 *
 * Generic content is true for any dental practice and can ship as-is (copy, first-visit steps, FAQs).
 * PLACEHOLDERS stand in for that practice's real facts: fine on a demo, but buildOffice refuses to
 * build a live site while any remain. Never invent doctors, reviews, ratings or awards here.
 */
import type { Day, DayHours, Faq, Service, Specialty, Step, Terms } from "./types.ts";
import { TRADES } from "./trades.ts";

/** Typical office hours, shown when we couldn't find theirs. */
export const PLACEHOLDER_HOURS: Record<Day, DayHours> = {
  mon: { open: "08:00", close: "17:00" },
  tue: { open: "08:00", close: "17:00" },
  wed: { open: "08:00", close: "17:00" },
  thu: { open: "08:00", close: "17:00" },
  fri: { open: "08:00", close: "14:00" },
  sat: null,
  sun: null,
};

/** Made-up plan names, so a demo never claims a practice takes a real insurer. */
export const PLACEHOLDER_INSURANCES = [
  "Brightline Dental PPO",
  "Summit Smile Plan",
  "Harbor Dental Network",
  "Evergreen Dental Care",
];

/** Everyday general dentistry, used when we don't know their services. */
export const GENERIC_SERVICES: Service[] = [
  {
    id: "cleanings",
    name: "Cleanings & Checkups",
    icon: "tooth",
    short: "Gentle cleanings and exams that keep small problems small.",
    detail: "A thorough cleaning, a careful exam and any X-rays you need, with a clear explanation of what we see.",
  },
  {
    id: "fillings",
    name: "Fillings & Repairs",
    icon: "shield",
    short: "Tooth-colored fillings that blend right in.",
    detail: "We repair cavities and chips with natural-looking materials, and numb the area so you stay comfortable.",
  },
  {
    id: "crowns",
    name: "Crowns & Bridges",
    icon: "crown",
    short: "Strong, natural-looking repairs for worn or damaged teeth.",
    detail: "Crowns protect weak teeth and bridges fill gaps, so you can chew and smile with confidence.",
  },
  {
    id: "whitening",
    name: "Teeth Whitening",
    icon: "sparkles",
    short: "A brighter smile, safely.",
    detail: "Professional whitening that's gentler and more even than store-bought kits.",
  },
  {
    id: "gum-care",
    name: "Gum Care",
    icon: "leaf",
    short: "Healthy gums for a healthy smile.",
    detail: "Deep cleanings and simple home-care advice to treat and prevent gum disease.",
  },
  {
    id: "emergency",
    name: "Emergency Visits",
    icon: "siren",
    short: "Tooth pain or a broken tooth? Call us.",
    detail: "Call as soon as you can and we'll help you get comfortable and back on track.",
  },
];

export const GENERIC_STEPS: Step[] = [
  { title: "Request a visit", text: "Request a time online or call. We’ll confirm by phone or text.", icon: "calendar" },
  { title: "Get ready", text: "We’ll check your insurance and let you know anything to bring.", icon: "clipboard" },
  { title: "Your first visit", text: "A gentle exam, a cleaning if you need one, and a clear plan with no surprises.", icon: "tooth" },
];

export const GENERIC_PERKS = ["Clear answers, no pressure", "Gentle, unhurried care", "Questions welcome, always"];

export const GENERIC_FAQS: Faq[] = [
  {
    q: "What happens at my first visit?",
    a: "We’ll get to know you, review your health history, take any X-rays you need and do a gentle exam. You’ll leave with a clear plan and no surprises.",
  },
  {
    q: "Do you take my insurance?",
    a: "Tell us your plan when you request an appointment, or give us a call, and we’ll check your benefits before your visit.",
  },
  {
    q: "What if I’m nervous about the dentist?",
    a: "You’re not alone. Let us know and we’ll go at your pace, explain each step and take breaks whenever you need.",
  },
  {
    q: "How often should I see the dentist?",
    a: "Most people do best with a checkup and cleaning every six months. We’ll recommend what’s right for you.",
  },
  {
    q: "What should I do in a dental emergency?",
    a: "Call us as soon as you can. If you have severe swelling or trouble breathing, go to the nearest emergency room.",
  },
];

/** Friendly wording that fits any practice; `city` (the town, or the offices' towns) and `name` personalize it. */
export function genericCopy(name: string, city: string) {
  return {
    heroEyebrow: `Dental care in ${city}`,
    heroHeadline: "Dental care that puts you at ease.",
    heroHighlight: "at ease",
    heroSubhead: "Friendly, unhurried visits for the whole family.",
    servicesIntro: "From routine cleanings to a brighter smile, here’s how we can help.",
    newPatientsIntro: "New here? Here’s what to expect, step by step.",
    doctorsIntro: "The people who’ll take care of you.",
    ctaHeadline: "Ready for your next visit?",
    ctaText: "Request an appointment online or give us a call, and we’ll find a time that works for you.",
    emergencyHeadline: "Dental emergency? Call us.",
    emergencyText: "Tooth pain, a broken tooth or swelling: call and we’ll help you as soon as we can.",
    reviewsIntro: "What our patients say about their visits.",
    faqIntro: "Answers to the questions we hear most.",
    contactIntro: "Questions, scheduling, or just want to say hi? We’re here.",
  };
}

/* ── Specialties: orthodontics and pediatric dentistry get their own defaults ── */

export const ORTHO_SERVICES: Service[] = [
  { id: "braces", name: "Traditional Braces", icon: "smile", short: "Reliable, proven braces for every age.", detail: "Metal braces gently guide teeth into place over time. They work for nearly every kind of bite and crowding." },
  { id: "invisalign", name: "Clear Aligners", icon: "aligners", short: "Nearly invisible, removable aligners.", detail: "A series of clear, removable aligners straightens teeth without brackets or wires. Take them out to eat and brush." },
  { id: "early-treatment", name: "Early Treatment", icon: "baby", short: "A head start for growing smiles.", detail: "Some bite and spacing problems are easier to fix while a child is still growing. We’ll tell you if waiting is better." },
  { id: "adult-treatment", name: "Adult Treatment", icon: "heart", short: "It’s never too late for a straighter smile.", detail: "Braces and clear aligners work for adults too, with options that fit around work and life." },
  { id: "retainers", name: "Retainers", icon: "shield", short: "Keep your new smile in place.", detail: "After treatment, a retainer keeps teeth from drifting back. We’ll fit one and show you how to care for it." },
  { id: "emergency", name: "Emergency Care", icon: "siren", short: "Broken bracket or poking wire? Call us.", detail: "Most orthodontic problems aren’t urgent, but they can be uncomfortable. Call and we’ll help you fix it fast." },
];

export const ORTHO_FAQS: Faq[] = [
  { q: "When should my child first see an orthodontist?", a: "The American Association of Orthodontists recommends a first check by age 7. Most kids won’t need treatment yet, but it helps spot problems early." },
  { q: "Braces or clear aligners: which is right for me?", a: "Both work well for most people. At your consultation we’ll look at your teeth and talk through what fits your goals and lifestyle." },
  { q: "How long does treatment take?", a: "It depends on your teeth, but many treatments take about one to two years. You’ll get a clear timeline before you start." },
  { q: "Do I need a referral from my dentist?", a: "You don’t usually need one. Just request an appointment or give us a call." },
  { q: "Do you take my insurance?", a: "Tell us your plan when you request an appointment, or call us, and we’ll check your orthodontic benefits before your visit." },
];

export const ORTHO_STEPS: Step[] = [
  { title: "Request a consultation", text: "Request a time online or call. We’ll confirm by phone or text.", icon: "calendar" },
  { title: "Meet your orthodontist", text: "A friendly exam to see what your smile needs, with time for all your questions.", icon: "smile" },
  { title: "Your plan", text: "Your options, timeline and costs explained clearly before anything starts.", icon: "clipboard" },
];

export const PEDIATRIC_SERVICES: Service[] = [
  { id: "first-visit", name: "First Visits", icon: "baby", short: "A gentle, happy start for little smiles.", detail: "We recommend a first visit by age one. It’s short, friendly and mostly about getting comfortable." },
  { id: "cleanings", name: "Cleanings & Checkups", icon: "tooth", short: "Fun, gentle cleanings that build good habits.", detail: "A careful cleaning and exam, plus simple brushing tips your child will actually remember." },
  { id: "sealants", name: "Sealants & Fluoride", icon: "shield", short: "Extra protection against cavities.", detail: "Quick, painless coatings that help protect growing teeth from cavities." },
  { id: "fillings", name: "Tooth-Colored Fillings", icon: "sparkles", short: "Gentle repairs that blend right in.", detail: "We fix cavities with natural-looking fillings and explain each step in kid-friendly words." },
  { id: "growth", name: "Growth & Bite Checks", icon: "smile", short: "Keeping an eye on growing smiles.", detail: "We watch how teeth and jaws grow, and let you know early if an orthodontist could help." },
  { id: "emergency", name: "Emergency Visits", icon: "siren", short: "Bumped or chipped tooth? Call us.", detail: "Kids are busy. If a tooth is hurt, call as soon as you can and we’ll help." },
];

export const PEDIATRIC_FAQS: Faq[] = [
  { q: "When should my child first see a dentist?", a: "The American Academy of Pediatric Dentistry recommends a first visit by age one, or within six months of the first tooth." },
  { q: "Can I stay with my child during the visit?", a: "Of course. Most parents stay close by, and we’ll explain everything as we go." },
  { q: "My child is nervous. What can I do?", a: "Tell us when you request the visit. We go slowly, use kid-friendly words and keep things fun." },
  { q: "Do you take my insurance?", a: "Tell us your plan when you request an appointment, or call us, and we’ll check your benefits before your visit." },
  { q: "What should I do if my child knocks out a tooth?", a: "Call us right away. For an adult tooth, keep it moist in milk and come in as quickly as you can." },
];

export const PEDIATRIC_STEPS: Step[] = [
  { title: "Request a visit", text: "Request a time online or call. We’ll confirm by phone or text.", icon: "calendar" },
  { title: "Meet the team", text: "A quick tour and a gentle hello, so your child feels at home.", icon: "heart" },
  { title: "A happy checkup", text: "A gentle look and cleaning, plus simple tips for healthy habits at home.", icon: "tooth" },
];

/** Everything a specialty changes. `copy` takes the practice name and city. */
/** Dental wording (patients, appointments, insurance); the home-services trades have their own in config/trades.ts. */
export const DENTAL_TERMS: Terms = {
  trade: "Dentist",
  craft: "dental care",
  business: "a dental office",
  customer: "patient",
  customers: "patients",
  request: "Request appointment",
  requestShort: "Request visit",
  requestTitle: "Request an appointment",
  requestEyebrow: "Appointments",
  requestKind: "Appointment",
  requestSubject: "Appointment request",
  newCustomer: "I’m a new patient",
  insurance: true,
  privacyNote: "Please don’t include medical details or insurance numbers.",
  requestAside: { title: "We check your insurance", text: "" },
  emergency: "Emergency",
  emergencyWarning: "Severe swelling, trouble breathing or a serious injury? Call 911 or go to the nearest emergency room.",
  accepting: "Accepting new patients",
  newCustomersNav: "New Patients",
  newCustomersEyebrow: "New patients",
  newCustomersTitle: "Your first visit, made easy",
  team: "dentists",
  teamTitle: "Our dentists",
  reviewsEyebrow: "Patient stories",
  reviewsTitle: "Smiles, in their own words",
  servicesTitle: "Care for every smile",
  servicesNote: "Every smile is different. We’ll talk through options and costs before any treatment.",
  servicesPageTitle: "Dental services",
  galleryEyebrow: "Smile gallery",
  galleryIntro: "Slide to compare. Every plan is designed around the person.",
  galleryNote: "Illustrations shown as placeholders. Real patient photos are shared with consent. Individual results vary.",
  disclaimer: "The information on this site is general and not a substitute for professional dental advice.",
  schemaType: "Dentist",
  icon: "tooth",
};

export const SPECIALTY: Record<
  Specialty,
  { label: string; services: Service[]; faqs: Faq[]; steps: Step[]; perks: string[]; terms?: Terms; copy: (name: string, city: string) => Omit<ReturnType<typeof genericCopy>, "heroHighlight"> & { heroHighlight?: string } }
> = {
  ...TRADES,
  general: { label: "Dentist", services: GENERIC_SERVICES, faqs: GENERIC_FAQS, steps: GENERIC_STEPS, perks: GENERIC_PERKS, copy: genericCopy },
  orthodontics: {
    label: "Orthodontist",
    services: ORTHO_SERVICES,
    faqs: ORTHO_FAQS,
    steps: ORTHO_STEPS,
    perks: ["Clear options, no pressure", "Care for kids, teens and adults", "Questions welcome, always"],
    copy: (name, city) => ({
      ...genericCopy(name, city),
      heroEyebrow: `Orthodontics in ${city}`,
      heroHeadline: "Straighter smiles for the whole family.",
      heroHighlight: "for the whole family",
      heroSubhead: "Braces, clear aligners and early treatment for every age.",
      servicesIntro: "Options for every age and every smile.",
      newPatientsIntro: "Thinking about braces or aligners? Here’s how getting started works.",
      doctorsIntro: "Experienced orthodontic care, close to home.",
      ctaHeadline: "Ready to start your smile?",
      ctaText: "Request a consultation online or give us a call, and we’ll find a time that works for you.",
      emergencyHeadline: "Broken bracket or poking wire?",
      emergencyText: "Call us and we’ll help you get comfortable fast. Most fixes are quick and simple.",
      reviewsIntro: "What families say about their smiles.",
      faqIntro: "Answers to the questions families ask us most.",
      contactIntro: "Questions about braces or aligners? We’re happy to help.",
    }),
  },
  pediatric: {
    label: "Pediatric dentist",
    services: PEDIATRIC_SERVICES,
    faqs: PEDIATRIC_FAQS,
    steps: PEDIATRIC_STEPS,
    perks: ["Kid-friendly, never rushed", "Parents always welcome", "Questions welcome, always"],
    copy: (name, city) => ({
      ...genericCopy(name, city),
      heroEyebrow: `Pediatric dentistry in ${city}`,
      heroHeadline: "Happy visits for growing smiles.",
      heroHighlight: "for growing smiles",
      heroSubhead: "Gentle, fun dental care for babies, kids and teens.",
      servicesIntro: "Everything little smiles need, explained in kid-friendly words.",
      newPatientsIntro: "First visit? Here’s what to expect, step by step.",
      doctorsIntro: "The friendly faces your kids will get to know.",
      ctaHeadline: "Ready for a happy checkup?",
      emergencyHeadline: "Bumped or chipped tooth?",
      emergencyText: "Call us right away and we’ll help. Kids’ dental emergencies are our everyday.",
      reviewsIntro: "What parents say about their visits.",
      faqIntro: "Answers to the questions parents ask us most.",
      contactIntro: "Questions about your child’s smile? We’d love to help.",
    }),
  },
};
