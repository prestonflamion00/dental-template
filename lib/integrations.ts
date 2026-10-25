/**
 * ─────────────────────────────────────────────────────────────────────────
 *  INTEGRATION POINTS
 *  Every feature that would normally need a third-party API is mocked here,
 *  behind a small async function. To go live, replace the body of each
 *  function — the UI components don't need to change.
 * ─────────────────────────────────────────────────────────────────────────
 */
import type { Day, DayHours } from "@/config/types";
import { dayFromDate } from "./hours";
import type { ContactTopic } from "./contact-topics";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ── 1. Scheduling ─────────────────────────────────────────────────────── */

export interface Slot {
  /** ISO-like local label "2026-10-15T09:30" */
  id: string;
  label: string; // "9:30 AM"
  available: boolean;
}

/**
 * MOCK: returns fake availability derived from office hours.
 * REPLACE WITH: your practice-management / scheduling API, e.g.
 *   NexHealth   GET /appointment_slots?provider_ids[]=…&start_date=…
 *   LocalMed, Weave, Dentrix Ascend, Open Dental API, or Zocdoc.
 * Call it from a serverless route (app/api/slots/route.ts) so API keys stay server-side.
 */
export async function getAvailableSlots(
  date: Date,
  hours: Record<Day, DayHours>,
  slotMinutes: number,
  serviceId: string,
): Promise<Slot[]> {
  await wait(250);
  const h = hours[dayFromDate(date)];
  if (!h) return [];
  const [oh, om] = h.open.split(":").map(Number);
  const [ch, cm] = h.close.split(":").map(Number);
  const slots: Slot[] = [];
  const ymd = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  // Deterministic pseudo-random "booked" pattern so the demo looks realistic.
  const seed = date.getDate() * 7 + serviceId.length;
  for (let t = oh * 60 + om, i = 0; t + slotMinutes <= ch * 60 + cm; t += slotMinutes, i++) {
    if (t >= 12 * 60 && t < 13 * 60) continue; // lunch
    const hh = Math.floor(t / 60);
    const mm = t % 60;
    const label = `${hh % 12 === 0 ? 12 : hh % 12}:${String(mm).padStart(2, "0")} ${hh >= 12 ? "PM" : "AM"}`;
    slots.push({ id: `${ymd}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`, label, available: (seed + i * 3) % 5 > 1 });
  }
  return slots;
}

export interface BookingRequest {
  serviceId: string;
  serviceName: string;
  slotId: string;
  name: string;
  phone: string;
  email: string;
  patientType: "new" | "existing";
  notes?: string;
}

/**
 * MOCK: pretends to create an appointment.
 * REPLACE WITH: a POST to your scheduling provider (via a server route), or
 * set `booking.url` in the office config to skip this modal entirely and
 * link to a hosted booking page.
 */
export async function submitBooking(req: BookingRequest): Promise<{ ok: true; confirmation: string }> {
  await wait(900);
  void req;
  return { ok: true, confirmation: "APT-" + Math.random().toString(36).slice(2, 7).toUpperCase() };
}

/* ── 2. Contact form ───────────────────────────────────────────────────── */

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  topic: ContactTopic;
  message: string;
  /** Bot traps checked by the server: a hidden field that must stay empty, and when the form was first shown. */
  company: string;
  startedAt: number;
}

/** Set at build time for practices whose Worker runs worker/contact.ts; demos leave it unset and stay mocked. */
const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;
export const contactIsLive = !!CONTACT_ENDPOINT;

/**
 * Sends the message to the practice by email (worker/contact.ts), or pretends to when no endpoint is set.
 * Throws if the server couldn't send it, so the form can show an error.
 */
export async function sendContactMessage(msg: ContactMessage): Promise<{ ok: true }> {
  if (!CONTACT_ENDPOINT) {
    await wait(900);
    return { ok: true };
  }
  const res = await fetch(CONTACT_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(msg),
  });
  if (!res.ok) throw new Error(`Contact form failed (${res.status})`);
  return { ok: true };
}

/* ── 3. Reviews ────────────────────────────────────────────────────────── */
/*
 * MOCK: reviews and the rating badge come from the office config.
 * REPLACE WITH: Google Places API (Place Details → rating, user_ratings_total,
 * reviews) fetched at build time, or a widget from Birdeye / Podium / Weave.
 */

/* ── 4. Map ────────────────────────────────────────────────────────────── */
/*
 * MOCK: components/sections/Contact.tsx renders an illustrated map card that
 * links out to Google Maps (no API key needed).
 * REPLACE WITH: a Google Maps Embed iframe
 *   <iframe src={`https://www.google.com/maps/embed/v1/place?key=KEY&q=${address}`} />
 * or a free OpenStreetMap embed. Load it lazily (loading="lazy").
 */
