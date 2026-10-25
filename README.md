# Dental Office Website Template

### [👉 Website examples](https://prestonflamion00.github.io/dental-template/)

Each practice has its own link you can text to a dentist. The public examples page lists only the fictional showcase practices:
[Maple Grove](https://prestonflamion00.github.io/dental-template/maple-grove/) ·
[Lumière](https://prestonflamion00.github.io/dental-template/lumiere/) ·
[Little Sprouts](https://prestonflamion00.github.io/dental-template/little-sprouts/)

<sub>The live site rebuilds automatically a few minutes after every change to the `main` branch (see the **Actions** tab).</sub>

**Real prospects stay unlisted.** A practice without `showcase: true` gets its own working link, but it isn't listed on the public page. Every practice, prospects included, is listed on a private hub page at an unlisted address (the `HUB_PATH` in `scripts/build-all.mjs`). All demo sites tell search engines not to index them.

A premium, re-skinnable website for dental practices. Each practice's content, branding and section layout lives in one typed config file, so a new office needs no code changes.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · no backend, no API keys, static-export friendly.

**Demo offices included:**

| Key / URL | Practice | Theme | Notes |
| --- | --- | --- | --- |
| `maple-grove` | Maple Grove Family Dental (Portland) | warm-neutral | 3 doctors, full section set |
| `lumiere` | Lumière Dental Studio (Scottsdale) | blush-sand | Gallery promoted right after services |
| `little-sprouts` | Little Sprouts Pediatric Dentistry (Austin) | sage-blue | No gallery, emergency card near the top |

---

## Quick start

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start   # production build
npm run export         # static site for the active office in /out
npm run build:all      # every office + demo index page in /site (what GitHub Pages publishes)
npm run typecheck
npm run check:contrast # WCAG AA audit of every theme, including text on glass
```

**Sales-demo tricks (no rebuild):**
- `/?demo` shows a floating theme picker so you can switch between the three presets live.
- `/?theme=sage-blue` (or `warm-neutral`, `blush-sand`) previews a single preset.

---

## Every practice gets its own link

The live site builds **every** office in `config/offices/` (via `scripts/build-all.mjs`):

- `https://<user>.github.io/dental-template/` is the public examples page (only `showcase: true` practices)
- `https://<user>.github.io/dental-template/<HUB_PATH>/` is the private hub listing every practice, with share buttons
- `https://<user>.github.io/dental-template/<key>/` holds one full site per practice

The file name is the key and the URL, e.g. `config/offices/smith-dental.ts` → `/smith-dental/`.

**Local preview:** `npm run dev` shows the office named on this line in `config/office.ts`:

```ts
const ACTIVE_OFFICE: OfficeKey = "maple-grove"; // any key from the offices list
```

On Vercel or another host, set `NEXT_PUBLIC_OFFICE=<key>` to build a single practice (e.g. one Vercel project per practice with its own domain).

---

## Add a new office in under 10 minutes

1. **Copy a demo** (2 min). Duplicate the closest match, e.g. `config/offices/maple-grove.ts` → `config/offices/smith-dental.ts` (the file name becomes the URL), and rename the exported constant.
2. **Register it** (30 sec). In `config/office.ts`:
   ```ts
   import smithDental from "./offices/smith-dental";
   export const offices = { "maple-grove": mapleGrove, lumiere, "little-sprouts": littleSprouts, "smith-dental": smithDental } …
   ```
   The build stops with a clear message if a file in `config/offices/` isn't registered.
3. **Edit the essentials** (5 min). TypeScript flags anything missing or mistyped:
   - `practice`: name, tagline, logo text (or `logo.image: "/brand/logo.svg"`), years in practice, accepting new patients
   - `contact`: phone, email, address, `timezone`, `hours` (24h `"HH:MM"`, `null` = closed)
   - `doctors`, `services` (pick an `icon` from the `IconName` list in `config/types.ts`), `insurances`, `reviews`, `rating`, `faqs`
   - `copy`: hero headline, intros and first-visit steps. `heroHighlight` is the phrase rendered in italic accent.
   - `seo`: `siteUrl`, `title`, `description`
4. **Brand it** (1 min). Set `theme: { preset: "blush-sand", accent: "#7a4bd1" }` (accent is optional).
5. **Choose sections** (30 sec). Reorder or remove ids in `sections`:
   `hero, quickInfo, services, emergency, newPatients, doctors, cta, reviews, gallery, faq, contact`.
   The nav links follow automatically. The nav, footer and mobile action bar are always shown.
6. **Swap images** (1 min). Put doctor portraits (~4:5) in `/public/doctors/`, before/after images in `/public/gallery/`, and the forms PDF in `/public/forms/`. Then update the paths in the config.
7. Run `npm run dev` to preview (set `ACTIVE_OFFICE` to the new key), then push to `main`. The new practice goes live at `/smith-dental/`.

A fill-in **client intake form** (Google Doc) covers every field above in plain language. Use it as a call script for white-glove onboarding, or send it to the practice.

The page title, meta description, OpenGraph image, favicon colour, JSON-LD `Dentist` schema, sitemap and robots.txt are all generated from the config.

---

## Themes

Three presets are defined in `config/themes.ts` and applied as CSS custom properties on `<html data-theme="…">`:

| Preset | Feel |
| --- | --- |
| `warm-neutral` | cream, sand and terracotta |
| `sage-blue` | soft sage and misty blue, deep teal accent |
| `blush-sand` | blush pink and warm sand, rose accent |

**To swap:** change `theme.preset` in the office file.
**Brand colour:** set `theme.accent: "#hex"`. If the colour is too light for white button text or for text on frosted glass, it is darkened automatically until it meets WCAG AA.
**New preset:** add an entry to `themes` and to `THEME_PRESETS` in `config/themes.ts`, then run `npm run check:contrast`.

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, choose **Add New → Project**, import the repo, and accept the defaults (framework: Next.js).
3. *(Optional)* Under **Settings → Environment Variables**, add `NEXT_PUBLIC_OFFICE=<key>` to choose the office without editing code.
4. Deploy, then add the practice's domain under **Settings → Domains** and set `seo.siteUrl` to match.

**Many practices, one repo:** create one Vercel project per practice from the same repo, each with its own `NEXT_PUBLIC_OFFICE` and domain.

**GitHub Pages (already set up):** `.github/workflows/deploy-pages.yml` runs `npm run build:all` and publishes every practice to `https://<user>.github.io/<repo>/<key>/` on every push to `main`. If the first run fails, open **Settings → Pages**, set **Source** to **GitHub Actions**, and re-run the workflow from the **Actions** tab.

**Cloudflare Workers (where we're moving):** two kinds of Worker, both connected to this repo in the Cloudflare dashboard (Compute → Workers & Pages → Create → Import a repository):

| Worker | Build command | Deploy command | Build variables |
| --- | --- | --- | --- |
| Demos (every practice + hub) | `npm run build:all` | `npx wrangler deploy` | — |
| One practice on its own domain | `npm run export` | `npx wrangler deploy -c wrangler.practice.jsonc --name <worker-name>` | `NEXT_PUBLIC_OFFICE=<key>`, plus `NEXT_PUBLIC_NOINDEX=1` for demos |

The Worker's name in the dashboard must match the name in the deploy command (`demos` for the first). Add the practice's domain under the Worker's **Settings → Domains & Routes**.

**Other hosts:** `npm run export` writes a static site to `/out` (Netlify, Cloudflare Pages, S3, GitHub Pages). Image optimization is turned off automatically in that mode.

---

## What's mocked, and where real integrations plug in

Every integration lives behind one async function in **`lib/integrations.ts`**. To go live, replace the function body; the UI doesn't change.

| Feature | Mock today | Replace with |
| --- | --- | --- |
| Booking availability | `getAvailableSlots()`: fake slots derived from office hours | NexHealth, LocalMed, Zocdoc, Open Dental or Dentrix APIs, called from a server route |
| Booking submission | `submitBooking()`: returns a fake confirmation | Same provider. Or set `booking.url` to skip the modal and link to a hosted scheduler. |
| Contact form | `sendContactMessage()` | Formspree, Basin or Netlify Forms (static-friendly), or a Resend/Postmark server route |
| Reviews & rating badge | Read from the config | Google Places API (fetched at build time), Birdeye, Podium or Weave |
| Map | Illustrated SVG card plus a "Directions" deep link (`components/sections/Contact.tsx`) | Lazy Google Maps Embed or OpenStreetMap iframe |
| New patient forms | Sample PDF in `/public/forms` | The practice's real PDF, or a HIPAA-compliant online intake link |
| Doctor photos & gallery | Generated SVG illustrations (`scripts/make-placeholders.py`) | Real photos (keep consent on file for before/after images) |

> Don't collect protected health information through non-HIPAA form services. The forms already ask visitors not to include medical details.

---

## Project structure

```
config/
  office.ts            ← registry of offices + the active one for local dev
  types.ts             ← OfficeConfig schema (fully typed)
  themes.ts            ← presets, contrast helpers, accent override logic
  offices/             ← maple-grove.ts, lumiere.ts, little-sprouts.ts (file name = URL)
app/
  layout.tsx           ← fonts, theme variables, metadata, JSON-LD
  page.tsx             ← renders sections in config order
  privacy/, accessibility/, sitemap.ts, robots.ts, opengraph-image.tsx, icon.tsx
components/
  sections/            ← Nav, Hero, QuickInfo, Services, Emergency, NewPatients, Doctors,
                         Cta, Reviews, Gallery, Faq, Contact, Footer, MobileBar
  booking/             ← BookingProvider, BookButton, BookingModal
  ui/                  ← Modal (<dialog>), Icon, Stars, Section, Logo, RevealObserver, DemoThemeSwitcher
lib/
  hours.ts             ← open-now logic in the office's timezone, schema hours
  integrations.ts      ← all mocks / integration points
  schema.ts, format.ts
scripts/
  build-all.mjs        ← builds every office + the demo index page
  check-contrast.ts    ← WCAG AA audit for all themes
  make-placeholders.py ← regenerates placeholder art
```

## Accessibility & quality notes

- WCAG AA contrast is verified for every theme, including text on frosted glass over the most saturated background colour (`npm run check:contrast`).
- Uses semantic landmarks, a skip link, visible `:focus-visible` rings, 44–56px tap targets and 17px body text.
- Modals use native `<dialog>`, so focus is trapped, Escape closes them and focus returns to the trigger. The FAQ uses the ARIA disclosure pattern. Form errors are announced and linked to their fields with `aria-describedby`.
- Respects `prefers-reduced-motion` and `prefers-reduced-transparency`. Glass falls back to solid surfaces when `backdrop-filter` isn't supported.
- Scroll-reveal only applies when JS is running, and above-the-fold content never waits on it.
- Lighthouse (mobile) at build time: Performance 93–97, Accessibility 100, Best Practices 100, SEO 100.
