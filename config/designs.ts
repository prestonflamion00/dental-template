/**
 * Designs: whole looks that share the same sections, content and code (one site, different skins).
 * Applied as <html data-design="...">; the look itself lives in app/designs.css.
 *
 *   butter    soft, airy, frosted glass (the original). Colours come from the theme preset.
 *   crisp     editorial: big sans type, flat surfaces, thin lines, bento tiles
 *   honey     warm and friendly: rounded type, solid colour blocks, grain, sticker shadows
 *   midnight  dark and premium: high-contrast serif, gold accent, dark glass
 *
 * Every design except butter brings its own colours (below), checked by `npm run check:contrast`.
 * An office picks one with `design`; sales demos preview any of them with ?design=crisp.
 */
import { themeToCssVars, type ThemeTokens } from "./themes.ts";

export const DESIGNS = ["butter", "crisp", "honey", "midnight"] as const;
export type Design = (typeof DESIGNS)[number];

export const designLabels: Record<Design, { label: string; feel: string }> = {
  butter: { label: "Butter", feel: "Soft, airy, frosted glass" },
  crisp: { label: "Crisp", feel: "Editorial, confident, modern" },
  honey: { label: "Honey", feel: "Warm, friendly, handmade" },
  midnight: { label: "Midnight", feel: "Dark, premium, cinematic" },
};

/** Fixed palettes for the designs that don't use a theme preset. */
export const designPalettes: Record<Exclude<Design, "butter">, ThemeTokens> = {
  crisp: {
    label: "Crisp",
    bg: "#ffffff",
    bg2: "#f5f5f2",
    bg3: "#ffffff",
    orb1: "#ffffff",
    orb2: "#ffffff",
    orb3: "#ffffff",
    ink: "#111111",
    muted: "#4a4a4a",
    accent: "#1f4fd6",
    accent2: "#163a9e",
    accentSoft: "#e9eefc",
    success: "#1e6b3a",
    danger: "#b3261e",
  },
  honey: {
    label: "Honey",
    bg: "#fff7e8",
    bg2: "#ffefcf",
    bg3: "#fff3dc",
    orb1: "#ffd36b",
    orb2: "#ffb48a",
    orb3: "#bfe3d6",
    ink: "#2a1a0a",
    muted: "#5a4430",
    accent: "#b9420f",
    accent2: "#8f320b",
    accentSoft: "#ffe9d6",
    success: "#2f6b45",
    danger: "#a3352b",
  },
  midnight: {
    label: "Midnight",
    bg: "#0d1015",
    bg2: "#151a22",
    bg3: "#0b0d11",
    orb1: "#5a4521",
    orb2: "#173843",
    orb3: "#2c2036",
    ink: "#f3eee5",
    muted: "#b9b1a4",
    accent: "#d6b06a",
    accent2: "#b8924f",
    accentSoft: "#2a2419",
    success: "#74d19c",
    danger: "#ff8f84",
  },
};

/** A stylesheet with every design's colours. Beats the theme preset rules so ?design= can swap instantly. */
export function allDesignsCss(): string {
  return (Object.keys(designPalettes) as (keyof typeof designPalettes)[])
    .map((d) => {
      const body = Object.entries(themeToCssVars(designPalettes[d]))
        .map(([k, v]) => `${k}:${v}`)
        .join(";");
      return `:root[data-design="${d}"][data-theme]{${body}}`;
    })
    .join("\n");
}
