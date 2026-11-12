/**
 * Records the personal part of a prospect's demo video, with no person involved: opens their demo
 * site on a simulated iPhone, scrolls and taps through it on a set path, and puts short captions on
 * screen. The captions are worked out from the page itself (how many dentists, how many services),
 * so the same script works for any practice.
 *
 *   node scripts/demo-video/record.mjs <demo url> <out dir>
 *   e.g. node scripts/demo-video/record.mjs http://localhost:4411/herman-family-dentistry/ public/offices/herman
 *
 * Writes <out dir>/welcome.mp4 (H.264, plays everywhere), welcome.vtt (the captions, shown under the
 * phone on the welcome page, so nothing on their site is covered) and welcome-poster.jpg.
 * Needs ffmpeg with libx264 and the pre-installed Playwright Chromium.
 */
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const { chromium, devices } = createRequire(import.meta.url)("playwright");
const [url, outDir] = process.argv.slice(2);
if (!url || !outDir) {
  console.error("Usage: node scripts/demo-video/record.mjs <demo url> <out dir>");
  process.exit(1);
}
const base = url.endsWith("/") ? url : `${url}/`;
const tmp = mkdtempSync(join(tmpdir(), "demo-video-"));
const phone = devices["iPhone 15"]; // 393 x 852
const size = { ...phone.viewport }; // must match the visible screen (393 x 659), or the video gets a gray band

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...phone, recordVideo: { dir: tmp, size } });
const page = await ctx.newPage();
const t0 = Date.now();
const wait = (ms) => page.waitForTimeout(ms);

// Captions are kept as timed cues (welcome.vtt), not drawn on the page.
const cues = [];
let start = 0;
const caption = async (text) => {
  const at = (Date.now() - t0) / 1000 - start;
  const last = cues[cues.length - 1];
  if (last && last.text === text) return;
  if (last) last.end = at;
  cues.push({ text, start: Math.max(0, at), end: null });
};
// Smooth scrolling done by the page itself (one animation frame at a time), like a thumb, so the
// page's own animations (the name gliding into the top bar) play as they would for a visitor.
const scrollTo = (y, ms = 1400) =>
  page.evaluate(([to, dur]) => new Promise((done) => {
    const from = scrollY, t1 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t1) / dur), e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      window.scrollTo(0, from + (to - from) * e);
      t < 1 ? requestAnimationFrame(step) : done();
    };
    requestAnimationFrame(step);
  }), [y, ms]);
const yOf = (sel, offset = 90) => page.evaluate(([s, o]) => {
  const el = document.querySelector(s);
  return el ? Math.max(0, el.getBoundingClientRect().top + scrollY - o) : null;
}, [sel, offset]);

await page.goto(base, { waitUntil: "networkidle" });
await page.addStyleTag({ content: ".demo-banner{display:none!important}" }); // no "Private preview" bar
await wait(400);
start = (Date.now() - t0) / 1000; // trim the blank loading frames before this

const name = await page.evaluate(() => document.querySelector("#hero-name img")?.getAttribute("alt") || document.querySelector("#hero-name [data-name-text]")?.textContent?.trim() || "");
await caption(name ? `Your new website, ${name}` : "Your new website");
await wait(2800);
await caption("Request, Call and Emergency, right on the first screen");
await wait(2800);
await caption("Your name moves into the top bar as patients scroll");
await scrollTo(420, 1600);
await wait(1400);

const doctorsY = await yOf("#doctors");
const doctorCount = await page.evaluate(() => document.querySelectorAll("#doctors h3").length);
if (doctorsY != null) {
  await caption(doctorCount > 1 ? `All ${doctorCount} of your dentists, with real photos` : "Your dentist, with a real photo");
  await scrollTo(doctorsY, 1600);
  await wait(900);
  // Past every dentist's card, one after another.
  const lastDoc = await yOf("#doctors ul > li:last-child", 140);
  if (lastDoc != null && lastDoc > doctorsY) await scrollTo(lastDoc, Math.min(4200, 900 * doctorCount));
  await wait(900);
}

// One doctor's own page, when the site has them.
const doctorLink = page.locator('#doctors a[href*="/doctors/"]').first();
if (await doctorLink.count()) {
  await caption("Each dentist gets their own page");
  await doctorLink.click();
  await page.waitForLoadState("networkidle");
  await page.addStyleTag({ content: ".demo-banner{display:none!important}" });
  await wait(1300);
  await scrollTo(380, 1500);
  await wait(1100);
}

// The services page, when there is one.
const services = await page.goto(`${base}services/`, { waitUntil: "networkidle" }).then((r) => r?.ok()).catch(() => false);
if (services) {
  await page.addStyleTag({ content: ".demo-banner{display:none!important}" });
  const count = await page.evaluate(() => new Set([...document.querySelectorAll('a[href*="/services/"]')].map((a) => a.getAttribute("href")).filter((h) => !/\/services\/?$/.test(h))).size);
  await caption(count > 3 ? `All ${count} of your services, each with a page` : "Every service, clearly explained");
  await wait(1000);
  await scrollTo(700, 2200);
  await wait(1000);
}

await page.goto(base, { waitUntil: "networkidle" });
await page.addStyleTag({ content: ".demo-banner{display:none!important}" });
await caption("Built from everything on your current site, made for phones");
await wait(2800);
const end = (Date.now() - t0) / 1000;
cues[cues.length - 1].end = end - start;

const video = page.video();
await ctx.close();
await browser.close();
const webm = (await video.path()) ?? join(tmp, readdirSync(tmp).find((f) => f.endsWith(".webm")));

mkdirSync(outDir, { recursive: true });
const mp4 = join(outDir, "welcome.mp4");
const poster = join(outDir, "welcome-poster.jpg");
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", String(start), "-to", String(end), "-i", webm,
  "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", mp4]);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", "1", "-i", mp4, "-frames:v", "1", "-q:v", "4", poster]);
const ts = (x) => new Date(Math.max(0, x) * 1000).toISOString().slice(11, 23);
writeFileSync(join(outDir, "welcome.vtt"), "WEBVTT\n\n" + cues.map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${c.text}\n`).join("\n"));
console.log(`Wrote ${mp4} (${(end - start).toFixed(1)} s) and ${poster}`);
