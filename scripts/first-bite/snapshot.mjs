/**
 * The one-page First Bite snapshot we hand a dentist: score, the six parts, what's working, the three
 * fixes worth the most, and how they compare with the top practice nearby. Built entirely from a
 * score.mjs report, so every practice gets one automatically.
 *
 *   node scripts/first-bite/snapshot.mjs report.json [--out snapshot.html] [--pdf snapshot.pdf] [--note "text"]
 *
 * --note adds one hand-checked finding (e.g. a wrong directory listing) until directory checks exist.
 * Dollar figures use our published default (a new patient is worth about $1,200 in the first year);
 * they say "about" and show the assumption, never a promise.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const args = process.argv.slice(2);
const opt = (k) => (args.includes(k) ? args[args.indexOf(k) + 1] : null);
const r = JSON.parse(readFileSync(args.find((a) => a.endsWith(".json") && a !== opt("--out")), "utf8"));
const NEW_PATIENT = 1200; // first-year value of a new patient (score doc, "So what")
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const money = (n) => `$${Math.round(n).toLocaleString("en-US")}`;
const place = r.google?.place;
const name = place?.name ?? r.site;
const town = place ? `${place.town}, ${place.state}` : "";
const date = new Date(r.scoredAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
const part = (id) => r.parts.find((p) => p.id === id);
const chk = (id, start) => part(id)?.checks?.find((c) => c.name.startsWith(start));
const lost = (c, id) => (c ? ((c.max - c.points) / 10) * part(id).weight : 0);
const full = (c) => c && c.points >= c.max;
const G = r.google?.raw;
const lh = r.findings.lighthouse;

/* What's working: the strongest things they already have, in patient words. */
const working = [];
const dentistRank = G?.rankings?.dentist?.rank;
if (dentistRank && dentistRank <= 3) working.push(`#${dentistRank} on Google Maps for "dentist in ${place.town}".`);
if (G?.rating >= 4.8) working.push(`${G.rating} stars from ${G.reviews} Google reviews.`);
const ai = r.ai && Object.values(r.ai).filter((e) => !e.error);
if (ai?.length && ai.every((e) => e.named.some(Boolean))) working.push(`${ai.map((e) => e.label.split(" (")[0]).join(" and ")} recommend${ai.length > 1 ? "" : "s"} you when asked for a dentist in ${place.town}${ai.every((e) => e.accuracy === 1) ? ", with your phone and address right" : ""}.`);
if (full(chk("experience", "Complete content"))) working.push("Your site covers what patients look for: services, team, insurance, financing, new patients.");
if (full(chk("experience", "Trust"))) working.push("Real photos of your team and office, and patient reviews on the site.");
if (full(chk("gbp", "Basics match"))) working.push("Your Google profile's phone, website and hours match your site.");

/* Fixes: each check that lost points, with what to do and what it's worth, ranked by points lost. */
const fixes = [];
const add = (c, id, title, why, worth) => c && c.points < c.max && fixes.push({ lost: lost(c, id), title, why, worth });
const perMonth = (n) => `About ${n} more new patient${n > 1 ? "s" : ""} a month would be about ${money(n * 12 * NEW_PATIENT)} a year.`;
add(chk("experience", "Online request"), "experience", "Let patients request a visit online", "There's no way to ask for an appointment on the site; every visitor has to call during office hours. Many people look in the evening, and about 30% of calls to dental offices go unanswered.", perMonth(2));
add(chk("speed", "Phone speed"), "speed", "Make the site fast on phones", `The main content takes ${(lh.lcpMs / 1000).toFixed(1)} seconds to show on a phone (speed score ${lh.performance}/100). Google found that over half of phone visitors leave a page that takes more than 3 seconds.`, perMonth(1));
const broken = r.findings.brokenLinks.length;
add(chk("experience", "Nothing broken"), "experience", `Fix ${broken} broken link${broken > 1 ? "s" : ""}`, `${broken} links on the site lead to "page not found". Patients hit dead ends, and Google trusts the site less.`, "Part of being found: broken pages pull down your search ranking.");
add(chk("search", "Business markup"), "search", "Tell Google exactly who you are", "The site has none of the hidden business details (dentist, hours, address) that Google and AI tools read. It's a quick fix that helps searches like \"dentist open now\".", "Helps you show up in more searches.");
const vol = chk("reviews", "Volume");
add(vol, "reviews", "Ask happy patients for reviews", G ? `You have ${G.reviews} Google reviews; the top practices nearby have about ${G.medianCompetitor}. Review count is one of the biggest reasons a practice ranks first on Google Maps.` : "", "Keeps you at the top of Google Maps.");
const fold = chk("experience", "First screen");
if (fold && typeof fold.detail === "object") {
  const miss = ["hours", "emergency", "request", "call", "name"].filter((k) => !fold.detail[k]);
  add(fold, "experience", "Put what patients need on the first screen", `On a phone, the first screen doesn't show ${miss.join(" or ")}. People in pain, or deciding fast, shouldn't have to scroll.`, "Turns more visits into calls.");
}
add(chk("experience", "Accessible"), "experience", "Make the site accessible without an add-on", "An accessibility add-on (an overlay) doesn't make a site accessible, and practices using one still get legal complaints.", "Lowers legal risk and helps every visitor.");
fixes.sort((a, b) => b.lost - a.lost);
const top = fixes.slice(0, 3);

