# Handoff: butterbite digital, dental websites (as of Nov 6, 2026)

Context for a new Claude session. Written by the previous session so nothing is lost.

## Who and what
- I'm Preston (prestonflamion@gmail.com). My partner is Foster. Our company is **butterbite digital**, always written in lowercase. We build websites and online presence for dental practices.
- This repo (`prestonflamion00/dental-template`) is our website template: a Next.js static site per practice, built from `config/offices/*.ts`, deployed on Cloudflare Workers.
- Our business site is butterbitedigital.com (separate folder `business-site/`).

## Standing rules (always follow)
- Plain language, short answers, click-by-click steps for anything I do myself.
- Every change goes on a branch with a preview link; send me the link; **merge to main only after I say "approved"**.
- Record every decision in the plan doc (below).
- Never ask me for tokens, keys or passwords in chat. Never print a key or token, not even part of it. Test keys by using them.
- Show me any DNS change on a client domain and wait for my approval.
- No patient data, ever.
- Run `npm run check:responsive` (with URLs) and `npm run check:contrast` before releases.
- Cloudflare: use `CLOUDFLARE_API_TOKEN` as `Authorization: Bearer $CLOUDFLARE_API_TOKEN` (env var, never print it). If the proxy auth error returns, stop and tell me.
- Demos of real practices never show a "Built for …" greeting or personal welcome note. Removed everywhere; don't bring it back.

## How to build and preview
- Build everything: `npm run build:all` (builds every practice into `site/`). One practice: `ONLY=herman-family-dentistry npm run build:all`.
- After a build, restore committed thumbnails if they changed: `git checkout thumbnails/`.
- Serve locally: `npx serve site -l 4411`.
- Checks: `node scripts/check-responsive.mjs http://localhost:4411/<practice>/` (also enforces the first-screen rule) and `npm run check:contrast`.
- Preview upload: `npx wrangler versions upload --preview-alias <alias>` → `https://<alias>-demos.butterbite.workers.dev/<practice>/`.
- Production (main) deploys automatically on Cloudflare: https://demos.butterbite.workers.dev/<practice>/

## Branches
- `main`: last merged via PR #15 (first-screen rules, red Emergency button, pen underline, smoother request form, link-preview thumbnails, Herman demo v1).
- **`claude/herman-hero-mockup`**: current work, NOT merged. Preview alias `herman-mockup` → https://herman-mockup-demos.butterbite.workers.dev/herman-family-dentistry/
- Old mockup links (for comparison only): hero-a-card, hero-b-bleed, hero-c-soft, smile-line-mockup, wow-mockup.

## Practices in the template
- Fictional samples: maple-grove, lumiere, little-sprouts.
- Real-practice private demos: family-orthodontics-hudson (Hudson + North Cambridge, MA), copelin-dental (Norman, OK), **herman-family-dentistry** (Vincennes, IN).

## Herman demo: what's built and decided (on claude/herman-hero-mockup)
- Built from their public site vincennesdentalpractice.com: their photos (team group shot, office, 4 doctor portraits, 21 staff photos), their 30-second video, all their text.
- **Phone hero = option B** (`heroLayout: "bleed"`): edge-to-edge team photo running up behind a see-through top bar; practice name big under the photo (one line, sized to fit); headline shrunk to a one-line tagline with the pen underline; then rating, Request (full width), Call + Emergency (same size), open status.
- **Name morph:** when the big name nears the top bar (threshold 24px; back at 72px, so no flicker), it glides into the bar's logo at a fixed 420 ms, by font size, so the last frame is identical to the logo. Fast flings that carry it off screen switch without a glide. Call + menu sit in one frosted capsule. I liked it; asked to keep refining.
- Desktop: team photo card with the building photo tucked at its corner (I loved this). I haven't reviewed desktop for the newest phone changes.
- Pages: each doctor has a page (big photo, bio); all 26 services grouped (preventive, restorative, cosmetic, gum, specialty) with a page each; team page (25 people); payments & financing; careers; town pages (Vincennes, Washington, Lawrenceville); video section; Facebook + YouTube links.
- Phone menu: the sticky bottom bar hides while the menu is open.
- Decisions: tooth drawing removed everywhere (pen underline stays); no rotating quotes, no moving background, no greeting; button glows toned down; if a practice has photos, use them; demos without photos show a "Your photo here" placeholder; ask for photos before go-live; a demo must not lose content from the practice's current site unless redundant.
- Still to decide: roll option B + name morph out to other sites; merge the branch (needs my "approved").

