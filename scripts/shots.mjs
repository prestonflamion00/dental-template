/**
 * Clean phone screenshots of any site built from this template (demos or client sites), for
 * thumbnails, sales material and link previews.
 *
 *   node scripts/shots.mjs <outDir> <name>=<url> [<name>=<url> ...]
 *   e.g. node scripts/shots.mjs business-site/public/img butter="https://demos.butterbite.workers.dev/maple-grove/?design=butter"
 *
 * Writes three WebP files per site:
 *   <name>.webp          a tall phone "highlight reel": hero, quick info, services, team and reviews, for scrolling thumbnails
 *   <name>-top.webp      the phone's first screen, for static phone mockups
 *   <name>-desktop.webp  the first screen on a laptop (1440 x 900), for desktop mockups
 *
 * "Clean" means: no demo banner, no sticky call/book bar, no demo picker, every scroll-in
 * animation finished, fonts loaded. Uses the Playwright that is installed with Chromium.
 */
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const [outDir, ...pairs] = process.argv.slice(2);
if (!outDir || !pairs.length || pairs.some((p) => !p.includes("="))) {
  console.error("Usage: node scripts/shots.mjs <outDir> <name>=<url> [<name>=<url> ...]");
  process.exit(1);
}

const WIDTH = 390; // a typical phone, in CSS pixels
const SCALE = 1.5; // sharp on retina screens without huge files
const TOP_HEIGHT = 780; // first screen, 1:2 like the phone frames
const REEL_MAX = 5200; // longest reel, in CSS pixels
const QUALITY = 0.78;
const DESKTOP = { width: 1440, height: 900 };

const CLEAN_CSS = `
  .demo-banner, [data-mobile-bar], [aria-label="Demo: preview design"] { display: none !important; }
  body { padding-bottom: 0 !important; }
  html.js [data-reveal] { opacity: 1 !important; transform: none !important; transition: none !important; }
  *, *::before, *::after { animation-play-state: paused !important; caret-color: transparent !important; }
`;
// Sections kept in the reel: the ones where each design's character shows.
const REEL_CSS = `
  main > section:not(#top):not([aria-label="Hours and location at a glance"]):not(#services):not(#doctors):not(#reviews),
  body > footer, footer { display: none !important; }
  /* A taste of each list, not all of it: three services (plus the helper card), the first team member, two reviews. */
  #services ul > li:nth-child(n + 4):not(:last-child),
  #doctors ul > li:nth-child(n + 2),
  #reviews li.glass:nth-of-type(n + 3) { display: none !important; }
`;

/** Encode a PNG buffer as WebP using the browser's own encoder (no image libraries needed). */
async function toWebp(page, png) {
  const dataUrl = await page.evaluate(
    async ([b64, q]) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      c.getContext("2d").drawImage(img, 0, 0);
      return c.toDataURL("image/webp", q);
    },
    [png.toString("base64"), QUALITY],
  );
  return Buffer.from(dataUrl.split(",")[1], "base64");
}

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const encoder = await browser.newPage();

for (const pair of pairs) {
  const i = pair.indexOf("=");
  const name = pair.slice(0, i);
  const url = pair.slice(i + 1);
  const page = await browser.newPage({ viewport: { width: WIDTH, height: TOP_HEIGHT }, deviceScaleFactor: SCALE });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: CLEAN_CSS });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);

  const top = await page.screenshot({ clip: { x: 0, y: 0, width: WIDTH, height: TOP_HEIGHT } });
  writeFileSync(join(outDir, `${name}-top.webp`), await toWebp(encoder, top));

  await page.addStyleTag({ content: REEL_CSS });
  await page.waitForTimeout(300);
  const height = Math.min(REEL_MAX, await page.evaluate(() => document.documentElement.scrollHeight));
  const reel = await page.screenshot({ fullPage: true, clip: { x: 0, y: 0, width: WIDTH, height } });
  writeFileSync(join(outDir, `${name}.webp`), await toWebp(encoder, reel));
  await page.close();

  const desk = await browser.newPage({ viewport: DESKTOP });
  await desk.goto(url, { waitUntil: "networkidle" });
  await desk.addStyleTag({ content: CLEAN_CSS });
  await desk.evaluate(() => document.fonts.ready);
  await desk.waitForTimeout(600);
  writeFileSync(join(outDir, `${name}-desktop.webp`), await toWebp(encoder, await desk.screenshot()));
  await desk.close();
  console.log(`✓ ${name}: ${url}`);
}
await browser.close();
