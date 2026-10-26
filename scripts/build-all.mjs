/**
 * Builds every practice in config/offices/ into its own folder, plus two index pages:
 *
 *   site/index.html            ← PUBLIC "Website examples": only offices with `showcase: true`
 *   site/hub-77aa44n8g2/      ← PRIVATE hub listing every practice (unlisted URL)
 *   site/maple-grove/          ← one full static site per practice
 *
 * Real prospects (no `showcase`) are never listed publicly; anyone with their link can open it.
 * All demo builds are marked noindex so search engines don't list them (set NOINDEX=0 to disable).
 *
 * Usage:  BASE_PATH=/dental-template SITE_URL=https://you.github.io/dental-template node scripts/build-all.mjs
 * (BASE_PATH is the sub-folder the site is served from; empty for a root domain.
 *  SITE_URL is optional and only used to show full shareable links on the index page.)
 * Requires Node 22.18+ (reads the .ts config files with built-in type stripping).
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = join(import.meta.dirname, "..");
const base = (process.env.BASE_PATH ?? "").replace(/\/$/, "");
const siteUrl = (process.env.SITE_URL ?? "").replace(/\/$/, "");
const noindex = process.env.NOINDEX !== "0";
// Unlisted address of the private hub. Not linked from anywhere on the site.
const HUB_PATH = process.env.HUB_PATH || "hub-77aa44n8g2";
const outDir = join(root, "site");

const slugs = readdirSync(join(root, "config/offices"))
  .filter((f) => f.endsWith(".ts"))
  .map((f) => f.replace(/\.ts$/, ""))
  .sort();

// Every file must also be registered in config/office.ts (that's what the app imports).
const registry = readFileSync(join(root, "config/office.ts"), "utf8");
const missing = slugs.filter((s) => !registry.includes(`"${s}":`) && !registry.includes(`\n  ${s}:`));
if (missing.length) {
  console.error(`✗ Not registered in config/office.ts: ${missing.join(", ")}`);
  process.exit(1);
}

const { themes } = await import(pathToFileURL(join(root, "config/themes.ts")).href);

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const built = [];
for (const slug of slugs) {
  console.log(`\n▶ Building ${slug} → ${base}/${slug}/`);
  rmSync(join(root, "out"), { recursive: true, force: true });
  const res = spawnSync("npx", ["next", "build"], {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      STATIC_EXPORT: "1",
      NEXT_PUBLIC_OFFICE: slug,
      NEXT_PUBLIC_BASE_PATH: `${base}/${slug}`,
      NEXT_PUBLIC_NOINDEX: noindex ? "1" : "",
    },
  });
  if (res.status !== 0) process.exit(res.status ?? 1);
  cpSync(join(root, "out"), join(outDir, slug), { recursive: true });
  const office = (await import(pathToFileURL(join(root, "config/offices", `${slug}.ts`)).href)).default;
  built.push({ slug, office });
}

/* ── Index page ─────────────────────────────────────────────────────────── */
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
function cardsFor(items, showBadge) {
  return items
  .map(({ slug, office: o }) => {
    const t = themes[o.theme.preset];
    const accent = o.theme.accent ?? t.accent;
    const url = `${base}/${slug}/`;
    const shareUrl = siteUrl ? `${siteUrl}/${slug}/` : url;
    return `
    <li class="card" style="--accent:${accent};--orb:${t.orb1}">
      <div class="swatch" aria-hidden="true"></div>
      <h2>${esc(o.practice.name)}</h2>
      <p class="meta">${esc(o.contact.address.city)}, ${esc(o.contact.address.region)} · ${esc(t.label)} theme</p>
      <p class="tag">${esc(o.practice.tagline)}</p>
      ${showBadge ? `<p class="badge">${o.showcase ? "Public example" : "Private: link only"}</p>` : ""}
      <div class="actions">
        <a class="btn primary" href="${url}">Open website</a>
        <a class="btn" href="${url}?demo">Design demo</a>
        <button class="btn share" type="button" data-url="${esc(shareUrl)}" data-title="${esc(o.practice.name)}">Share link</button>
      </div>
      <p class="link">${esc(shareUrl)}</p>
    </li>`;
  })
  .join("");
}

