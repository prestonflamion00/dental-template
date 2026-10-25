/**
 * Cloudflare Worker for ONE practice: serves the static site and handles the contact form.
 *
 *   POST /api/contact  →  emails the message to the practice (reply-to = the visitor), then forgets it.
 *   everything else    →  the static site in out/ (via the ASSETS binding)
 *
 * Nothing is stored or logged: no database, and the message body never goes to console/logs.
 *
 * Runtime variables (set per practice in the Cloudflare dashboard, kept across deploys):
 *   CONTACT_TO    the practice's inbox; must be a verified destination address in Cloudflare Email Routing
 *   CONTACT_FROM  sender address on a domain with Email Routing enabled, e.g. website@maplegrove-demo.com
 *   PRACTICE_NAME optional, used in the subject line and sender name
 */

import { CONTACT_TOPICS } from "../lib/contact-topics";
import { parsePhone } from "../lib/phone";

interface EmailAddress {
  email: string;
  name?: string;
}
interface SendEmail {
  send(message: {
    to: string;
    from: EmailAddress;
    replyTo?: EmailAddress;
    subject: string;
    text: string;
  }): Promise<{ messageId: string }>;
}
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  EMAIL: SendEmail;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
  PRACTICE_NAME?: string;
}

const LIMITS = { name: 100, email: 200, phone: 30, message: 2000 };
/** Submissions faster than this after the page loaded are almost certainly bots. */
const MIN_FILL_MS = 2500;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\r\n]+/g, " ").trim().slice(0, max) : "");

async function handleContact(request: Request, env: Env): Promise<Response> {
  if (!env.CONTACT_TO || !env.CONTACT_FROM) return json({ ok: false, error: "not_configured" }, 503);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  // Bot traps: a hidden field humans never fill, and a minimum time on the page.
  // Pretend success so bots don't learn anything.
  const startedAt = Number(body.startedAt);
  if (clean(body.company, 100) || !startedAt || Date.now() - startedAt < MIN_FILL_MS) return json({ ok: true });

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const typedPhone = clean(body.phone, LIMITS.phone);
  const phone = typedPhone ? parsePhone(typedPhone) : null;
  const topic = CONTACT_TOPICS.find((t) => t === body.topic) ?? "Other";
  const message = typeof body.message === "string" ? body.message.trim().slice(0, LIMITS.message) : "";
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || message.length < 10 || (phone && !phone.ok)) {
    return json({ ok: false, error: "invalid" }, 400);
  }

  const practice = env.PRACTICE_NAME || "your website";
  try {
    await env.EMAIL.send({
      to: env.CONTACT_TO,
      from: { email: env.CONTACT_FROM, name: `${practice} website` },
      replyTo: { email, name },
      subject: `Website message: ${topic} (${name})`,
      text: [
        `New message from the ${practice} website. Reply to this email to answer ${name} directly.`,
        "",
        `Name:  ${name}`,
        `Email: ${email}`,
        `Phone: ${phone?.ok ? phone.display : "not given"}`,
        `Topic: ${topic}`,
        "",
        message,
        "",
        "—",
        "Sent by the website contact form. The website does not keep a copy of this message.",
      ].join("\n"),
    });
  } catch {
    return json({ ok: false, error: "send_failed" }, 502);
  }
  return json({ ok: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/contact") {
      return request.method === "POST" ? handleContact(request, env) : json({ ok: false }, 405);
    }
    return env.ASSETS.fetch(request);
  },
};
