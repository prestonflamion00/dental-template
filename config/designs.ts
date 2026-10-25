/**
 * Designs: whole looks that share the same sections, content and code (one site, different skins).
 * Applied as <html data-design="...">; the look itself lives in app/designs.css.
 *
 *   butter    soft, airy, frosted glass (the original). Colours come from the theme preset.
 *   honey     warm and friendly: rounded type, solid colour blocks, grain, sticker shadows
 *   peach     sunrise: peach-to-lilac light, arch frames, graceful light serif
 *   cinnamon  scrapbook: tilted taped cards, polaroid photos, handwritten notes from the dentist
 *
 * Every design except butter brings its own colours (below), checked by `npm run check:contrast`.
 * An office picks one with `design`; sales demos preview any of them with ?design=honey.
 */
import { themeToCssVars, type ThemeTokens } from "./themes.ts";

export const DESIGNS = ["butter", "honey", "peach", "cinnamon"] as const;
export type Design = (typeof DESIGNS)[number];

export const designLabels: Record<Design, { label: string; feel: string }> = {
  butter: { label: "Butter", feel: "Soft, airy, frosted glass" },
  honey: { label: "Honey", feel: "Warm, friendly, handmade" },
  peach: { label: "Peach", feel: "Sunday-morning sunrise" },
  cinnamon: { label: "Cinnamon", feel: "A handwritten note from someone who knows you" },
};

/** Fixed palettes for the designs that don't use a theme preset. */
export const designPalettes: Record<Exclude<Design, "butter">, ThemeTokens> = {
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
  peach: {
    label: "Peach",
    bg: "#fff4ec",
    bg2: "#ffe6d6",
    bg3: "#fbe6ee",
    orb1: "#ffc4a3",
    orb2: "#ffdca0",
    orb3: "#ebcdf0",
    ink: "#3a2321",
    muted: "#6b4b45",
    accent: "#b0453a",
    accent2: "#8d3329",
    accentSoft: "#fde3d8",
    success: "#2f6b45",
    danger: "#a3352b",
  },
  cinnamon: {
    label: "Cinnamon",
    bg: "#fbf3e6",
    bg2: "#f6e8d3",
    bg3: "#f8eedf",
    orb1: "#e9b949",
    orb2: "#b9c7a9",
    orb3: "#f2c4a7",
    ink: "#33201a",
    muted: "#64483b",
    accent: "#a3441e",
    accent2: "#7f3315",
    accentSoft: "#f8e2d2",
    success: "#2f6b45",
    danger: "#a3352b",
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
