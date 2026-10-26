/**
 * Uptime monitor: a scheduled Cloudflare Worker that checks every site in sites.ts every 5 minutes
 * and emails us when one goes down and again when it recovers (not on every check).
 *
 * A site counts as down when the page doesn't answer 200 within 10 seconds, doesn't contain its
 * expected text, or (for sites with a live contact form) the form endpoint doesn't answer.
 * Each failure is re-checked once before alerting, so a single blip doesn't page anyone.
 *
 * Bindings (wrangler.jsonc): STATE (KV, last known status per site), EMAIL (send_email).
 * Runtime variables (dashboard, kept across deploys): ALERT_TO (a verified Email Routing
 * destination), ALERT_FROM (a sender on a domain with Email Routing enabled).
 */

import { SITES, type Site } from "./sites";

interface Env {
  STATE: { get(key: string): Promise<string | null>; put(key: string, value: string): Promise<void> };
  EMAIL: { send(message: { to: string; from: { email: string; name?: string }; subject: string; text: string }): Promise<unknown> };
  ALERT_TO?: string;
  ALERT_FROM?: string;
}

const TIMEOUT_MS = 10_000;

/** Returns null when the site is healthy, or a short reason when it isn't. */
async function problem(site: Site): Promise<string | null> {
  try {
    const res = await fetch(site.url, { signal: AbortSignal.timeout(TIMEOUT_MS), headers: { "user-agent": "butterbite-monitor" } });
    if (res.status !== 200) return `page answered ${res.status}`;
    if (!(await res.text()).includes(site.expect)) return `page is missing “${site.expect}”`;
    if (site.form) {
      // A GET is refused with 405 by a healthy form endpoint; anything else means the Worker isn't answering.
      const api = await fetch(new URL("/api/contact", site.url), { signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (api.status !== 405) return `contact form endpoint answered ${api.status}`;
    }
    return null;
  } catch (e) {
    return e instanceof Error && e.name === "TimeoutError" ? `no answer within ${TIMEOUT_MS / 1000}s` : "could not connect";
  }
}

async function check(site: Site): Promise<string | null> {
  const first = await problem(site);
  if (!first) return null;
  await new Promise((r) => setTimeout(r, 20_000));
  return problem(site);
}

async function alert(env: Env, subject: string, lines: string[]) {
  if (!env.ALERT_TO || !env.ALERT_FROM) {
    console.log(`[monitor] ${subject} (no ALERT_TO/ALERT_FROM set, email skipped)`);
    return;
  }
  await env.EMAIL.send({
    to: env.ALERT_TO,
    from: { email: env.ALERT_FROM, name: "Butterbite monitor" },
    subject,
    text: [...lines, "", `Checked ${new Date().toUTCString()}. You'll get one more email when it recovers.`].join("\n"),
  });
}

async function runChecks(env: Env) {
  await Promise.all(
    SITES.map(async (site) => {
      const reason = await check(site);
      const now = reason ? "down" : "up";
      const key = `${site.name}|${site.url}`;
      const before = (await env.STATE.get(key)) ?? "up";
      if (now === before) return;
      await env.STATE.put(key, now);
      if (reason) await alert(env, `DOWN: ${site.name}`, [`${site.name} is down: ${reason}.`, site.url]);
      else await alert(env, `Recovered: ${site.name}`, [`${site.name} is back up.`, site.url]);
    }),
  );
}

export default {
  async scheduled(_event: unknown, env: Env, ctx: { waitUntil(p: Promise<unknown>): void }) {
    ctx.waitUntil(runChecks(env));
  },
};
