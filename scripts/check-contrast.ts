/**
 * WCAG AA contrast audit for every theme preset (and a few sample accent overrides).
 *
 * Worst cases checked:
 *  - text placed directly on the page background or on an orb as painted (ignoring blur)
 *  - text on frosted glass (white @ GLASS_ALPHA) composited over each of those
 *  - white text on the accent buttons
 *
 * Run: npm run check:contrast   (Node 22+, uses built-in TypeScript stripping)
 */
import { THEME_PRESETS, themes, resolveTheme, contrast, mix, textSurfaces, type ThemeTokens } from "../config/themes.ts";
import { designPalettes } from "../config/designs.ts";

const AA = 4.5;
let failures = 0;

function check(label: string, fg: string, bg: string, min = AA) {
  const c = contrast(fg, bg);
  if (c < min) {
    failures++;
    console.log(`  ✗ ${label}: ${fg} on ${bg} = ${c.toFixed(2)} (needs ${min})`);
  }
  return c;
}

function audit(name: string, t: ThemeTokens) {
  const surfaces = textSurfaces(t);
  let worst = Infinity;
  for (const s of surfaces) {
    worst = Math.min(worst, check(`${name} ink`, t.ink, s));
    worst = Math.min(worst, check(`${name} muted`, t.muted, s));
    worst = Math.min(worst, check(`${name} accent text`, t.accent, s));
    check(`${name} success`, t.success, s);
    check(`${name} danger`, t.danger, s);
  }
  const btn = Math.min(check(`${name} button`, "#ffffff", t.accent), check(`${name} button hover`, "#ffffff", t.accent2));
  console.log(`${name.padEnd(28)} worst text-on-surface ${worst.toFixed(2)}:1 · button ${btn.toFixed(2)}:1`);
}

for (const p of THEME_PRESETS) audit(p, themes[p]);
for (const accent of ["#f59fb0", "#7dd3c0", "#ffcc00", "#3b82f6"]) {
  for (const p of THEME_PRESETS) audit(`${p} + ${accent}`, resolveTheme(p, accent));
}

// Designs with their own palettes: flat or dark cards instead of white glass (see app/designs.css).
const designCards: Record<keyof typeof designPalettes, (t: ThemeTokens) => string> = {
  crisp: () => "#ffffff",
  honey: () => "#fffdf8",
  midnight: (t) => mix("#ffffff", t.bg2, 0.07),
};
for (const [d, t] of Object.entries(designPalettes) as [keyof typeof designPalettes, ThemeTokens][]) {
  const onAccent = d === "midnight" ? "#14110b" : "#ffffff";
  let worst = Infinity;
  for (const s of [t.bg, t.bg2, t.bg3, t.accentSoft, designCards[d](t)]) {
    for (const [k, fg] of [["ink", t.ink], ["muted", t.muted], ["accent text", t.accent], ["success", t.success], ["danger", t.danger]]) {
      const c = check(`design ${d} ${k}`, fg, s);
      if (k !== "success" && k !== "danger") worst = Math.min(worst, c);
    }
  }
  const btn = check(`design ${d} button`, onAccent, t.accent);
  console.log(`${("design " + d).padEnd(28)} worst text-on-surface ${worst.toFixed(2)}:1 · button ${btn.toFixed(2)}:1`);
}

if (failures) {
  console.log(`\n${failures} contrast failure(s).`);
  process.exit(1);
}
console.log("\nAll text/background pairs pass WCAG AA (4.5:1).");
