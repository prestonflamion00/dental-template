# butterbite digital website

Our own marketing site at butterbitedigital.com. Plain static files in `public/`, no build step, served by its own Cloudflare Worker (`butterbite-site`). Self-contained so it can move to its own repo later.

**Cloudflare Worker settings:** repo `dental-template`, Path `/business-site`, no build command, deploy command `npx wrangler@4 deploy`.

**Pages:** `public/index.html` is the umbrella home page (small businesses, with dental as the featured industry) and `public/dental/index.html` is the dental page (butterbitedigital.com/dental/), where all dental outreach should link. A new industry gets its own folder the same way.

**City pages (Nov 11):** `public/tampa-bay/`, `public/denver/` and `public/indianapolis/` are built from the home page by `node business-site/make-city-pages.mjs` (local wording, the towns we cover, and a contact form that tags its city in the email subject). Run it after every change to `public/index.html`, and don't edit the city pages by hand. Both pages share `public/site.css` and `public/site.js`.

**Contact form:** `worker.ts` handles `POST /api/contact` and emails the request to `CONTACT_TO` from `CONTACT_FROM` (runtime variables set in Cloudflare). Each form sends a `source` ("home page" or "dental page") that shows in the email. Nothing is stored. `CONTACT_TO` must be a verified Email Routing destination: hello@butterbitedigital.com is verified (it forwards to the shared Gmail), so replies there default to hello@. `CONTACT_FROM` is website@butterbitedigital.com.

**Domain:** the site is served at butterbitedigital.com (custom domains in `wrangler.jsonc`); a Cloudflare redirect rule sends www.butterbitedigital.com to it. **Before launch:** remove `noindex` from every page (`public/index.html`, `public/dental/index.html`) and the `Disallow` from `public/robots.txt`.

Example-site screenshots in `public/img/` show each design (Butter, Honey, Cinnamon) on a fictional demo practice: a desktop screen (`*-desktop.webp`) with a phone screen (`*-top.webp`) over it. Regenerate them with the clean-screenshot tool (it also writes a tall `*.webp` strip, which this site doesn't use; delete those), then the link preview image:

```
node scripts/shots.mjs business-site/public/img butter="https://demos.butterbite.workers.dev/maple-grove/?design=butter" honey="https://demos.butterbite.workers.dev/little-sprouts/?design=honey" cinnamon="https://demos.butterbite.workers.dev/lumiere/?design=cinnamon"
cd business-site && node og/make-og.mjs
```

`og.jpg` is the picture shown when the site link is shared; its URL in `index.html` must be updated when the real domain is set.
