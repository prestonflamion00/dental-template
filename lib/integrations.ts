/**
 * ─────────────────────────────────────────────────────────────────────────
 *  INTEGRATION POINTS
 *  Every feature that would normally need a third-party API is mocked here,
 *  behind a small async function. To go live, replace the body of each
 *  function — the UI components don't need to change.
 * ─────────────────────────────────────────────────────────────────────────
 */
import type { RequestValues } from "./request";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ── 1. Scheduling ─────────────────────────────────────────────────────── */
/*
 * No live scheduling: "Request appointment" sends a request (section 2) and the office
 * calls or texts to confirm a time. To link to a practice's own online scheduler instead,
 * set `booking.url` in the office config and every request button links there.
 */

/* ── 2. Request form (appointments and questions) ──────────────────────── */

export interface ContactMessage extends RequestValues {
  /** Bot traps checked by the server: a hidden field that must stay empty, and when the form was first shown. */
  company: string;
  startedAt: number;
}

/** Set at build time for practices whose Worker runs worker/contact.ts; demos leave it unset and stay mocked. */
const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;
export const contactIsLive = !!CONTACT_ENDPOINT;

/**
 * Sends the request or question to the practice by email (worker/contact.ts), or pretends to when no endpoint is set.
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
