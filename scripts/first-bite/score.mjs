/**
 * The butterbite First Bite score: an automated, repeatable grade of a dental practice online.
 * Method and checklist: "The butterbite score" doc (claude.ai/artifact/LRfdA8BTuvfNfDjf6RVXc4).
 *
 *   node scripts/first-bite/score.mjs https://www.example-dental.com/ [--out report.json]
 *
 * Six weighted parts (weights add to 10); each part is scored 0–10 from fixed checks:
 *   Google profile 2.5 · Reviews 2 · Patient experience 2 · Local search 1.5 · Speed & health 1 · AI & listings 1
 * This version measures everything it can from the website itself (no accounts needed). Checks that
 * need Google's Places API (profile, reviews, map rankings) or AI APIs report "not measured yet", and
 * the overall score says how much of the 10 points it covers, so a partial score is never passed off
 * as a full one.
 */
import { execFile } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { promisify } from "node:util";
import { placesAvailable, placesChecks } from "./places.mjs";
import { aiChecks } from "./ai.mjs";

const run = promisify(execFile);
const { chromium, devices } = createRequire(import.meta.url)("playwright");
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
const CHROME = process.env.CHROME_PATH || "/opt/pw-browsers/chromium";

const args = process.argv.slice(2);
const site = args.find((a) => /^https?:\/\//.test(a));
const outPath = args.includes("--out") ? args[args.indexOf("--out") + 1] : null;
const MAX_PAGES = 60;
if (!site) {
  console.error("Usage: node scripts/first-bite/score.mjs <website url> [--out report.json]");
  process.exit(1);
}
const origin = new URL(site).origin;
const host = new URL(site).hostname.replace(/^www\./, "");

/* ── Small helpers ── */
async function get(url) {
  try {
    const { stdout } = await run("curl", ["-sS", "-L", "--max-time", "25", "-A", UA, "-o", "-", "-w", "\n__STATUS__%{http_code} %{url_effective}", url], { maxBuffer: 30e6 });
    const i = stdout.lastIndexOf("\n__STATUS__");
    const [code, final] = stdout.slice(i + 11).split(" ");
    return { status: +code, final, body: stdout.slice(0, i) };
  } catch (e) {
    return { status: 0, final: url, body: "", error: String(e.message).slice(0, 120) };
  }
}
async function status(url) {
  try {
    const { stdout } = await run("curl", ["-sS", "-o", "/dev/null", "-L", "--max-time", "20", "-A", UA, "-w", "%{http_code}", url]);
    return +stdout;
  } catch {
    return 0;
  }
}
async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } }));
  return out;
}
const text = (html) => html.replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/g, " ").replace(/\s+/g, " ");
const linksIn = (html, base) =>
  [...html.matchAll(/href\s*=\s*["']([^"'#]+)["']/gi)].map((m) => { try { return new URL(m[1].replace(/&amp;/g, "&"), base).href; } catch { return null; } }).filter(Boolean);
const own = (u) => { try { return new URL(u).hostname.replace(/^www\./, "") === host; } catch { return false; } };
const isPage = (u) => !/\.(jpe?g|png|gif|webp|svg|pdf|mp4|css|js|ico|xml|json|woff2?)(\?|$)/i.test(u) && !/\/(wp-json|feed|xmlrpc\.php|wp-admin|wp-login)/i.test(u);
const pts = (got, max) => Math.round(Math.max(0, Math.min(1, got)) * max * 100) / 100;
const check = (name, max, got, detail) => ({ name, max, points: pts(got, max), detail });

