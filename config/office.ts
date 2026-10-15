/**
 * ┌──────────────────────────────────────────────────────────────┐
 * │  ACTIVE OFFICE — change this one line to switch practices.   │
 * └──────────────────────────────────────────────────────────────┘
 *
 * Options: "family" | "cosmetic" | "pediatric" (or any file you add below).
 * You can also set NEXT_PUBLIC_OFFICE in the environment (e.g. per Vercel
 * project) to deploy several offices from one repo without editing code.
 */
const ACTIVE_OFFICE: OfficeKey = "family";

import type { OfficeConfig } from "./types";
import family from "./offices/family";
import cosmetic from "./offices/cosmetic";
import pediatric from "./offices/pediatric";

/** Registry of available offices. Add a new office: import it and add a key here. */
export const offices = { family, cosmetic, pediatric } satisfies Record<string, OfficeConfig>;
export type OfficeKey = keyof typeof offices;

const envKey = process.env.NEXT_PUBLIC_OFFICE as OfficeKey | undefined;
const office: OfficeConfig = offices[envKey && envKey in offices ? envKey : ACTIVE_OFFICE];

export default office;
export type { OfficeConfig } from "./types";
