/**
 * Theme presets. Each preset is a set of CSS custom properties applied to
 * <html data-theme="...">. An office picks one with `theme.preset` and may
 * override the brand color with `theme.accent`.
 *
 * All text/background pairs are checked for WCAG AA by `npm run check:contrast`,
 * including text sitting on frosted glass over the most saturated orb colour.
 */

export const THEME_PRESETS = ["warm-neutral", "sage-blue", "blush-sand"] as const;
export type ThemePreset = (typeof THEME_PRESETS)[number];

export interface ThemeTokens {
  label: string;
  /** Page background gradient stops. */
  bg: string;
  bg2: string;
  bg3: string;
  /** Large blurred colour orbs behind the glass. */
  orb1: string;
  orb2: string;
  orb3: string;
  /** Headline / strong text. */
  ink: string;
  /** Body / secondary text. */
  muted: string;
  /** Brand colour: buttons, links, icons. */
  accent: string;
  /** Darker partner for gradients and hover. */
  accent2: string;
  /** Soft tint used behind icons and chips. */
  accentSoft: string;
  /** Status colours (open/closed). */
  success: string;
  danger: string;
}

export const themes: Record<ThemePreset, ThemeTokens> = {
  "warm-neutral": {
    label: "Warm neutral",
    bg: "#fbf7f1",
    bg2: "#f5ebdf",
    bg3: "#f8efe6",
    orb1: "#f2cfae",
    orb2: "#e9dcc5",
    orb3: "#f6d9c9",
    ink: "#2b211b",
    muted: "#5c4e44",
    accent: "#8c5233",
    accent2: "#6e3c22",
    accentSoft: "#f3e3d6",
    success: "#2f6b45",
    danger: "#a23b2c",
  },
  "sage-blue": {
    label: "Soft blue-sage",
    bg: "#f4f7f4",
    bg2: "#e6efea",
    bg3: "#eaf1f5",
    orb1: "#bfd8c9",
    orb2: "#c5dbe8",
    orb3: "#dfe8d2",
    ink: "#1d2a2b",
    muted: "#4a5a5b",
    accent: "#2f6670",
    accent2: "#214c54",
    accentSoft: "#dcebea",
    success: "#2b6a47",
    danger: "#a1392e",
  },
  "blush-sand": {
    label: "Blush sand",
    bg: "#fcf6f3",
    bg2: "#f7e9e3",
    bg3: "#f6ece2",
    orb1: "#f1c9c6",
    orb2: "#ecdcc6",
    orb3: "#f5d6d9",
    ink: "#2d1f22",
    muted: "#5e4a4e",
    accent: "#9c4659",
    accent2: "#7a3243",
    accentSoft: "#f6e1e3",
    success: "#2f6b45",
    danger: "#a3352b",
  },
};

/* ---------- colour helpers (no dependencies) ---------- */

type RGB = [number, number, number];

export function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex([r, g, b]: RGB): string {
  return "#" + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
}

function channel(v: number) {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Alpha-composite `top` (with opacity `alpha`) over `bottom`. */
export function mix(top: string, bottom: string, alpha: number): string {
  const t = hexToRgb(top);
  const b = hexToRgb(bottom);
  return rgbToHex([0, 1, 2].map((i) => t[i] * alpha + b[i] * (1 - alpha)) as RGB);
}

/** Darken a colour step by step until it reaches `target` contrast against `against`. */
export function ensureContrast(color: string, against: string, target = 4.6): string {
  let c = color;
  for (let i = 0; i < 40 && contrast(c, against) < target; i++) c = mix("#000000", c, 0.06);
  return c;
}

/** Opacity of white frosted glass surfaces (see .glass in globals.css). */
export const GLASS_ALPHA = 0.62;
/** Opacity the blurred orbs are painted at over the page background (see .orb in globals.css). */
export const ORB_OPACITY = 0.55;

/**
 * Every colour text can end up sitting on: the page gradient, orbs as painted
 * (without counting the blur, which only lightens them), frosted glass over each
 * of those, and the soft accent tint used for chips.
 */
export function textSurfaces(t: ThemeTokens): string[] {
  const page = [t.bg, t.bg2, t.bg3];
  const orbs = [t.orb1, t.orb2, t.orb3].flatMap((o) => page.map((p) => mix(o, p, ORB_OPACITY)));
  const raw = [...page, ...orbs];
  return [...raw, ...raw.map((b) => mix("#ffffff", b, GLASS_ALPHA)), t.accentSoft];
}

function darkest(colors: string[]): string {
  return colors.reduce((a, b) => (luminance(b) < luminance(a) ? b : a));
}

/**
 * Resolve the final tokens for an office: preset + optional accent override.
 * When an accent is supplied we derive hover/soft variants and darken it if
 * needed so white button text and accent-coloured text on glass stay AA.
 */
export function resolveTheme(preset: ThemePreset, accentOverride?: string): ThemeTokens {
  const base = themes[preset];
  if (!accentOverride) return base;
  // Button text is white and accent text sits on tinted glass: darken until both are ≥4.5:1.
  const accentSoft = mix(accentOverride, "#ffffff", 0.13);
  const accent = ensureContrast(accentOverride, darkest(textSurfaces({ ...base, accentSoft })));
  return {
    ...base,
    accent,
    accent2: mix("#000000", accent, 0.22),
    accentSoft,
  };
}

/** CSS custom properties for a resolved theme. */
export function themeToCssVars(t: ThemeTokens): Record<string, string> {
  const [r, g, b] = hexToRgb(t.accent);
  return {
    "--bg": t.bg,
    "--bg-2": t.bg2,
    "--bg-3": t.bg3,
    "--orb-1": t.orb1,
    "--orb-2": t.orb2,
    "--orb-3": t.orb3,
    "--ink": t.ink,
    "--muted": t.muted,
    "--accent": t.accent,
    "--accent-2": t.accent2,
    "--accent-soft": t.accentSoft,
    "--accent-rgb": `${r} ${g} ${b}`,
    "--success": t.success,
    "--danger": t.danger,
  };
}

/** A stylesheet defining every preset, so the demo switcher (?theme=) can swap instantly. */
export function allThemesCss(): string {
  return THEME_PRESETS.map((p) => {
    const vars = themeToCssVars(themes[p]);
    const body = Object.entries(vars)
      .map(([k, v]) => `${k}:${v}`)
      .join(";");
    return `:root[data-theme="${p}"]{${body}}`;
  }).join("\n");
}
