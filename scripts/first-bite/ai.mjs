/**
 * AI answers checks for the First Bite score: do ChatGPT and Gemini name the practice when a patient
 * asks for a dentist in its town, and do they describe it correctly?
 *
 * Keys: OPENAI_API_KEY and GEMINI_API_KEY from the environment, or (in a session where they were
 * saved as network secrets) injected by the network proxy, in which case a placeholder is sent and
 * the proxy replaces it. Keys are never printed or logged.
 *
 * ChatGPT answers with web search on (as ChatGPT does for "best dentist near me" questions). Gemini
 * goes through Google's OpenAI-compatible endpoint, which answers from the model alone, without
 * Google Search, so it is a stand-in for Google's AI answers, not AI Mode itself.
 * Answers change from one run to the next; the report keeps each answer so a result can be checked.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

async function post(url, key, body) {
  const argv = ["-sS", "--max-time", "120", "-X", "POST", url, "-H", `Authorization: Bearer ${key || "proxy-injected"}`, "-H", "Content-Type: application/json", "-d", JSON.stringify(body)];
  const { stdout } = await run("curl", argv, { maxBuffer: 10e6 });
  const json = JSON.parse(stdout);
  const err = Array.isArray(json) ? json[0]?.error : json.error;
  if (err) throw new Error(String(err.message ?? err.status ?? "error").slice(0, 160));
  return json;
}

const engines = {
  chatgpt: {
    label: "ChatGPT (with web search)",
    async ask(q) {
      const r = await post("https://api.openai.com/v1/responses", process.env.OPENAI_API_KEY, { model: "gpt-4.1-mini", tools: [{ type: "web_search" }], input: q });
      return r.output_text ?? r.output?.filter((o) => o.type === "message").flatMap((o) => o.content.map((c) => c.text ?? "")).join("\n") ?? "";
    },
  },
  gemini: {
    label: "Gemini (model only, no Google Search)",
    async ask(q) {
      const r = await post("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", process.env.GEMINI_API_KEY, { model: "gemini-flash-latest", messages: [{ role: "user", content: q }] });
      return r.choices?.[0]?.message?.content ?? "";
    },
  },
};

const GENERIC = /\b(family|dental|dentistry|dentist|dentists|dds|dmd|pc|llc|inc|the|of|and|&|center|care|group|associates|clinic|smiles?|orthodontics|pediatric|cosmetic)\b/gi;
/** The distinctive part of a practice name ("Herman Family Dentistry" -> "herman"), used to spot it in an answer. */
export function nameKey(name) {
  const core = name.replace(GENERIC, " ").replace(/[^\p{L}\p{N}\s]/gu, " ").trim().replace(/\s+/g, " ").toLowerCase();
  return core || name.toLowerCase();
}
const digits = (s) => (s ?? "").replace(/\D/g, "").slice(-10);

/**
 * @param {{ name: string, town: string, state: string, siteHost: string, phone?: string, street?: string, accepting?: boolean }} p
 */
export async function aiChecks(p) {
  // A name whose only distinctive word is the town ("Family Orthodontics of Hudson") is matched whole.
  const key = nameKey(p.name) === p.town.toLowerCase() ? p.name.toLowerCase() : nameKey(p.name);
  const named = (text) => text.toLowerCase().includes(key) || text.toLowerCase().includes(p.siteHost);
  const questions = [`What is the best dentist in ${p.town}, ${p.state}? Name your top picks.`, `I need a family dentist in ${p.town}, ${p.state} who is taking new patients. Who do you recommend?`];
  const about = `Tell me about ${p.name} in ${p.town}, ${p.state}. Reply only with JSON: {"known": true|false, "phone": "...", "street": "...", "acceptingNewPatients": true|false|null}.`;

  const out = {};
  for (const [id, e] of Object.entries(engines)) {
    try {
      const answers = [];
      for (const q of questions) answers.push({ q, a: await e.ask(q) });
      // Answers with web search sometimes wrap the JSON in a heading and a code fence, or skip it, so
      // take the {...} that holds "known", and ask once more if there is none.
      const parse = (t) => {
        try {
          return JSON.parse(/\{[^{}]*"known"[^{}]*\}/.exec(t)?.[0] ?? "null");
        } catch {
          return null;
        }
      };
      let facts = parse(await e.ask(about));
      if (!facts) facts = parse(await e.ask(about));
      const right = [];
      if (facts?.known) {
        if (p.phone) right.push(digits(facts.phone) === digits(p.phone));
        // The house number is enough to tell the right building ("608 S Quail Run" = "608 South Quail Run Road").
        if (p.street) right.push(/^\d+/.exec(p.street.trim())?.[0] === /^\s*(\d+)/.exec(facts.street ?? "")?.[1]);
        if (p.accepting != null && facts.acceptingNewPatients != null) right.push(facts.acceptingNewPatients === p.accepting);
      }
      out[id] = {
        label: e.label,
        named: answers.map((x) => named(x.a)),
        accuracy: facts?.known ? (right.length ? right.filter(Boolean).length / right.length : null) : 0,
        facts,
        answers,
      };
    } catch (err) {
      out[id] = { label: e.label, error: String(err.message) };
    }
  }
  return out;
}
