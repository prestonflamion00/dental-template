/**
 * Builds the city pages (public/tampa-bay/, public/denver/, public/indianapolis/) from the home
 * page. They share its design, "What we do" and "How it works", but each has its own headline, a
 * "why local matters here" section about that area's busy seasons, the towns we cover, and a
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
  {
    slug: "tampa-bay", name: "Tampa Bay", region: "across Tampa Bay",
    h1: "Get found by customers <em>across Tampa Bay.</em>",
    lead: "From St. Pete to Brandon, when someone needs a plumber, an AC tech or a roofer, they search Google and call one of the first few businesses they trust. We make sure that’s you, and that your business looks as solid online as it is in person.",
    whyTitle: "Tampa Bay customers search when it counts",
    why: [
      ["Storm season", "After a storm, people search for roofers, tree crews and water cleanup right away. Your Google profile, reviews and phone need to be ready before it hits."],
      ["Summer heat", "When the AC quits in July, people call whoever shows up first on Google with good reviews and a number they can tap."],
      ["New neighbors", "People moving to the area don’t have a guy yet. They pick from Google ratings and reviews, not word of mouth."],
    ],
    about: ["Local, and actually reachable", "butterbite is two brothers, and one of us lives right here in Tampa Bay and knows it well, from St. Pete to Brandon. We grew up in Indianapolis, so we know how much a good local business means to a neighborhood. You’ll always deal with one of us directly, never a call center, and we’re happy to meet in person."],
    towns: ["Tampa", "St. Petersburg", "Clearwater", "Brandon", "Largo", "Riverview", "Wesley Chapel", "Palm Harbor", "Seminole", "Lutz"],
  },
  {
    slug: "denver", name: "Denver", region: "across the Denver metro",
    h1: "Get found by customers <em>across the Denver metro.</em>",
    lead: "From Arvada to Centennial, when someone needs a roofer, a furnace repair or a landscaper, they search Google and call one of the first few businesses they trust. We make sure that’s you, and that your business looks as solid online as it is in person.",
    whyTitle: "Denver customers search when it counts",
    why: [
      ["Hail season", "After a hailstorm, searches for roofers, gutters and window repair jump. The businesses that show up with strong reviews get the calls."],
      ["Snow and freeze", "Furnaces, frozen pipes and snow removal: winter emergencies go to whoever is easy to find and easy to reach."],
      ["A growing metro", "Newcomers don’t have a go-to contractor yet. They choose by Google rating, reviews and a website that looks legit."],
    ],
    about: ["Local, and actually reachable", "butterbite is two brothers, and one of us lives right here in the Denver metro and knows it well, from Arvada to Centennial. We grew up in Indianapolis, so we know how much a good local business means to a neighborhood. You’ll always deal with one of us directly, never a call center, and we’re happy to meet in person."],
    towns: ["Denver", "Aurora", "Lakewood", "Arvada", "Westminster", "Littleton", "Centennial", "Thornton", "Englewood", "Highlands Ranch"],
  },
  {
    slug: "indianapolis", name: "Indianapolis", region: "across Indianapolis",
    h1: "Get found by customers <em>across Indianapolis.</em>",
    lead: "From Carmel to Greenwood, when someone needs a plumber, an HVAC tech or a landscaper, they search Google and call one of the first few businesses they trust. We make sure that’s you, and that your business looks as solid online as it is in person.",
    whyTitle: "Indy customers search when it counts",
    why: [
      ["Winter calls", "Furnaces, frozen pipes and ice dams: in a cold snap, people call the first trustworthy business they find on Google."],
      ["Spring storms", "Wind and hail bring roof, siding and tree damage. Searches spike, and reviews decide who gets the job."],
      ["Growing suburbs", "Fishers, Westfield, Noblesville: new homeowners pick their contractors from Google ratings and reviews."],
    ],
    about: ["Indy is home", "butterbite is two brothers who grew up right here in Indianapolis. We’re back all the time, especially around the holidays, and it means a lot to help Indy businesses grow. You’ll always deal with one of us directly, by text, call or email, never a call center."],
    towns: ["Indianapolis", "Carmel", "Fishers", "Noblesville", "Greenwood", "Westfield", "Avon", "Plainfield", "Zionsville", "Brownsburg"],
  },
];

const list = (t) => `${t.slice(0, -1).join(", ")} and ${t[t.length - 1]}`;
function replaceOnce(html, from, to) {
  const hit = typeof from === "string" ? html.includes(from) : from.test(html);
  if (!hit) throw new Error(`make-city-pages: the home page no longer contains: ${String(from).slice(0, 80)}`);
  return html.replace(from, to);
}
const sectionById = (id) => new RegExp(`  <section[^>]*id="${id}"[\\s\\S]*?</section>`);

for (const c of cities) {
  let h = home;
  h = replaceOnce(h, "<title>butterbite digital | Websites and local marketing for small businesses</title>", `<title>butterbite digital | Websites and local marketing for ${c.name} businesses</title>`);
  h = replaceOnce(h, "Serving Tampa Bay, Denver and Indianapolis.", `Serving ${list(c.towns.slice(0, 5))} and nearby.`);
  h = replaceOnce(h, '<meta property="og:url" content="https://butterbitedigital.com/">', `<meta property="og:url" content="https://butterbitedigital.com/${c.slug}/">`);
  // Hero: the city's own headline and pitch.
  h = replaceOnce(h, '<p class="eyebrow">For local businesses in Tampa Bay, Denver and Indianapolis</p>', `<p class="eyebrow">${c.name} · Websites and local marketing</p>`);
  h = replaceOnce(h, "<h1>More customers, <em>less hassle.</em></h1>", `<h1>${c.h1}</h1>`);
  h = replaceOnce(h, /<p class="lead">We build your website and run the marketing around it:[^<]*<\/p>/, `<p class="lead">${c.lead}</p>`);
  // "Where we work" (the three cities) becomes why local matters here, plus the towns we cover.
  h = replaceOnce(h, sectionById("work"), `  <section class="alt" id="local" aria-labelledby="local-title">
    <div class="wrap">
      <p class="eyebrow">Why local matters</p>
      <h2 id="local-title">${c.whyTitle}</h2>
      <div class="cards">
${c.why.map(([t, p]) => `        <div class="card"><h3>${t}</h3><p>${p}</p></div>`).join("\n")}
      </div>
      <h3 class="towns-title" style="margin-top: 40px">Where we work ${c.region}</h3>
      <ul class="towns">
${c.towns.map((t) => `        <li>${t}</li>`).join("\n")}
      </ul>
      <p class="pillar-extra">For plumbers, HVAC, electricians, landscapers, roofers, cleaners, pest control and other local service businesses.</p>
    </div>
  </section>`);
  // About us: the short, local version for this city.
  h = replaceOnce(h, sectionById("about"), `  <section id="about" aria-labelledby="about-title">
    <div class="wrap">
      <p class="eyebrow">About us</p>
      <h2 id="about-title">${c.about[0]}</h2>
      <p class="lead">${c.about[1]}</p>
    </div>
  </section>`);
  h = replaceOnce(h, "<h2 id=\"contact-title\">Let’s talk about your business.</h2>", `<h2 id="contact-title">Let’s talk about your ${c.name} business.</h2>`);
  h = replaceOnce(h, 'data-source="home page"', `data-source="${c.name} page"`);
  h = replaceOnce(h, "small businesses in Tampa Bay, Denver and Indianapolis.</p>", `small businesses in ${c.name}. <a href="/">butterbitedigital.com</a></p>`);
  mkdirSync(join(pub, c.slug), { recursive: true });
  writeFileSync(join(pub, c.slug, "index.html"), h);
  console.log(`Wrote public/${c.slug}/index.html`);
}
