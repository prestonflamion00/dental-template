// Renders og/og.html to public/og.jpg (1200x630), the image shown when someone shares the site link.
// Run from business-site/ after updating the phone screenshots (see ../scripts/shots.mjs).
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { join } from "node:path";

const { chromium } = createRequire(import.meta.url)("playwright");
const here = fileURLToPath(new URL(".", import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(pathToFileURL(join(here, "og.html")).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(here, "..", "public", "og.jpg"), type: "jpeg", quality: 88 });
await browser.close();
console.log("✓ public/og.jpg");
