/**
 * Builds the city pages (public/tampa-bay/, public/denver/, public/indianapolis/) from the home
 * page, so they always match it: same sections, with local wording, the towns we cover, and a
 * contact form that tags its city. Run after changing public/index.html:
 *
 *   node business-site/make-city-pages.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pub = join(dirname(fileURLToPath(import.meta.url)), "public");
const home = readFileSync(join(pub, "index.html"), "utf8");

const cities = [
  { slug: "tampa-bay", name: "Tampa Bay", towns: ["Tampa", "St. Petersburg", "Clearwater", "Brandon", "Largo", "Riverview", "Wesley Chapel"] },
  { slug: "denver", name: "Denver", towns: ["Denver", "Aurora", "Lakewood", "Arvada", "Westminster", "Littleton", "Centennial"] },
  { slug: "indianapolis", name: "Indianapolis", towns: ["Indianapolis", "Carmel", "Fishers", "Noblesville", "Greenwood", "Westfield", "Avon"] },
];

const list = (t) => `${t.slice(0, -1).join(", ")} and ${t[t.length - 1]}`;
function replaceOnce(html, from, to) {
  if (!html.includes(from)) throw new Error(`make-city-pages: the home page no longer contains: ${from.slice(0, 80)}`);
  return html.replace(from, to);
}

for (const c of cities) {
  let h = home;
  h = replaceOnce(h, "<title>butterbite digital | Websites and local marketing for small businesses</title>", `<title>butterbite digital | Websites and local marketing for ${c.name} businesses</title>`);
  h = replaceOnce(h, "Serving Tampa Bay, Denver and Indianapolis.", `Serving ${list(c.towns)}.`);
  h = replaceOnce(h, '<meta property="og:url" content="https://butterbitedigital.com/">', `<meta property="og:url" content="https://butterbitedigital.com/${c.slug}/">`);
  h = replaceOnce(h, '<p class="eyebrow">For local businesses in Tampa Bay, Denver and Indianapolis</p>', `<p class="eyebrow">For local businesses in ${c.name}</p>`);
  h = replaceOnce(h, "Local customers find you on Google, Maps", `Customers across ${c.name} find you on Google, Maps`);
  h = replaceOnce(h, '<h2 id="work-title">Built for local service businesses in Tampa Bay, Denver and Indianapolis</h2>', `<h2 id="work-title">Built for service businesses across ${c.name}</h2>`);
  h = replaceOnce(h, /<p class="pillar-extra"><strong>Pick your area:<\/strong>.*?<\/p>/.exec(h)[0], `<p class="pillar-extra"><strong>Where we work:</strong> ${list(c.towns)}, and the towns around them.</p>`);
  h = replaceOnce(h, "<h2 id=\"contact-title\">Let’s talk about your business.</h2>", `<h2 id="contact-title">Let’s talk about your ${c.name} business.</h2>`);
  h = replaceOnce(h, 'data-source="home page"', `data-source="${c.name} page"`);
  h = replaceOnce(h, "small businesses in Tampa Bay, Denver and Indianapolis.</p>", `small businesses in ${c.name}.</p>`);
  mkdirSync(join(pub, c.slug), { recursive: true });
  writeFileSync(join(pub, c.slug, "index.html"), h);
  console.log(`Wrote public/${c.slug}/index.html`);
}
