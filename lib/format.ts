import type { OfficeConfig } from "@/config/types";

/** "(503) 555-0142" → "tel:+15035550142" (assumes NANP numbers when 10 digits). */
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `tel:+${digits.length === 10 ? "1" + digits : digits}`;
}

export function fullAddress(a: OfficeConfig["contact"]["address"]): string {
  return `${a.street}, ${a.city}, ${a.region} ${a.postalCode}`;
}

/**
 * Directions link props, by device: the link is Google Maps (opens the Google Maps app on Android,
 * the website on computers). On a Mac a click handler (app/layout.tsx) swaps in `data-apple-maps`.
 * On iPhone and iPad a chooser opens instead (components/ui/MapsChooser.tsx): Apple Maps, Google
 * Maps, Waze or copy the address. Every link searches the practice name
 * plus address (Google also its listing ID, Waze its coordinates), so they land on the practice.
 */
export function mapsProps(l: Pick<OfficeConfig["locations"][number], "address" | "label" | "placeId" | "geo">) {
  const q = encodeURIComponent([l.label, fullAddress(l.address)].filter(Boolean).join(", "));
  return {
    href: `https://www.google.com/maps/search/?api=1&query=${q}${l.placeId ? `&query_place_id=${encodeURIComponent(l.placeId)}` : ""}`,
    "data-apple-maps": `https://maps.apple.com/?q=${q}${l.geo ? `&sll=${l.geo.lat},${l.geo.lng}` : ""}`,
    "data-waze": `https://waze.com/ul?${l.geo ? `ll=${l.geo.lat},${l.geo.lng}&` : `q=${q}&`}navigate=yes`,
    "data-address": [l.label, fullAddress(l.address)].filter(Boolean).join(", "),
  };
}

/** "Dr. Lakshmi P. Thalanki" -> "LT": shown where a doctor has no photo. */
export function initials(name: string): string {
  const words = name.replace(/^dr\.?\s+/i, "").split(/\s+/).filter(Boolean);
  return ((words[0]?.[0] ?? "") + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}

export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Prefix a site-relative path ("/doctors/a.svg", "/privacy") with the deploy
 * sub-folder, e.g. "/dental-template" on GitHub Pages. No-op on Vercel/root hosts.
 */
export function withBase(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return base && path.startsWith("/") && !path.startsWith("//") ? base + path : path;
}

/** URL-friendly name for a doctor's page: "Dr. Eric Herman" → "dr-eric-herman". */
export function doctorSlug(name: string): string {
  return name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Short form for buttons: "Dr. Lynn Stine" → "Dr. Stine"; other names → first name. */
export function doctorShortName(name: string): string {
  return /^Dr\.?\s/.test(name) ? `Dr. ${name.split(" ").at(-1)}` : name.split(" ")[0];
}

/** How the business gets back to people: "call or text", or just "call" when it doesn't text (terms.texts). */
export const confirmVerb = (terms: { texts?: boolean }) => (terms.texts === false ? "call" : "call or text");
/** The same as a channel: "phone or text", or "phone". */
export const confirmChannel = (terms: { texts?: boolean }) => (terms.texts === false ? "phone" : "phone or text");