## Herman: their current state (for my call with Dr. Eric Herman)
- 4 dentists, 21 staff, hiring; 4.9 from 183 Google reviews; site by Marketing & Media Solutions (Evansville ad agency); Google Ads paid by "RK Creative Design LLC" (Google Ads Transparency Center), one ad shows "Open 24 hours" (their Google profile hours may be wrong; check in Maps).
- Their site: no online request (Request goes to a phone number), 34/100 phone speed, 28 broken links (old "/vincennes-dental-services/" addresses), 3 services listed with no page, WebMD says "not accepting new patients", Birdeye unclaimed.
- It's a learning call, not a sale.

## Docs (Claude Docs connector)
- Plan doc (all decisions): project `0a63bb4e-eb5d-4f04-8182-67a0e6a94289`, body node `fae86f49-e18c`.
- Interview guide (general): https://claude.ai/artifact/UCsXoevUzJEMJ718jTggyo (body node `1b250065-06ae`).
- **Call prep: Dr. Eric Herman** (self-contained): https://claude.ai/artifact/E82XpESVg8TYSwzTSjLtTF (project `6a41f3e1-3f4b-4b2d-bde3-8c22abc3cb56`, body node `a11c4115-74e4`).
- **The butterbite score**: https://claude.ai/artifact/LRfdA8BTuvfNfDjf6RVXc4 (project `9d4f499c-049b-4703-b05e-19bf75cc36a9`, body node `259b7574-e95b`).
- Tracker: https://claude.ai/artifact/R1hZsJ2Wse6JkmNkg2Pf2A

## The First Bite score (our signature grade)
- Decided: name = butterbite **First Bite score** (bands: Golden 8.5+, Spreadable 7–8.4, Softening 5–6.9, Cold butter <5). **Everything automated.** Free snapshot for every demo call; re-score clients every quarter.
- 6 parts, weights add to 10: Google profile 2.5, Reviews 2, Patient experience 2, Local search 1.5, Speed & health 1, AI & listings 1. Each part scored 0–10 from fixed pass/partial/fail checks (checklist in the score doc).
- Tool: `node scripts/first-bite/score.mjs <website> [--out report.json]` (crawl, Lighthouse on a phone, first-screen check in a browser, search basics). `scripts/first-bite/places.mjs` adds Google profile, reviews and Google Maps rankings via the Places API (New). Checks the API can't see (verified, posts, booking link, owner replies) stay "not measured"; the score reports how much of the checklist it covered.
- Results so far (website parts only): Herman's real site 3.5; our Herman demo 8.5.
- "So what" (still to work out): tie each part to patient steps → new patients → dollars. Defaults until a practice gives theirs: **new patient ≈ $1,200 first year**; 30 new patients/month typical; 35% of dentists say they're not busy enough (ADA Q3 2025); ~30% of new-patient calls unanswered; ~50% of answered calls book; ~3% of website visitors get in touch. Sources in the score doc.
- Still to build: AI answers check (OpenAI + Gemini keys), directory checks (WebMD, Healthgrades, Yelp, Apple/Bing Maps), the one-page snapshot, fixing our demo's slow main photo on phones (5.1 s).

## API keys
- **Google Places**: key created in Google Cloud project "butterbite First Bite" (free trial, billing linked), restricted to "Places API (New)". Saved as environment variable **`GOOGLE_PLACES_API_KEY`** in the Default environment. (The network-secret form didn't work for Google's header, so we used the variable.) Never print it; test by running the scorer.
- **Next: OpenAI** (platform.openai.com → Billing: add $10, auto-recharge off → API keys → Create, name "First Bite") and **Gemini** (aistudio.google.com → Get API key → pick project "butterbite First Bite"). Add each the same way, as environment variables `OPENAI_API_KEY` and `GEMINI_API_KEY`, then start a new session.

## Other open items
- Agree a monthly price range (X–Y) with Foster before the Eric call; confirm founding pricing with Foster.
- butterbite's own Google Business Profile: waiting on verification.
- Later: Foster's delegated Gmail access, YouTube pilot, AI visibility check, automated review kit, prospect demo automation.