/* ── 1. Crawl the site: every page, every internal link ── */
async function crawl() {
  const seen = new Set([site]), queue = [site], pages = [];
  while (queue.length && pages.length < MAX_PAGES) {
    const batch = queue.splice(0, 6);
    const got = await pool(batch, 6, async (u) => ({ u, ...(await get(u)) }));
    for (const r of got) {
      pages.push({ url: r.u, status: r.status, html: r.body });
      for (const l of linksIn(r.body, r.final || r.u)) {
        const clean = l.split("#")[0];
        if (own(clean) && isPage(clean) && !seen.has(clean)) { seen.add(clean); queue.push(clean); }
      }
    }
  }
  // Every internal link found on those pages (pages and files), checked once.
  const linkSet = new Map();
  for (const p of pages) for (const l of linksIn(p.html, p.url)) { const c = l.split("#")[0]; if (own(c) && !/\/(wp-json|xmlrpc\.php|feed)/.test(c)) { if (!linkSet.has(c)) linkSet.set(c, new Set()); linkSet.get(c).add(p.url); } }
  const known = new Map(pages.map((p) => [p.url, p.status]));
  const todo = [...linkSet.keys()].filter((u) => !known.has(u));
  const st = await pool(todo, 6, status);
  todo.forEach((u, i) => known.set(u, st[i]));
  const broken = [...linkSet.entries()].filter(([u]) => known.get(u) >= 400 || known.get(u) === 0).map(([u, from]) => ({ url: u, status: known.get(u), foundOn: [...from].slice(0, 3) }));
  return { pages, broken, linksChecked: linkSet.size };
}

/* ── 2. Lighthouse on a phone ── */
async function lighthouse() {
  const dir = mkdtempSync(join(tmpdir(), "first-bite-"));
  const out = join(dir, "lh.json");
  try {
    await run("npx", ["-y", "lighthouse@12.2.1", site, "--quiet", "--chrome-flags=--headless=new --no-sandbox", "--output=json", `--output-path=${out}`, "--only-categories=performance,accessibility,best-practices,seo"], { env: { ...process.env, CHROME_PATH: CHROME }, maxBuffer: 50e6, timeout: 240000 });
    const lr = JSON.parse(readFileSync(out, "utf8"));
    const a = lr.audits;
    return {
      performance: Math.round((lr.categories.performance.score ?? 0) * 100),
      accessibility: Math.round((lr.categories.accessibility.score ?? 0) * 100),
      seo: Math.round((lr.categories.seo.score ?? 0) * 100),
      lcpMs: Math.round(a["largest-contentful-paint"]?.numericValue ?? 0),
      bytes: Math.round(a["total-byte-weight"]?.numericValue ?? 0),
      consoleErrors: a["errors-in-console"]?.details?.items?.length ?? 0,
      https: a["is-on-https"]?.score === 1,
    };
  } catch (e) {
    return { error: String(e.message).slice(0, 200) };
  }
}

/* ── 3. The first screen on a phone, in a real browser ── */
async function firstScreen() {
  const b = await chromium.launch();
  try {
    const c = await b.newContext({ ...devices["iPhone 13"] });
    const p = await c.newPage();
    await p.goto(site, { waitUntil: "load", timeout: 60000 });
    await p.waitForTimeout(2500);
    return await p.evaluate(() => {
      const H = innerHeight;
      const shown = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && r.top < H && r.bottom > 0 && cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity > 0.1; };
      const all = [...document.querySelectorAll("a, button")].filter(shown);
      const words = (el) => (el.textContent + " " + (el.getAttribute("aria-label") ?? "")).toLowerCase();
      const above = [...document.querySelectorAll("body *")].filter((e) => e.children.length === 0 && shown(e)).map((e) => e.textContent).join(" ").toLowerCase();
      return {
        call: all.some((e) => (e.getAttribute("href") ?? "").startsWith("tel:")),
        request: all.some((e) => /request|book|schedule|appointment/.test(words(e))),
        hours: /open now|closed|opens|hours|\b\d{1,2}(:\d\d)?\s?(am|pm)\b/.test(above + " " + all.map(words).join(" ")),
        emergency: /emergenc/.test(above) || all.some((e) => /emergenc/.test(words(e))),
        name: document.title.split(/[|\-–]/)[0].trim().toLowerCase().split(" ").filter((w) => w.length > 3).some((w) => above.includes(w)),
      };
    });
  } finally {
    await b.close();
  }
}

