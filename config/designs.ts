/**
 * Designs: whole looks that share the same sections, content and code (one site, different skins).
 * Applied as <html data-design="...">; the look itself lives in app/designs.css.
 *
 *   butter    soft, airy, frosted glass (the original). Colours come from the theme preset.
 *   honey     warm and friendly: rounded type, solid colour blocks, grain, sticker shadows
 *   peach     sunrise: peach-to-lilac light, arch frames, graceful light serif
 *   cinnamon  scrapbook: tilted taped cards, polaroid photos, handwritten notes from the dentist
 *   oat       calm and natural: paper texture, plant sprigs, soft bookish serif, lots of space
 *   cocoa     cozy café: rich browns and cream, soft chunky serif, arches, wavy section edges
 *
 * Every design except butter brings its own colours (below), checked by `npm run check:contrast`.
 * An office picks one with `design`; sales demos preview any of them with ?design=honey.
 */
import { themeToCssVars, type ThemeTokens } from "./themes.ts";

export const DESIGNS = ["butter", "honey", "peach", "cinnamon", "oat", "cocoa"] as const;
export type Design = (typeof DESIGNS)[number];

export const designLabels: Record<Design, { label: string; feel: string }> = {
  butter: { label: "Butter", feel: "Soft, airy, frosted glass" },
  honey: { label: "Honey", feel: "Warm, friendly, handmade" },
  peach: { label: "Peach", feel: "Sunday-morning sunrise" },
  cinnamon: { label: "Cinnamon", feel: "A handwritten note from someone who knows you" },
  oat: { label: "Oat", feel: "A calm, cozy living room" },
  cocoa: { label: "Cocoa", feel: "Hot chocolate by the window" },
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
  oat: {
    label: "Oat",
    bg: "#f6f1e7",
    bg2: "#efe7d8",
    bg3: "#f3ede2",
    orb1: "#e3d6bf",
    orb2: "#d5dcc8",
    orb3: "#ead2c2",
    ink: "#2c2a24",
    muted: "#5b564b",
    accent: "#56694d",
    accent2: "#43543c",
    accentSoft: "#e5e9dc",
    success: "#2f6b45",
    danger: "#a3352b",
  },
  cocoa: {
    label: "Cocoa",
    bg: "#fbf4ec",
    bg2: "#f3e3d3",
    bg3: "#f7ece1",
    orb1: "#f2c9c0",
    orb2: "#e8c39e",
    orb3: "#f3dcc8",
    ink: "#3b2418",
    muted: "#6a4c3c",
    accent: "#8a4b2a",
    accent2: "#6b3519",
    accentSoft: "#f3e0d0",
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