function renderPage({ title, heading, lead, items, showBadge }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(title)}</title>
<style>
  :root { --ink:#2b211b; --muted:#5c4e44; --bg:#fbf7f1; }
  * { box-sizing: border-box; }
  body { margin:0; font: 17px/1.6 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; color:var(--ink);
    background: radial-gradient(60vmax 60vmax at 90% -10%, #f2cfae88, transparent 70%),
                radial-gradient(50vmax 50vmax at -10% 110%, #c5dbe888, transparent 70%), var(--bg); min-height:100vh; }
  main { max-width: 1080px; margin: 0 auto; padding: 56px 16px 64px; }
  h1 { font: 500 clamp(2.2rem, 5vw, 3.4rem)/1.1 ui-serif, Georgia, serif; letter-spacing:-.02em; margin:0 0 8px; }
  .lead { color:var(--muted); margin:0 0 36px; font-size:1.1rem; }
  ul { list-style:none; padding:0; margin:0; display:grid; gap:20px; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); }
  .card { position:relative; background:rgb(255 255 255 / .7); backdrop-filter: blur(18px) saturate(160%); -webkit-backdrop-filter: blur(18px) saturate(160%);
    border:1px solid #fff; border-radius:26px; padding:24px; box-shadow: inset 0 1px 0 #fff, 0 20px 40px -24px rgb(60 40 20 / .3); }
  .swatch { height:72px; border-radius:16px; margin-bottom:18px; background: linear-gradient(135deg, var(--orb), var(--accent)); }
  h2 { font: 500 1.5rem/1.2 ui-serif, Georgia, serif; margin:0; }
  .meta { color:var(--muted); font-size:.95rem; margin:4px 0 0; }
  .tag { margin:12px 0 18px; }
  .actions { display:flex; gap:10px; flex-wrap:wrap; }
  .btn { display:inline-flex; align-items:center; min-height:46px; padding:0 18px; border-radius:999px; font-weight:600;
    text-decoration:none; color:var(--ink); background:#fff; border:1px solid #0001; }
  .btn.primary { background:var(--accent); color:#fff; border-color:transparent; }
  button.btn { font: inherit; font-weight:600; cursor:pointer; }
  .btn:focus-visible { outline:3px solid var(--accent); outline-offset:3px; }
  .badge { display:inline-block; font-size:.8rem; font-weight:700; padding:3px 10px; border-radius:999px; background:#f3e9df; margin:0 0 16px; }
  .empty { color:var(--muted); }
  .link { font-size:.85rem; color:var(--muted); margin:14px 0 0; word-break:break-all; }
</style>
</head>
<body>
<main>
  <h1>${esc(heading)}</h1>
  <p class="lead">${lead}</p>
  ${items.length ? `<ul>${cardsFor(items, showBadge)}
  </ul>` : `<p class="empty">Nothing here yet.</p>`}
</main>
<script>
  // Share sheet on phones (Messages, email…); copy to clipboard elsewhere.
  document.querySelectorAll(".share").forEach((b) => b.addEventListener("click", async () => {
    const url = new URL(b.dataset.url, location.href).href;
    try {
      if (navigator.share) await navigator.share({ title: b.dataset.title, url });
      else { await navigator.clipboard.writeText(url); b.textContent = "Link copied ✓"; setTimeout(() => (b.textContent = "Share link"), 2000); }
    } catch (e) {}
  }));
</script>
</body>
</html>
`;
}

// Public page: fictional showcase practices only.
writeFileSync(
  join(outDir, "index.html"),
  renderPage({
    title: "Website examples",
    heading: "Website examples",
    lead: "Example dental practice websites. Each one is a complete, working site, built to look great on phones.",
    items: built.filter((b) => b.office.showcase),
    showBadge: false,
  }),
);

// Site-wide robots.txt so crawlers skip the whole demos site, not just pages marked noindex.
if (noindex) writeFileSync(join(outDir, "robots.txt"), "User-agent: *\nDisallow: /\n");

// Private hub: every practice, including unlisted prospects.
mkdirSync(join(outDir, HUB_PATH), { recursive: true });
writeFileSync(
  join(outDir, HUB_PATH, "index.html"),
  renderPage({
    title: "All demos (private)",
    heading: "All practice demos",
    lead: `Private page: only people with this link can open it. ${built.length} practice website${built.length === 1 ? "" : "s"}. Practices marked “Private” aren’t listed on the public examples page.`,
    items: built,
    showBadge: true,
  }),
);

if (existsSync(join(root, "out"))) rmSync(join(root, "out"), { recursive: true, force: true });
console.log(`\n✓ Built ${built.length} practices into site/: ${built.map((b) => b.slug).join(", ")}`);
console.log(`  Private hub: ${base}/${HUB_PATH}/`);
