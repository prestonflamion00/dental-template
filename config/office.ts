/**
 * ┌──────────────────────────────────────────────────────────────┐
 * │  ACTIVE OFFICE — change this one line to switch practices.   │
 * └──────────────────────────────────────────────────────────────┘
 *
 * Used for `npm run dev`. Each key is also the practice's web address on the
 * live site, e.g. "maple-grove" → https://<user>.github.io/<repo>/maple-grove/
 *
 * The live site builds EVERY office listed below (see scripts/build-all.mjs),
 * so adding a practice = add its file in config/offices/ + one line here.
 */
const ACTIVE_OFFICE: OfficeKey = "maple-grove";

import type { OfficeConfig } from "./types";
import mapleGrove from "./offices/maple-grove";
import lumiere from "./offices/lumiere";
import littleSprouts from "./offices/little-sprouts";

/** Registry: key = file name in config/offices/ = URL slug. */
export const offices = {
  "maple-grove": mapleGrove,
  lumiere: lumiere,
  "little-sprouts": littleSprouts,
} satisfies Record<string, OfficeConfig>;
export type OfficeKey = keyof typeof offices;

// NEXT_PUBLIC_OFFICE picks the office at build time (set by build-all, or per Vercel project).
const envKey = process.env.NEXT_PUBLIC_OFFICE;
if (envKey && !(envKey in offices)) {
  throw new Error(
    `NEXT_PUBLIC_OFFICE="${envKey}" is not registered in config/office.ts. Add it to the \`offices\` list.`,
  );
}
const office: OfficeConfig = offices[(envKey as OfficeKey) || ACTIVE_OFFICE];

export default office;
export type { OfficeConfig } from "./types";