/* The top competitor on Google Maps for "dentist in [town]". */
const rival = G?.rankings?.dentist?.top?.find((x) => !x.self);

/* What we couldn't measure yet, said plainly. */
const notYet = [];
for (const p of r.parts) for (const c of p.checks ?? []) if (typeof c.detail === "string" && c.detail.startsWith("not measured")) notYet.push(c.name);
if (r.ai?.gemini?.error) notYet.push("Gemini's answers");

// Each band says what it means for patients, in plain words, so nobody has to guess.
const bands = [
  ["Golden", "8.5+", "Patients find and choose you easily."],
  ["Spreadable", "7–8.4", "Strong, with a few gaps to close."],
  ["Warming up", "5–6.9", "You're losing some patients to fixable gaps."],
  ["Cold butter", "under 5", "Many patients are choosing other practices."],
];
// Older reports said "Softening" for 5–6.9.
const bandName = r.band === "Softening" ? "Warming up" : r.band;
const bar = (p) => `
  <div class="part">
    <div class="pname">${esc(p.name)}${p.coverage != null && p.coverage < 1 ? `<span class="cov"> · ${Math.round(p.coverage * 100)}% measured</span>` : p.score == null ? `<span class="cov"> · not measured yet</span>` : ""}</div>
    <div class="track"><div class="fill" style="width:${p.score != null ? p.score * 10 : 0}%"></div></div>
    <div class="pscore">${p.score != null ? p.score.toFixed(1) : "–"}</div>
  </div>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>First Bite snapshot: ${esc(name)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=Plus+Jakarta+Sans:wght@400..800&display=swap" rel="stylesheet">
<style>
  :root { --ink:#2b2118; --body:#4a3d33; --muted:#6b5a4c; --cream:#fbf7ee; --card:#fffdf8; --line:#e3d5bd; --honey:#8a5212; --honey-light:#e8b04b; --sand:#f3ebda; --good:#2f6b3f; }
  * { box-sizing: border-box; margin: 0; }
  html { background: var(--cream); }
  body { font: 400 12.5px/1.42 "Plus Jakarta Sans", system-ui, sans-serif; color: var(--body); max-width: 820px; margin: 0 auto; padding: 26px 36px; }
  h1, h2, .big { font-family: Fraunces, Georgia, serif; color: var(--ink); font-weight: 500; }
  header { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid var(--line); padding-bottom: 12px; }
  .brand { font-family: Fraunces, Georgia, serif; font-size: 17px; color: var(--ink); }
  .brand b { color: var(--honey); font-weight: 600; }
  .meta { color: var(--muted); font-size: 12px; text-align: right; }
  .top { display: grid; grid-template-columns: 200px 1fr; gap: 26px; margin-top: 18px; align-items: start; }
  .kicker { text-transform: uppercase; letter-spacing: .14em; font-size: 10.5px; font-weight: 700; color: var(--honey); }
  h1 { font-size: 25px; line-height: 1.15; margin-top: 4px; }
  .scorecard { background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 18px 18px 14px; text-align: center; }
  .big { font-size: 56px; line-height: 1; margin-top: 6px; }
  .big small { font-size: 20px; color: var(--muted); }
  .band { display: inline-block; margin-top: 8px; background: var(--sand); color: var(--honey); font-weight: 700; border-radius: 999px; padding: 3px 12px; }
  .means { margin-top: 6px; color: var(--ink); font-weight: 600; font-size: 12px; line-height: 1.3; }
  .bands { margin-top: 10px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; font-size: 10.5px; line-height: 1.3; color: var(--muted); }
  .bands > div { border-top: 3px solid var(--line); padding-top: 5px; }
  .bands b { font-weight: 700; color: var(--ink); }
  .bands span { display: block; }
  .bands .on { border-top-color: var(--honey); color: var(--ink); }
  .parts { display: grid; gap: 6px; margin-top: 10px; }
  .cov { color: var(--muted); font-weight: 400; font-size: 10.5px; }
  .part { display: grid; grid-template-columns: 215px 1fr 30px; gap: 10px; align-items: center; }
  .pname { color: var(--ink); font-weight: 600; font-size: 12.5px; }
  .track { height: 9px; background: var(--sand); border-radius: 999px; overflow: hidden; }
  .fill { height: 100%; background: linear-gradient(90deg, var(--honey-light), var(--honey)); border-radius: 999px; }
  .pscore { text-align: right; font-weight: 700; color: var(--ink); }
  .coverage { margin-top: 10px; font-size: 11px; color: var(--muted); }
  h2 { font-size: 16px; margin: 18px 0 7px; }
  .working { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 22px; padding: 0; list-style: none; }
  .working li { padding-left: 18px; position: relative; }
  .working li::before { content: "✓"; position: absolute; left: 0; color: var(--good); font-weight: 800; }
  .fixes { display: grid; gap: 8px; counter-reset: f; }
  .fix { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 10px 14px 10px 46px; position: relative; }
  .fix::before { counter-increment: f; content: counter(f); position: absolute; left: 14px; top: 10px; width: 22px; height: 22px; border-radius: 50%; background: var(--ink); color: var(--cream); font-weight: 700; display: grid; place-items: center; font-size: 12px; }
  .fix h3 { font-size: 14px; color: var(--ink); }
  .fix p { margin-top: 3px; }
  .worth { color: var(--honey); font-weight: 700; margin-top: 4px; }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
  .compare { width: 100%; border-collapse: collapse; }
  .compare td, .compare th { text-align: left; padding: 5px 0; border-bottom: 1px solid var(--line); }
  .compare th { font-size: 11px; color: var(--muted); font-weight: 600; }
  .note { background: var(--sand); border-radius: 12px; padding: 10px 12px; }
  footer { margin-top: 16px; padding-top: 10px; border-top: 1px solid var(--line); font-size: 10.5px; color: var(--muted); }
  @media (max-width: 640px) { body { padding: 20px 16px; } .top, .row, .working { grid-template-columns: 1fr; } .bands { grid-template-columns: 1fr 1fr; } .part { grid-template-columns: 110px 1fr 28px; } }
  @page { size: letter; margin: 0; }
  @media print { html, body { background: var(--cream); -webkit-print-color-adjust: exact; print-color-adjust: exact; } body { padding: 18px 34px 0; } h1 { font-size: 21px; } .working { gap: 4px 22px; } h2 { font-size: 15.5px; } .big { font-size: 50px; } h2 { margin: 15px 0 6px; } .fix p { margin-top: 2px; } }
</style></head><body>
<header>
  <div class="brand">butter<b>bite</b> digital</div>
  <div class="meta">First Bite snapshot · ${esc(date)}<br>${esc(r.site.replace(/^https?:\/\//, "").replace(/\/$/, ""))}</div>
</header>

<section class="top">
  <div class="scorecard">
    <div class="kicker">First Bite score</div>
    <div class="big">${r.overall?.toFixed(1) ?? "–"}<small> / 10</small></div>
    <div class="band">${esc(bandName ?? "")}</div>
    <p class="means">${esc(bands.find(([b]) => b === bandName)?.[2] ?? "")}</p>
  </div>
  <div>
    <div class="kicker">${esc(name)}${town ? ` · ${esc(town)}` : ""}</div>
    <h1>How patients find and choose you online</h1>
    <div class="parts">${r.parts.map(bar).join("")}</div>
    <p class="coverage">Based on ${Math.round(r.measuredShare * 100)}% of our checklist; what we couldn't measure yet doesn't count for or against you.</p>
  </div>
</section>
<div class="bands">${bands.map(([b, range, means]) => `<div class="${b === bandName ? "on" : ""}"><b>${b}</b> · ${range}<span>${esc(means)}</span></div>`).join("")}</div>

<h2>What's already working</h2>
<ul class="working">${working.slice(0, 4).map((w) => `<li>${esc(w)}</li>`).join("")}</ul>

<h2>The three fixes worth the most</h2>
<div class="fixes">${top.map((f) => `<div class="fix"><h3>${esc(f.title)}</h3><p>${esc(f.why)}</p><p class="worth">${esc(f.worth)}</p></div>`).join("")}</div>

<div class="row">
  ${rival ? `<div><h2>You and the top practice nearby</h2>
  <table class="compare"><tr><th>Google Maps, "dentist in ${esc(place.town)}"</th><th>Reviews</th></tr>
  ${G.rankings.dentist.top.slice(0, 3).map((x, i) => `<tr><td>${i + 1}. ${x.self ? `<b>${esc(x.name.split(";")[0])}</b>` : esc(x.name.split(";")[0])}</td><td>${x.reviews}</td></tr>`).join("")}</table></div>` : "<div></div>"}
  <div><h2>Also worth knowing</h2>
  ${opt("--note") ? `<p class="note">${esc(opt("--note"))}</p>` : ""}
  <p${opt("--note") ? ' style="margin-top:8px"' : ""}>Dollar figures assume a new patient is worth about ${money(NEW_PATIENT)} in their first year (industry average); we'll redo them with your numbers.</p></div>
</div>

<footer>Not measured yet: ${esc(notYet.join(", "))}. Measured ${esc(date)} by butterbite digital · butterbitedigital.com · We re-measure every quarter.</footer>
</body></html>`;

const out = opt("--out") ?? "snapshot.html";
writeFileSync(out, html);
console.log(`Snapshot written: ${out}`);
const pdf = opt("--pdf");
if (pdf) {
  const { chromium } = createRequire(import.meta.url)("playwright");
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto(`file://${new URL(out, `file://${process.cwd()}/`).pathname}`, { waitUntil: "networkidle" });
  await p.pdf({ path: pdf, format: "Letter", printBackground: true });
  await b.close();
  console.log(`PDF written: ${pdf}`);
}
