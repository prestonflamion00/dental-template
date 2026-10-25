# Uptime monitor

A scheduled Cloudflare Worker (`butterbite-monitor`) that checks every site in `sites.ts` every 5 minutes and emails us when one goes down, then again when it recovers. A failure is re-checked after 20 seconds before alerting.

**Add a site:** add a line to `sites.ts` (name, url, text that must appear, `form: true` if it has a live contact form) and merge to `main`.

**Cloudflare Worker settings:** repo `dental-template`, Path `/monitor`, no build command, deploy command `npx wrangler@4 deploy`. Runtime variables: `ALERT_TO` (a verified Email Routing destination address) and `ALERT_FROM` (a sender on a domain with Email Routing enabled). Without them it still checks, but only logs.
