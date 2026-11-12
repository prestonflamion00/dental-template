/**
 * Link-preview thumbnails (the picture shown when a site's link is texted, emailed or posted).
 * Runs after build-all: opens each built site in a real browser, so the image uses the site's own
 * fonts, colours and logo, then saves it over <practice>/opengraph-image (the file the pages'
 * og:image tags already point to).
 *
 * Two kinds:
 *   demo  → the practice's actual new homepage on a laptop and a phone, labelled "Private preview"
 *           (or "Website example" for our fictional samples). Made for the dentist we're pitching.
 *   live  → a clean brand card for patients: logo, what they do and where, Google stars and
 *           "Accepting new patients". Nothing time-sensitive (apps cache previews for days).
 * Key content stays near the middle, because some apps (WhatsApp) crop previews to a square.
 *
 *   node scripts/make-thumbnails.mjs [slug ...]     (build-all calls it for every practice)
 */
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

// Saved copies, committed to the repo: hosts without a browser (Cloudflare's build servers) use these.
const savedDir = join(import.meta.dirname, "..", "thumbnails");
const root = join(import.meta.dirname, "..");
const outDir = join(root, "site");
const base = (process.env.BASE_PATH ?? "").replace(/\/$/, "");

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp", ".json": "application/json", ".txt": "text/plain" };

