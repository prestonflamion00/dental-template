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

export function initials(name: string): string {
  return name
    .replace(/^Dr\.?\s+/i, "")
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
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
