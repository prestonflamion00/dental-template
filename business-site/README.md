# Butterbite business website

Our own marketing site (working name "Butterbite"). Plain static files in `public/`, no build step, served by its own Cloudflare Worker (`butterbite-site`). Self-contained so it can move to its own repo later.

**Cloudflare Worker settings:** repo `dental-template`, Path `/business-site`, no build command, deploy command `npx wrangler@4 deploy`.

**Before launch:** set the real name and domain, add the booking link (free Cal.com account) and email in the contact section, and remove `noindex` from `public/index.html` and the `Disallow` from `public/robots.txt`.

Example-site screenshots in `public/img/` are of the fictional demo practices.
