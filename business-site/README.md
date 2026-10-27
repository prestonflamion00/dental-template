# Butterbite business website

Our own marketing site (working name "Butterbite"). Plain static files in `public/`, no build step, served by its own Cloudflare Worker (`butterbite-site`). Self-contained so it can move to its own repo later.

**Cloudflare Worker settings:** repo `dental-template`, Path `/business-site`, no build command, deploy command `npx wrangler@4 deploy`.

**Contact form:** `worker.ts` handles `POST /api/contact` and emails the request to `CONTACT_TO` from `CONTACT_FROM` (runtime variables set in Cloudflare). Nothing is stored. `CONTACT_TO` must be a verified Email Routing destination, so it is the shared inbox butterbitedigital@gmail.com (where hello@butterbitedigital.com also lands), not hello@ itself. `CONTACT_FROM` is website@butterbitedigital.com.

**Domain:** the site is served at butterbitedigital.com (custom domains in `wrangler.jsonc`); a Cloudflare redirect rule sends www.butterbitedigital.com to it. **Before launch:** remove `noindex` from `public/index.html` and the `Disallow` from `public/robots.txt`.

Example-site screenshots in `public/img/` show each design (Butter, Honey, Cinnamon) on a fictional demo practice: a desktop screen (`*-desktop.webp`) with a phone screen (`*-top.webp`) over it. Regenerate them with the clean-screenshot tool (it also writes a tall `*.webp` strip, which this site doesn't use; delete those), then the link preview image:

```
node scripts/shots.mjs business-site/public/img butter="https://demos.butterbite.workers.dev/maple-grove/?design=butter" honey="https://demos.butterbite.workers.dev/little-sprouts/?design=honey" cinnamon="https://demos.butterbite.workers.dev/lumiere/?design=cinnamon"
cd business-site && node og/make-og.mjs
```

`og.jpg` is the picture shown when the site link is shared; its URL in `index.html` must be updated when the real domain is set.
