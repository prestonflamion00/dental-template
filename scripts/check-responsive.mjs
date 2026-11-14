/**
 * Responsive check: loads each page at widths from a small phone to a large desktop and reports
 * anything wider than the screen (the usual cause of sideways scrolling and cut-off content), and
 * any button, link or text that spills out of its card.
 * It also checks the first screen ("above the fold") on common devices: before any scrolling, every
 * site must show the practice name, what they do (the headline), Request appointment, Call, the
 * open/closed status and the Emergency button, and on phones nothing of the next section.
 * On phones it also swipes through every sideways-scrolling row and checks each card stops at least
 * 12px from the screen's left edge (cards must never sit flush against the edge after a swipe).
 * Optionally saves a screenshot per width for a quick visual pass.
 *
 *   node scripts/check-responsive.mjs [--shots <dir>] <url> [<url> ...]
 *   e.g. node scripts/check-responsive.mjs "https://demos.butterbite.workers.dev/maple-grove/?design=honey"
 *
 * Exits 1 if any page overflows, so it can gate a release.
 */
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const { chromium } = createRequire(import.meta.url)("playwright");

// Small phone, common phones, large phone, small tablet, iPad portrait/landscape, laptops, desktops.
const WIDTHS = [320, 360, 390, 430, 600, 768, 834, 1024, 1180, 1280, 1440, 1920];

// Screens for the first-screen rule: small iPhone, iPhone, large iPhone, iPad, laptop, desktop.
const FOLD_SCREENS = [[375, 667], [390, 844], [430, 932], [768, 1024], [1280, 800], [1440, 900]];
const FOLD_MUST_SHOW = {
  // The bar's logo, or the big name in a photo-first hero (the bar's logo steps aside while it shows).
  "practice name": '#hero-name, header a[href="#top"]',
  headline: "#hero-title",
  // The request button, or (dealers) the button to their listings.
  "Request button": '#hero-actions a[href="#request"], #hero-actions a[href="#inventory"]',
  Call: '#hero-actions a[href^="tel:"]',
  "open/closed status": '#top a[href="#contact"]',
  Emergency: '#top a[href="#emergency"]',
};

const args = process.argv.slice(2);
let shotsDir = null;
if (args[0] === "--shots") {
  shotsDir = args[1];
  args.splice(0, 2);
  mkdirSync(shotsDir, { recursive: true });
}
if (!args.length) {
  console.error("Usage: node scripts/check-responsive.mjs [--shots <dir>] <url> [<url> ...]");
  process.exit(1);
}

