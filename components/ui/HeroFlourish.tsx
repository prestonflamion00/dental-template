"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";

/*
 * "Wow" trial for the hero (branch claude/wow-mockup):
 *   HighlightSwoosh  #1  a hand-drawn underline that draws itself under the highlighted words
 *   ReviewTicker     #2  short patient quotes that rotate under the buttons
 *   MadeForYou       #6  demos of real practices: a brief "Built for Dr. …" moment on arrival
 * The living background (#3) is CSS only: app/globals.css, "Hero flourish".
 */

export function HighlightSwoosh() {
  return (
    <svg className="fl-swoosh" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth={6}
        strokeLinecap="round"
        d="M3 13 C40 6 80 5 120 7 S178 12 197 8"
      />
    </svg>
  );
}

type Quote = { text: string; name: string };

/** First sentence (ignoring "Dr." and the like), or the first ~90 characters cut at a word. */
function short(text: string) {
  const re = /[.!?](?=\s|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const before = text.slice(0, m.index + 1);
    if (/\b(Dr|Mr|Mrs|Ms|St|Jr|Sr)\.$/.test(before) || before.length < 20) continue;
    if (before.length <= 90) return before;
    break;
  }
  if (text.length <= 90) return text;
  return text.slice(0, 88).replace(/\s+\S*$/, "") + "…";
}

export function ReviewTicker({ quotes, href }: { quotes: Quote[]; href?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (quotes.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % quotes.length), 5200);
    return () => clearInterval(id);
  }, [quotes.length]);
  if (!quotes.length) return null;
  const q = quotes[i];
  return (
    <a href={href} className="fl-ticker mt-5 block max-w-lg rounded-2xl text-[0.95rem] text-muted sm:mt-6" aria-label="Patient reviews">
      <span key={i} className="fl-quote block">
        <span className="mr-1.5 tracking-[0.12em] text-[#e0a21b]" aria-hidden="true">★★★★★</span>
        <span className="text-ink">“{short(q.text)}”</span> <span className="whitespace-nowrap">— {q.name}</span>
      </span>
    </a>
  );
}

export function MadeForYou({ who }: { who: string }) {
  const [state, setState] = useState<"hidden" | "in" | "out">("hidden");
  useEffect(() => {
    const a = setTimeout(() => setState("in"), 700);
    const b = setTimeout(() => setState("out"), 5200);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);
  if (state === "hidden") return null;
  return (
    <div className={`fl-toast glass-strong ${state === "out" ? "is-out" : ""}`} role="status">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent" aria-hidden="true">
        <Sparkles size={18} />
      </span>
      <span className="min-w-0">
        <strong className="block truncate text-[0.95rem] text-ink">Built for {who}</strong>
        <span className="block truncate text-xs text-muted">Your new website, by butterbite digital</span>
      </span>
      <button type="button" onClick={() => setState("out")} className="ml-1 grid size-9 shrink-0 place-items-center rounded-full text-muted hover:bg-white/80" aria-label="Close">
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