/** Serves site/ the way the Worker does (BASE_PATH stripped, folders → index.html). */
function serve() {
  const server = createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (base && p.startsWith(base)) p = p.slice(base.length) || "/";
    let file = normalize(join(outDir, p));
    if (!file.startsWith(outDir)) return res.writeHead(403).end();
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
    if (!existsSync(file) && existsSync(file + ".html")) file += ".html";
    if (!existsSync(file)) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const star = (fill) =>
  `<svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><path fill="${fill}" d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>`;

// Shared look: the site's own background and orbs, its fonts (already loaded by the page).
const frame = (inner) => `
<style>
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
  body > * { box-sizing: border-box; }
  .og { position: relative; width: 1200px; height: 630px; overflow: hidden; font-family: var(--font-body), sans-serif; color: var(--ink);
        background: radial-gradient(circle at 88% 8%, var(--orb-1), transparent 52%), radial-gradient(circle at 6% 96%, var(--orb-2), transparent 55%), var(--bg); }
  .serif { font-family: var(--font-display), Georgia, serif; }
</style>
<div class="og">${inner}</div>`;

/** Demo: their homepage on a laptop and a phone. */
function demoCard(o, shots) {
  const label = o.fictional ? "Website example" : "Private preview";
  return frame(`
<style>
  .copy { position: absolute; left: 64px; top: 0; bottom: 0; width: 400px; display: flex; flex-direction: column; justify-content: center; gap: 18px; }
  .chip { align-self: flex-start; padding: 8px 16px; border-radius: 999px; background: var(--ink); color: var(--bg); font-weight: 700; font-size: 20px; letter-spacing: .02em; }
  .name { font-size: 58px; line-height: 1.04; font-weight: 500; letter-spacing: -0.01em; }
  .sub { font-size: 24px; color: var(--muted); line-height: 1.35; }
  .by { margin-top: 10px; font-size: 20px; font-weight: 700; color: var(--muted); }
  .laptop { position: absolute; left: 470px; top: 92px; width: 680px; }
  .screen { border-radius: 18px 18px 0 0; border: 12px solid #1f1a1c; border-bottom-width: 14px; overflow: hidden; height: 404px; background: #fff; box-shadow: 0 30px 60px -20px rgba(40,20,25,.35); }
  .screen img { width: 100%; display: block; }
  .base { height: 16px; margin: 0 -40px; border-radius: 0 0 18px 18px; background: linear-gradient(#d9d3d5, #b9b1b4); }
  .phone { position: absolute; left: 990px; top: 210px; width: 178px; height: 386px; border-radius: 30px; border: 8px solid #1f1a1c; overflow: hidden; background: #fff; box-shadow: 0 30px 50px -16px rgba(40,20,25,.45); }
  .phone img { width: 100%; display: block; }
</style>
<div class="copy">
  <span class="chip">${label}</span>
  <div class="name serif">${esc(o.practice.name)}</div>
  <div class="sub">${o.fictional ? (o.terms.icon === "tooth" ? "A complete dental website, built for phones first." : `A complete website for ${esc(o.terms.business)}, built for phones first.`) : "Your new website, ready to see."}</div>
  <div class="by">butterbite digital</div>
</div>
<div class="laptop"><div class="screen"><img src="${shots.desktop}"></div><div class="base"></div></div>
<div class="phone"><img src="${shots.phone}"></div>`);
}

/** Live: the brand card patients see when the link is shared. */
function liveCard(o, logoHtml) {
  const r = o.rating;
  const stars = r ? Array.from({ length: 5 }, (_, i) => star(i < Math.round(r.value) ? "#e0a21b" : "rgba(0,0,0,.15)")).join("") : "";
  return frame(`
<style>
  .card { position: absolute; inset: 48px; border-radius: 40px; background: rgba(255,255,255,.62); border: 2px solid rgba(255,255,255,.9);
          display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 22px; padding: 0 80px; }
  .logo { transform: scale(2.1); transform-origin: center; margin: 40px 0 44px; }
  .logo a { pointer-events: none; }
  .where { font-size: 30px; color: var(--accent); font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
  .row { display: flex; align-items: center; gap: 28px; font-size: 30px; }
  .stars { display: flex; gap: 2px; }
  .ok { display: flex; align-items: center; gap: 12px; font-weight: 700; }
  .tick { width: 36px; height: 36px; border-radius: 999px; background: var(--success); color: #fff; display: grid; place-items: center; }
</style>
<div class="card">
  <div class="logo">${logoHtml}</div>
  <div class="where">${esc(o.copy.heroEyebrow)}</div>
  <div class="row">
    ${r ? `<span class="stars">${stars}</span><span><strong>${r.value.toFixed(1)}</strong> · ${r.count.toLocaleString("en-US")} ${esc(r.source)} reviews</span>` : ""}
  </div>
  ${o.practice.acceptingNewPatients ? `<div class="row"><span class="ok"><span class="tick"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>${esc(o.terms.accepting)}</span></div>` : ""}
</div>`);
}

/**
 * A moment when the main office is comfortably open (an hour after opening, in its own timezone), so
 * the screenshots show "Open now" whatever time the build runs.
 */
function openMoment(office) {
  const hours = office.locations[0].hours;
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const fmt = new Intl.DateTimeFormat("en-US", { timeZone: office.timezone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  const start = Date.UTC(2026, 0, 5); // a Monday
  for (let t = start; t < start + 8 * 864e5; t += 15 * 6e4) {
    const parts = Object.fromEntries(fmt.formatToParts(t).map((p) => [p.type, p.value]));
    const h = hours[days[["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday)]];
    if (!h) continue;
    const mins = +parts.hour * 60 + +parts.minute;
    const [oh, om] = h.open.split(":").map(Number);
    const [ch, cm] = h.close.split(":").map(Number);
    if (mins >= oh * 60 + om + 60 && mins <= ch * 60 + cm - 90) return new Date(t);
  }
  return null;
}

export async function makeThumbnails(items) {
  let browser;
  try {
    browser = await createRequire(import.meta.url)("playwright").chromium.launch();
  } catch {
    // No browser here: use the saved thumbnails (made by the last local build).
    for (const { slug } of items) {
      const saved = join(savedDir, `${slug}.png`);
      if (existsSync(saved)) copyFileSync(saved, join(outDir, slug, "opengraph-image"));
      console.log(`  thumbnail: ${slug} (${existsSync(saved) ? "saved copy" : "none saved; keeping the basic one"})`);
    }
    return;
  }
  mkdirSync(savedDir, { recursive: true });
  const server = await serve();
  const origin = `http://127.0.0.1:${server.address().port}${base}`;
  const calm = "[data-reveal]{opacity:1!important;transform:none!important} .demo-banner,[data-mobile-bar]{display:none!important} *{animation:none!important;transition:none!important}";
  try {
    for (const { slug, office } of items) {
      const url = `${origin}/${slug}/`;
      const when = openMoment(office);
      const shot = async (viewport, scale) => {
        const page = await browser.newPage({ viewport, deviceScaleFactor: scale, timezoneId: office.timezone });
        if (when) await page.clock.setFixedTime(when);
        await page.goto(url, { waitUntil: "networkidle" });
        await page.addStyleTag({ content: calm });
        await page.evaluate(() => document.fonts.ready);
        const buf = await page.screenshot({ type: "jpeg", quality: 82 });
        await page.close();
        return `data:image/jpeg;base64,${buf.toString("base64")}`;
      };
      // OG_KIND=live|demo forces one kind (handy to preview a live card before a practice goes live).
      const demo = process.env.OG_KIND ? process.env.OG_KIND === "demo" : office.stage === "demo";
      const shots = demo ? { desktop: await shot({ width: 1440, height: 856 }, 1), phone: await shot({ width: 390, height: 844 }, 1) } : null;

      // Draw the card inside the practice's own page, so its fonts and colour variables apply.
      const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const logoHtml = await page.evaluate(() => document.querySelector('header a[href="#top"]')?.innerHTML ?? "");
      const html = demo ? demoCard(office, shots) : liveCard(office, logoHtml);
      await page.evaluate((h) => {
        document.querySelectorAll("body > *").forEach((n) => n.remove());
        document.body.innerHTML = h;
      }, html);
      await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
      await page.screenshot({ path: join(outDir, slug, "opengraph-image"), type: "png" });
      copyFileSync(join(outDir, slug, "opengraph-image"), join(savedDir, `${slug}.png`));
      await page.close();
      console.log(`  thumbnail: ${slug} (${demo ? "demo preview" : "brand card"})`);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

// Run directly: thumbnails for the given (already built) practices, or all of them.
if (import.meta.url === `file://${process.argv[1]}`) {
  const { pathToFileURL } = await import("node:url");
  const { readdirSync } = await import("node:fs");
  const { buildOffice } = await import(pathToFileURL(join(root, "config/build.ts")).href);
  const slugs = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(join(root, "config/offices")).filter((f) => f.endsWith(".ts")).map((f) => f.replace(/\.ts$/, ""));
  const items = [];
  for (const slug of slugs) {
    const input = (await import(pathToFileURL(join(root, "config/offices", `${slug}.ts`)).href)).default;
    items.push({ slug, office: buildOffice(input) });
  }
  await makeThumbnails(items);
}
