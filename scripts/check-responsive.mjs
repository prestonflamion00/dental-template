/**
 * Responsive check: loads each page at widths from a small phone to a large desktop and reports
 * anything wider than the screen (the usual cause of sideways scrolling and cut-off content).
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
await browser.close();
console.log(problems ? `\n${problems} page/width combination(s) need fixing.` : `\n✓ ${args.length} page(s) fit every width from ${WIDTHS[0]} to ${WIDTHS.at(-1)}px.`);
process.exit(problems ? 1 : 0);
