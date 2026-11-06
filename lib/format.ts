import type { OfficeConfig } from "@/config/types";

/** "(503) 555-0142" → "tel:+15035550142" (assumes NANP numbers when 10 digits). */
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `tel:+${digits.length === 10 ? "1" + digits : digits}`;
}

export function fullAddress(a: OfficeConfig["contact"]["address"]): string {
  return `${a.street}, ${a.city}, ${a.region} ${a.postalCode}`;
}

/** Opens native maps on phones (Apple/Google both handle this URL). */
export function mapsHref(a: OfficeConfig["contact"]["address"]): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress(a))}`;
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
