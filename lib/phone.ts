/**
 * Phone numbers for the contact form. Shared with worker/contact.ts.
 * Lenient on purpose: people type numbers in many formats, so we only reject what can't be a phone number.
 *   +44 20 7946 0958, 0044…, 011 44…  international (7 to 15 digits, the E.164 limit)
 *   (555) 123-4567, 1-555-123-4567     US, shown as +1 (555) 123-4567
 *   anything else with 7 to 15 digits  kept as typed (could be a number from another country without its code)
 */

const MIN_DIGITS = 7;
const MAX_DIGITS = 15;

export type Phone = { ok: true; display: string } | { ok: false };

export function parsePhone(input: string): Phone {
  const typed = input.trim();
  let digits = typed.replace(/\D/g, "");
  let international = typed.startsWith("+");
  // 00 (most countries) and 011 (US, Canada) are dialing prefixes for "+".
  if (!international && /^(00|011)/.test(digits)) {
    digits = digits.replace(/^(00|011)/, "");
    international = true;
  }
  if (digits.length < MIN_DIGITS || digits.length > MAX_DIGITS) return { ok: false };

  const us = (d: string) => `+1 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  if (international) return { ok: true, display: digits.startsWith("1") && digits.length === 11 ? us(digits.slice(1)) : `+${digits}` };
  if (digits.length === 10) return { ok: true, display: us(digits) };
  if (digits.length === 11 && digits.startsWith("1")) return { ok: true, display: us(digits.slice(1)) };
  return { ok: true, display: `${typed} (no country code given)` };
}