/* ── Score it ── */
const t0 = Date.now();
const [site_, lh, fold] = await Promise.all([crawl(), lighthouse(), firstScreen().catch((e) => ({ error: String(e.message).slice(0, 120) }))]);
const pages = site_.pages.filter((p) => p.status === 200);
const allHtml = pages.map((p) => p.html).join("\n");
const allText = text(allHtml).toLowerCase();

// Online request or booking: a form that asks for a name and a phone or email, or a booking widget.
// Booking tools, recognised by the address their widget or link loads from (not by words on the page).
const BOOKING = /\b(nexhealth\.com|localmed\.com|zocdoc\.com|solutionreach\.com|book\.getweave\.com|weave\.com\/book|demandforce\.com|yapiapp\.com|modento\.io|carestack\.com|opencare\.com|patientpop\.com|lighthouse360\.com|flexbook\.me|curvedental\.com\/book|dentrixascend\.com|denticon\.com|sikkasoft\.com|doctible\.com|simplifeye\.co\/book|getbooked\.ai)/i;
const forms = pages.flatMap((p) => [...p.html.matchAll(/<form[\s\S]*?<\/form>/gi)].map((m) => ({ url: p.url, html: m[0] })));
const requestForm = forms.find((f) => /name/i.test(f.html) && /(tel|phone|email)/i.test(f.html) && !/job|career|application|resume|newsletter|search/i.test(f.url + f.html.slice(0, 400)));
const bookingWidget = BOOKING.exec(allHtml)?.[0];

