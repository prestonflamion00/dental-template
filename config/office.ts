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

import type { OfficeConfig, OfficeInput } from "./types";
import { buildOffice } from "./build";
import mapleGrove from "./offices/maple-grove";
import lumiere from "./offices/lumiere";
import littleSprouts from "./offices/little-sprouts";
import familyOrthodonticsHudson from "./offices/family-orthodontics-hudson";
import copelinDental from "./offices/copelin-dental";
import hermanFamilyDentistry from "./offices/herman-family-dentistry";
import pelicanPlumbing from "./offices/pelican-plumbing";
import timberlineAir from "./offices/timberline-air";
import prairieOak from "./offices/prairie-oak";
import seminoleScooters from "./offices/seminole-scooters";

/** Registry: key = file name in config/offices/ = URL slug. */
export const offices = {
  "maple-grove": mapleGrove,
  lumiere: lumiere,
  "little-sprouts": littleSprouts,
  "family-orthodontics-hudson": familyOrthodonticsHudson,
  "copelin-dental": copelinDental,
  "herman-family-dentistry": hermanFamilyDentistry,
  // Home services (fictional samples)
  "pelican-plumbing": pelicanPlumbing,
  "timberline-air": timberlineAir,
  "prairie-oak": prairieOak,
  // Real prospects (private previews)
  "seminole-scooters": seminoleScooters,
} satisfies Record<string, OfficeInput>;
export type OfficeKey = keyof typeof offices;

// NEXT_PUBLIC_OFFICE picks the office at build time (set by build-all, or per Vercel project).
const envKey = process.env.NEXT_PUBLIC_OFFICE;
if (envKey && !(envKey in offices)) {
  throw new Error(
    `NEXT_PUBLIC_OFFICE="${envKey}" is not registered in config/office.ts. Add it to the \`offices\` list.`,
  );
}
// buildOffice fills anything the office file leaves out and fixes the section order (config/build.ts).
const built: OfficeConfig = buildOffice(offices[(envKey as OfficeKey) || ACTIVE_OFFICE]);
// Mockup builds only: NEXT_PUBLIC_HERO_LAYOUT / NEXT_PUBLIC_NAME_MORPH try a phone hero layout or
// name hand-over on every practice at once.
const layout = process.env.NEXT_PUBLIC_HERO_LAYOUT as OfficeConfig["heroLayout"] | undefined;
const morph = process.env.NEXT_PUBLIC_NAME_MORPH as OfficeConfig["nameMorph"] | undefined;
const office: OfficeConfig = { ...built, ...(layout ? { heroLayout: layout } : {}), ...(morph ? { nameMorph: morph } : {}) };

export default office;
export type { OfficeConfig } from "./types";
