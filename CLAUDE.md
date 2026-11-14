# butterbite digital — working notes for Claude

Preston and Foster run **butterbite digital** (always lowercase): websites and marketing for small local businesses in Tampa Bay, Denver and Indianapolis. Preston builds (Denver); Foster sells (St. Pete). Plans: **Core** ($999 setup + $249/mo) and **Growth** ($1,799 + $449/mo); founding prices are half.

## Where things live
- **Plan & decision log:** https://claude.ai/artifact/2HQqnyAjEio5fS2YGrwtnC (record every decision here)
- **Packages doc:** https://claude.ai/artifact/XVa7YgCjziXk1YKTY8FC19
- **To-do list:** https://claude.ai/artifact/R1hZsJ2Wse6JkmNkg2Pf2A (collection `items`)
- **Google Drive:** folder "butterbite digital" (shared with Foster). Client folders inside it, e.g. "Seminole Scooters".
- **This repo:** client sites = one Next.js static template. Facts per client in `config/offices/*.ts`, building blocks in `components/sections/`. Business site (butterbitedigital.com) in `business-site/`.

## How we work
- Plain language, short answers, click-by-click steps. Screenshots are welcome.
- Look up best practice whenever we meet a new industry or type of company.
- Every change goes on a branch with a preview link. Merge to main and deploy live **only after Preston says "approved"**.
- **Approved changes go live in the overnight window (about 12:50am Denver time), not right away**, unless Preston says "now". After an approval, schedule a one-time task in the session for that night that merges and deploys, then report what went live.
- Client previews: `npx wrangler versions upload --preview-alias X` → `https://X-demos.butterbite.workers.dev`. Business site: run it inside `business-site/` → `https://X-butterbite-site.butterbite.workers.dev`. Wrangler sometimes fails the first time; retry.
- Run `npm run check:responsive` and `npm run check:contrast` before releases. Never let cards or swipe rows touch the screen edge (16px phone gutter).
- After builds, run `git checkout thumbnails/`.

## Saving usage
- When Preston says usage is getting low, do only light work (answers, small text edits, drafts). Builds, previews, screenshots and research wait for the overnight window. Claude can't see the usage meter, so Preston says when.
- Work only on the site Preston is working on. Build just that site for its preview (`ONLY=<id> npm run build:all`, own preview alias).
- **Frozen:** the dental demos and the fictional demos. Don't update, check or screenshot them unless we're about to show one.
- Push template changes to live client sites in batches, when decided; run the full checks then.

## Never
- Ask for or print tokens, keys or passwords (test keys by using them). Use `CLOUDFLARE_API_TOKEN` as a Bearer token; if the proxy auth error appears, stop and tell Preston.
- Change DNS on a client's domain without showing the change and getting approval.
- Handle patient data.
- Send email to Foster without showing a draft first; send only when Preston says "send".
- Put Preston's or Foster's names or photos on the website, add a "Built for…" greeting, or publicly call out dentists.
- Share the butterbite Gmail login. Enter Preston's SSN.
- Use he/she for people whose pronouns aren't stated; use they/them.