const has = (re) => re.test(allText);
const content = { services: has(/cleaning|crown|implant|filling/), team: has(/\bdr\.|dds|dmd|our team|meet the/), insurance: has(/insurance/), financing: has(/financ|carecredit|payment plan/), newPatients: has(/new patient/), address: has(/\b\d{2,5} [a-z0-9 .]+(road|rd|street|st|ave|avenue|blvd|drive|dr|lane|ln|way|circle|cir|court|ct|pkwy|parkway|highway|hwy)\b/), map: /maps\.google|google\.com\/maps|maps\/embed|mapbox|apple\.com\/maps/i.test(allHtml) };
const contentGot = Object.values(content).filter(Boolean).length / Object.keys(content).length;
const reviewsShown = /review|testimonial/i.test(allText) && /★|star-rating|rating|fa-star|"ratingValue"/i.test(allHtml);
const photos = (allHtml.match(/<img[^>]+src=["'][^"']+\.(jpe?g|webp|png)/gi) ?? []).filter((t) => !/logo|icon|favicon|sprite|badge|ribbon|ada-logo/i.test(t)).length;
const overlay = /userway|accessibe|audioeye|equalweb|userway\.org/i.exec(allHtml)?.[0];

// Search basics, from the pages themselves.
const meta = pages.map((p) => ({ url: p.url, title: /<title[^>]*>([\s\S]*?)<\/title>/i.exec(p.html)?.[1]?.trim() ?? "", desc: /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i.exec(p.html)?.[1] ?? "", h1: (p.html.match(/<h1[\s>]/gi) ?? []).length }));
const uniqueTitles = new Set(meta.map((m) => m.title)).size / Math.max(1, meta.length);
const withDesc = meta.filter((m) => m.desc.trim().length >= 50).length / Math.max(1, meta.length);
const oneH1 = meta.filter((m) => m.h1 === 1).length / Math.max(1, meta.length);
const imgs = [...allHtml.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
const withAlt = imgs.filter((t) => /alt=["'][^"']+["']/.test(t)).length / Math.max(1, imgs.length);
const schemaTypes = [...allHtml.matchAll(/"@type"\s*:\s*"([A-Za-z]+)"/g)].map((m) => m[1]);
const localSchema = schemaTypes.find((t) => /^(Dentist|MedicalBusiness|MedicalClinic|LocalBusiness|HealthAndBeautyBusiness|MedicalOrganization)$/.test(t));
const schemaHours = /"openingHours(Specification)?"/.test(allHtml);

const NOT_YET = (why) => ({ measured: false, why });
const NOT = (why) => `not measured: ${why}`;

// Google profile, reviews and map rankings (Google Places API), when a key is set.
const homeTitle = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(pages[0]?.html ?? "")?.[1]?.split(/[|\-\u2013\u2014]/)[0].trim() ?? host;
const sitePhones = [...new Set([...allHtml.matchAll(/href=["']tel:([^"']+)/gi)].map((m) => m[1]))];
let g = null;
if (placesAvailable) {
  try {
    g = await placesChecks({ siteHost: host, name: homeTitle, sitePhones });
  } catch (e) {
    g = { found: false, why: String(e.message).slice(0, 200) };
  }
}
const G = g?.found ? g.raw : null;
const noPlaces = !placesAvailable ? "needs GOOGLE_PLACES_API_KEY" : g && !g.found ? g.why : "";
// AI answers (ChatGPT, Gemini): needs the town, so only once the Google listing is found.
let ai = null;
if (G) {
  const text = allHtml.replace(/<[^>]+>/g, " ");
  const accepting = /not (currently )?accepting new patients/i.test(text) ? false : /accepting new patients/i.test(text) ? true : undefined;
  ai = await aiChecks({ name: g.place.name, town: g.place.town, state: g.place.state, siteHost: host, phone: sitePhones[0], street: g.place.address?.split(",")[0], accepting });
}
const aiOk = ai ? Object.values(ai).filter((e) => !e.error) : [];
const aiWhy = !G ? `needs the Google listing first (${noPlaces || "not found"})` : Object.values(ai).map((e) => `${e.label}: ${e.error}`).join("; ");
const avg = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const rankPts = (r) => (r?.rank == null ? 0 : r.rank <= 3 ? 1 : r.rank <= 10 ? 0.5 : 0);
const parts = [
  G
    ? {
        id: "gbp", name: "Google profile", weight: 2.5, measured: "partly",
        checks: [
          check("Claimed and verified", 1, null, NOT("Google's API doesn't say whether a profile is verified")),
          check("Basics match the website (phone, website, hours)", 2, ((G.phoneMatches ? 1 : 0) + (G.websiteMatches ? 1 : 0) + (G.hasHours && !G.alwaysOpen ? 1 : 0)) / 3, { phoneMatches: G.phoneMatches, websiteMatches: G.websiteMatches, hoursListed: G.hasHours, showsOpen24Hours: G.alwaysOpen }),
          check("Category is dentist", 1, G.dentalType ? 1 : 0, G.type),
          check("Description", 1, G.hasSummary ? 1 : 0, { googleSummary: G.hasSummary }),
          check("Photos", 2, G.photos >= 10 ? 1 : G.photos / 10, `${G.photos}${G.photos >= 10 ? "+" : ""} photos (the API shows at most 10; freshness not available)`),
          check("Booking link", 1, null, NOT("not exposed by Google's API")),
          check("Fresh activity (posts)", 1, null, NOT("not exposed by Google's API")),
          check("Attributes filled in", 1, G.accessibility ? 1 : 0, { accessibilityListed: G.accessibility }),
        ],
      }
    : { id: "gbp", name: "Google profile", weight: 2.5, ...NOT_YET(noPlaces) },
  G
    ? {
        id: "reviews", name: "Reviews", weight: 2, measured: "partly",
        checks: [
          check("Rating", 3, G.rating >= 4.8 ? 1 : G.rating >= 4.5 ? 0.5 : 0, `${G.rating} stars`),
          check("Volume vs the top dentists nearby", 2, G.medianCompetitor == null ? 1 : G.reviews >= G.medianCompetitor ? 1 : G.reviews >= G.medianCompetitor / 2 ? 0.5 : 0, `${G.reviews} reviews; top nearby median ${G.medianCompetitor ?? "n/a"}`),
          // Google's API returns only its 5 "most relevant" reviews, not the newest, so a recent one there
          // proves recency, but an older one proves nothing.
          G.daysSinceNewest != null && G.daysSinceNewest <= 30
            ? check("Recent reviews", 2, 1, `a review from ${G.daysSinceNewest} days ago`)
            : check("Recent reviews", 2, null, NOT("Google's API shows only 5 'most relevant' reviews, not the newest")),
          check("Owner replies", 2, null, NOT("Google's API doesn't include owner replies")),
          check("Ratings elsewhere", 1, null, NOT("directory checks not built yet")),
        ],
      }
    : { id: "reviews", name: "Reviews", weight: 2, ...NOT_YET(noPlaces) },
  {
    id: "experience", name: "Patient experience", weight: 2, measured: true,
    checks: [
      check("First screen on a phone has name, request, call, hours and emergency", 2, fold.error ? 0 : ["name", "request", "call", "hours", "emergency"].filter((k) => fold[k]).length / 5, fold.error ?? fold),
      check("Online request or booking", 2, requestForm || bookingWidget ? 1 : 0, requestForm ? `form on ${requestForm.url}` : bookingWidget ? `booking tool: ${bookingWidget}` : "no appointment form or booking tool found"),
      check("Nothing broken", 1.5, site_.broken.length === 0 ? 1 : site_.broken.length <= 5 ? 0.5 : 0, `${site_.broken.length} broken of ${site_.linksChecked} links checked`),
      check("Complete content", 1.5, contentGot, content),
      check("Trust: real photos and reviews on the site", 1.5, (photos >= 6 ? 0.5 : photos / 12) + (reviewsShown ? 0.5 : 0), { photos, reviewsShown }),
      check("Accessible", 1.5, lh.error ? 0 : (lh.accessibility >= 95 ? 1 : lh.accessibility >= 85 ? 0.5 : 0) * (overlay ? 0.5 : 1), { lighthouse: lh.accessibility, overlay: overlay ?? null }),
    ],
  },
  {
    id: "search", name: "Local search", weight: 1.5, measured: "partly",
    checks: [
      G ? check("Map rankings: \"dentist in [town]\"", 3, rankPts(G.rankings.dentist), G.rankings.dentist) : check("Map rankings", 3, null, NOT(noPlaces)),
      G ? check("Service rankings on Google Maps", 2, (rankPts(G.rankings.implants) + rankPts(G.rankings.emergency)) / 2, { implants: G.rankings.implants.rank, emergency: G.rankings.emergency.rank }) : check("Service rankings", 2, null, NOT(noPlaces)),
      check("Business markup", 1.5, localSchema ? (schemaHours ? 1 : 0.5) : 0, { type: localSchema ?? null, hours: schemaHours, typesFound: [...new Set(schemaTypes)].slice(0, 8) }),
      check("Page basics: titles, descriptions, headings, image descriptions", 1.5, (uniqueTitles + withDesc + oneH1 + withAlt) / 4, { uniqueTitles: +uniqueTitles.toFixed(2), withDescription: +withDesc.toFixed(2), oneMainHeading: +oneH1.toFixed(2), imagesDescribed: +withAlt.toFixed(2) }),
      check("Consistent listings", 2, null, "not measured yet: needs directory checks"),
    ],
  },
  {
    id: "speed", name: "Speed and health", weight: 1, measured: !lh.error,
    checks: lh.error
      ? []
      : [
          check("Phone speed (Lighthouse performance)", 4, lh.performance >= 80 ? 1 : lh.performance >= 50 ? 0.5 : 0, `${lh.performance}/100`),
          check("Main content visible within 2.5 s", 3, lh.lcpMs <= 2500 ? 1 : lh.lcpMs <= 4000 ? 0.5 : 0, `${(lh.lcpMs / 1000).toFixed(1)} s`),
          check("Secure and error-free", 2, (lh.https ? 0.5 : 0) + (lh.consoleErrors === 0 ? 0.5 : 0), { https: lh.https, consoleErrors: lh.consoleErrors }),
          check("Light: under 1.5 MB", 1, lh.bytes <= 1.5e6 ? 1 : lh.bytes <= 3e6 ? 0.5 : 0, `${(lh.bytes / 1e6).toFixed(1)} MB`),
        ],
  },
  {
    id: "ai", name: "AI and listings", weight: 1, measured: aiOk.length ? "partly" : false,
    checks: [
      aiOk.length
        ? check("AI answers: named when asked for a dentist in town", 4, avg(aiOk.map((e) => (e.named.every(Boolean) ? 1 : e.named.some(Boolean) ? 0.5 : 0))), Object.fromEntries(Object.entries(ai).map(([k, e]) => [k, e.error ? `not measured: ${e.error}` : `named in ${e.named.filter(Boolean).length} of ${e.named.length} answers`])))
        : check("AI answers", 4, null, NOT(aiWhy)),
      aiOk.length && aiOk.some((e) => e.accuracy != null)
        ? check("AI accuracy: phone, address, taking new patients", 2, avg(aiOk.filter((e) => e.accuracy != null).map((e) => e.accuracy)), Object.fromEntries(aiOk.map((e) => [e.label, e.facts])))
        : check("AI accuracy", 2, null, NOT(aiWhy || "no facts to compare")),
      check("Health directories", 2, null, NOT("directory checks not built yet")),
      check("Maps beyond Google", 2, null, NOT("Apple Maps and Bing checks not built yet")),
    ],
  },
];

// A part's score counts only the checks we measured, scaled back up to 10 (so unmeasured checks
// neither help nor hurt), and the overall says which share of the 10 points was measured.
for (const p of parts) {
  if (!p.checks) continue;
  const done = p.checks.filter((c) => typeof c.detail !== "string" || !c.detail.startsWith("not measured"));
  const max = done.reduce((s, c) => s + c.max, 0);
  p.score = max ? Math.round((done.reduce((s, c) => s + c.points, 0) / max) * 100) / 10 : null;
  p.coverage = max / 10;
}
const measured = parts.filter((p) => p.score != null);
const coveredWeight = measured.reduce((s, p) => s + p.weight * p.coverage, 0);
const overall = coveredWeight ? Math.round((measured.reduce((s, p) => s + p.score * p.weight * p.coverage, 0) / coveredWeight) * 10) / 10 : null;
const band = (s) => (s >= 8.5 ? "Golden" : s >= 7 ? "Spreadable" : s >= 5 ? "Softening" : "Cold butter");

const report = {
  site, scoredAt: new Date().toISOString(), version: "first-bite 0.1",
  overall, band: overall != null ? band(overall) : null,
  measuredShare: Math.round(coveredWeight * 10) / 100, // of the full 10 points
  parts,
  google: g,
  ai,
  findings: { brokenLinks: site_.broken.slice(0, 50), pagesCrawled: pages.length, lighthouse: lh },
  seconds: Math.round((Date.now() - t0) / 1000),
};
if (outPath) writeFileSync(outPath, JSON.stringify(report, null, 2));

console.log(`\nFirst Bite score for ${host}: ${overall ?? "–"} / 10 (${report.band ?? "–"}), from ${Math.round(report.measuredShare * 100)}% of the checklist`);
for (const p of parts) {
  console.log(`  ${p.name.padEnd(20)} ${p.score != null ? `${p.score.toFixed(1)}/10` : "not measured yet"}${p.coverage && p.coverage < 1 ? `  (${Math.round(p.coverage * 100)}% of its checks)` : ""}`);
  for (const c of p.checks ?? []) if (!(typeof c.detail === "string" && c.detail.startsWith("not measured"))) console.log(`      ${c.points}/${c.max}  ${c.name}  ${typeof c.detail === "string" ? c.detail : JSON.stringify(c.detail)}`);
}
console.log(`  ${site_.broken.length} broken links · ${pages.length} pages crawled · ${report.seconds} s`);
