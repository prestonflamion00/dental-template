/**
 * Content for details an office file leaves out (used by config/build.ts).
 *
 * Generic content is true for any dental practice and can ship as-is (copy, first-visit steps, FAQs).
 * PLACEHOLDERS stand in for that practice's real facts: fine on a demo, but buildOffice refuses to
 * build a live site while any remain. Never invent doctors, reviews, ratings or awards here.
 */
import type { Day, DayHours, Faq, Service, Step } from "./types.ts";

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
  "Northstar Dental HMO",
  "Cornerstone Dental Benefits",
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

/** Friendly wording that fits any practice; `city` and `name` personalize it. */
export function genericCopy(name: string, city: string) {
  return {
    heroEyebrow: `Dental care in ${city}`,
    heroHeadline: "Dental care that puts you at ease.",
    heroHighlight: "at ease",
    heroSubhead: `Friendly, unhurried visits for the whole family at ${name}.`,
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
