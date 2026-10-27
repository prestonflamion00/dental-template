/**
 * Butterbite's own contact form: POST /api/contact emails the request to us, with reply-to set to
 * the dentist. Stores nothing. Everything else is the static site in public/.
 * Runtime variables (set in Cloudflare, kept across deploys): CONTACT_TO (a verified Email Routing
 * destination) and CONTACT_FROM (a sender on a domain with Email Routing enabled).
 */

interface SendEmail {
  send(message: {
    to: string;
    from: { email: string; name: string };
    replyTo: { email: string; name: string };
    subject: string;
    text: string;
  }): Promise<void>;
}

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  EMAIL: SendEmail;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

const LIMITS = { name: 100, practice: 150, email: 200, phone: 30, note: 2000 };
/** Submissions faster than this after the page loaded are almost certainly bots. */
const MIN_FILL_MS = 2500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

  // Bot traps: a hidden field people never fill, and a minimum time on the page. Pretend success.
  const startedAt = Number(body.startedAt);
  if (clean(body.company, 100) || !startedAt || Date.now() - startedAt < MIN_FILL_MS) return json({ ok: true });

  const name = clean(body.name, LIMITS.name);
  const practice = clean(body.practice, LIMITS.practice);
  const email = clean(body.email, LIMITS.email);
  const phone = clean(body.phone, LIMITS.phone);
  const note = typeof body.note === "string" ? body.note.trim().slice(0, LIMITS.note) : "";
  if (name.length < 2 || practice.length < 2 || !EMAIL_RE.test(email)) return json({ ok: false, error: "invalid" }, 400);

  try {
    await env.EMAIL.send({
      to: env.CONTACT_TO,
      from: { email: env.CONTACT_FROM, name: "butterbite digital website" },
      replyTo: { email, name },
      subject: `Free demo request: ${practice} (${name})`,
      text: [
        `${name} from ${practice} asked for a free demo. Reply to this email to answer them directly.`,
        "",
        `Name:     ${name}`,
        `Practice: ${practice}`,
        `Email:    ${email}`,
        `Phone:    ${phone || "not given"}`,
        "",
        note || "(No message.)",
        "",
        "—",
        "Sent by the butterbite digital website. The website does not keep a copy of this message.",
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
      if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
      return handleContact(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