const browser = await chromium.launch();
let problems = 0;
for (const url of args) {
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "html.js [data-reveal]{opacity:1!important;transform:none!important}" });
    const result = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const offenders = [];
      for (const el of document.querySelectorAll("body *")) {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden" || cs.position === "fixed") continue;
        // Decorative layers and swipeable carousels are allowed past the edge.
        if (el.closest('.ambient, .orb-local, .snap-row, [aria-hidden="true"]')) continue;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height || (r.right <= vw + 1 && r.left >= -1)) continue;
        let clipped = false;
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
          if (getComputedStyle(a).overflowX !== "visible") { clipped = true; break; }
        }
        if (clipped) continue;
        const where = el.closest("section, header, footer");
        const label = where ? where.id || where.getAttribute("aria-label") || where.tagName.toLowerCase() : "page";
        offenders.push(`${label}: <${el.tagName.toLowerCase()}> "${(el.textContent || "").trim().slice(0, 40)}"`);
      }
      // Content poking out of its card fits the screen but still looks broken.
      for (const el of document.querySelectorAll(".glass :is(a, button, h1, h2, h3, h4, p, li, span)")) {
        if (el.closest('[aria-hidden="true"]')) continue;
        const card = el.parentElement.closest(".glass");
        const r = el.getBoundingClientRect();
        const c = card.getBoundingClientRect();
        if (!r.width || !r.height || (r.right <= c.right + 2 && r.left >= c.left - 2)) continue;
        let clipped = false;
        for (let a = el.parentElement; a && a !== card; a = a.parentElement) {
          if (getComputedStyle(a).overflowX !== "visible") { clipped = true; break; }
        }
        if (clipped) continue;
        const where = el.closest("section, header, footer");
        const label = where ? where.id || where.getAttribute("aria-label") || where.tagName.toLowerCase() : "page";
        offenders.push(`${label}: <${el.tagName.toLowerCase()}> "${(el.textContent || "").trim().slice(0, 40)}" sticks out of its card`);
      }
      return { overflow: document.documentElement.scrollWidth - vw, offenders: [...new Set(offenders)].slice(0, 3) };
    });
    if (result.overflow > 0 || result.offenders.length) {
      problems++;
      console.log(`✗ ${url} @ ${width}px: ${result.overflow}px too wide; ${result.offenders.join(" | ") || "(decorative element)"}`);
    }
    if (shotsDir) {
      const name = url.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/-+$/, "");
      await page.screenshot({ path: join(shotsDir, `${name}-${width}.png`), fullPage: true });
    }
    await page.close();
  }
}
// Phone gutters: swipe rows must keep the 16px side margin when a card snaps into place.
const GUTTER_WIDTHS = [320, 390, 430];
const MIN_GUTTER = 12;
for (const url of args) {
  for (const width of GUTTER_WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "html.js [data-reveal]{opacity:1!important;transform:none!important} *{scroll-behavior:auto!important}" });
    const touching = await page.evaluate(async (min) => {
      const out = [];
      const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const rows = [...document.querySelectorAll("body *")].filter((el) => {
        const cs = getComputedStyle(el);
        return ["auto", "scroll"].includes(cs.overflowX) && el.scrollWidth > el.clientWidth + 4 && el.getClientRects().length;
      });
      for (const row of rows) {
        const items = [...row.children].filter((c) => c.getClientRects().length);
        for (const item of items.slice(0, 4)) {
          item.scrollIntoView({ block: "nearest", inline: "start" });
          await frame();
          const left = item.getBoundingClientRect().left;
          if (left < min) {
            const where = row.closest("section, header, footer");
            out.push(`${where?.id || "page"}: a swipe card stops ${Math.round(left)}px from the left edge`);
            break;
          }
        }
        row.scrollLeft = 0;
      }
      return [...new Set(out)];
    }, MIN_GUTTER);
    if (touching.length) {
      problems++;
      console.log(`✗ ${url} @ ${width}px: ${touching.join(" | ")} (needs scroll-padding, e.g. scroll-px-4)`);
    }
    await page.close();
  }
}
for (const url of args) {
  for (const [width, height] of FOLD_SCREENS) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(url, { waitUntil: "networkidle" });
    const missing = await page.evaluate((must) => {
      const out = [];
      // The first-screen rule is for home pages (they have the hero); inner pages only get the width checks.
      if (!document.getElementById("hero-title")) return out;
      // Businesses without emergencies (e.g. landscaping) have no emergency link anywhere: nothing to show.
      const noEmergency = !document.querySelector('a[href="#emergency"]');
      for (const [name, sel] of Object.entries(must)) {
        if (name === "Emergency" && noEmergency) continue;
        const el = [...document.querySelectorAll(sel)].find((e) => e.getClientRects().length && getComputedStyle(e).visibility !== "hidden");
        const r = el?.getBoundingClientRect();
        if (!r || r.top < 0 || r.bottom > innerHeight) out.push(r ? `${name} (ends at ${Math.round(r.bottom)}px)` : `${name} (not shown)`);
      }
      // Phones: the hero fills the first screen, so the next section must not peek in.
      const next = document.querySelector("#top")?.nextElementSibling;
      if (innerWidth < 640 && next && next.getBoundingClientRect().top < innerHeight - 1) out.push("next section peeks in");
      return out;
    }, FOLD_MUST_SHOW);
    if (missing.length) {
      problems++;
      console.log(`✗ ${url} @ ${width}×${height}: below the first screen: ${missing.join(", ")}`);
    }
    await page.close();
  }
}

await browser.close();
console.log(problems ? `\n${problems} page/width combination(s) need fixing.` : `\n✓ ${args.length} page(s) fit every width from ${WIDTHS[0]} to ${WIDTHS.at(-1)}px, and the first screen has what matters on ${FOLD_SCREENS.length} devices.`);
process.exit(problems ? 1 : 0);
