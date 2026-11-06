"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, X } from "lucide-react";

/*
 * Optional "wow" touches for the hero, each switched on per practice in its config (`experiments`):
 *   smileLine         a hand-drawn smile under the highlighted words and a tooth with sparkles beside
 *                     them; on taller phones with room to spare, a big tooth scene fills that space
 *   quotes            short patient quotes rotating under the buttons (sample quotes on demos)
 *   livingBackground  the hero's colour blobs drift slowly under a fine paper grain (CSS only)
 *   greeting          demos of real practices: a brief "Built for Dr. …" note on arrival
 * Styles: app/globals.css, "Hero flourishes". Everything stays still for reduced motion.
 */

const TOOTH =
  "M7 3c-2.2 0-4 1.8-4 4 0 2 .6 3.6 1.2 5.2.6 1.8 1 3.8 1.3 6 .2 1.4.9 2.8 2.1 2.8 1.2 0 1.8-1.4 2.2-3 .3-1.4.8-2.6 2.2-2.6s1.9 1.2 2.2 2.6c.4 1.6 1 3 2.2 3 1.2 0 1.9-1.4 2.1-2.8.3-2.2.7-4.2 1.3-6C20.4 10.6 21 9 21 7c0-2.2-1.8-4-4-4-1.6 0-2.8.8-5 .8S8.6 3 7 3z";
const spark = (x: number, y: number, r: number) =>
  `M${x} ${y - r}l${r * 0.27} ${r * 0.73} ${r * 0.73} ${r * 0.27}-${r * 0.73} ${r * 0.27}-${r * 0.27} ${r * 0.73}-${r * 0.27}-${r * 0.73}-${r * 0.73}-${r * 0.27} ${r * 0.73}-${r * 0.27}z`;

/** The smile drawn under the highlighted words. */
export function SmileUnderline() {
  return (
    <svg className="hf-art hf-under" viewBox="0 0 200 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="hf-draw" pathLength={1} fill="none" stroke="currentColor" strokeWidth={5} strokeLinecap="round" d="M4 6 Q2 11 8 12 C60 24 140 24 192 12 Q198 11 196 6" />
    </svg>
  );
}

/** The small tooth with sparkles beside the highlighted words. */
export function ToothSpark() {
  return (
    <svg className="hf-art hf-tooth" viewBox="0 0 44 40" aria-hidden="true" focusable="false">
      <path className="hf-draw hf-d2" pathLength={1} fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" transform="translate(6 8) scale(1.3)" d={TOOTH} />
      <g fill="#e0a21b">
        <path className="hf-pop hf-p1" d={spark(38, 9.5, 5.5)} />
        <path className="hf-pop hf-p2" d={spark(4, 5.6, 3.6)} />
        <path className="hf-pop hf-p3" d={spark(40, 27.2, 3.2)} />
      </g>
    </svg>
  );
}

/**
 * Taller phones only: when the hero has room to spare above and below its content, a bigger tooth
 * scene fills it (and the small tooth beside the headline steps aside). Measured, so it appears only
 * where it fits and never pushes the buttons off the first screen.
 */
export function SmileScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const fit = () => {
      const hero = document.getElementById("top");
      const main = hero?.querySelector<HTMLElement>(".hero-main");
      const cue = hero?.querySelector<HTMLElement>(".hero-cue");
      if (!hero || !main || window.innerWidth >= 640) return setHeight(0);
      const mine = ref.current?.offsetHeight ?? 0;
      const free = hero.clientHeight - (main.offsetHeight - mine) - (cue?.offsetHeight ?? 0) - 40;
      setHeight(free >= 96 ? Math.min(150, free - 24) : 0);
    };
    fit();
    document.fonts?.ready.then(fit); // the headline's height settles once its font loads
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  useEffect(() => {
    document.getElementById("top")?.toggleAttribute("data-scene", height > 0);
  }, [height]);
  return (
    <div ref={ref} className="hf-scene" style={{ height: height || undefined }} aria-hidden="true" hidden={!height}>
      {height > 0 && (
        <svg viewBox="0 0 200 120" className="hf-art-inline">
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* A soft halo arc, then the tooth (the site's tooth mark, enlarged). */}
            <path className="hf-draw" pathLength={1} strokeWidth={1.6} d="M36 92 C40 34 160 34 164 92" opacity={0.45} />
            <path className="hf-draw hf-d2" pathLength={1} strokeWidth={0.9} transform="translate(70 24) scale(2.5)" d={TOOTH} />
          </g>
          <g fill="#e0a21b">
            <path className="hf-pop hf-p1" d={spark(148, 28, 8)} />
            <path className="hf-pop hf-p2" d={spark(54, 36, 5)} />
            <path className="hf-pop hf-p3" d={spark(158, 66, 4.5)} />
            <path className="hf-pop hf-p2" d={spark(44, 76, 3.5)} />
          </g>
        </svg>
      )}
    </div>
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

/** Short patient quotes, one at a time, every few seconds. Tapping goes to the reviews. */
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
    <a href={href} className="mt-5 block max-w-lg rounded-2xl text-[0.95rem] text-muted sm:mt-6" aria-label="Patient reviews">
      <span key={i} className="hf-quote block">
        <span className="mr-1.5 tracking-[0.12em] text-[#e0a21b]" aria-hidden="true">
          ★★★★★
        </span>
        <span className="text-ink">“{short(q.text)}”</span> <span className="whitespace-nowrap">— {q.name}</span>
      </span>
    </a>
  );
}

/** Private previews: a short note greeting the dentist the site was built for. */
export function MadeForYou({ who }: { who: string }) {
  const [state, setState] = useState<"hidden" | "in" | "out">("hidden");
  useEffect(() => {
    // After the hero's drawings have finished, so it never covers them.
    const a = setTimeout(() => setState("in"), 2600);
    const b = setTimeout(() => setState("out"), 7600);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);
  if (state === "hidden") return null;
  return (
    <div className={`hf-toast glass-strong ${state === "out" ? "is-out" : ""}`} role="status">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent" aria-hidden="true">
        <Sparkles size={18} />
      </span>
      <span className="min-w-0">
        <strong className="block text-[0.95rem] leading-snug text-ink">Built for {who}</strong>
        <span className="block truncate text-xs text-muted">Your new website, by butterbite digital</span>
      </span>
      <button type="button" onClick={() => setState("out")} className="ml-1 grid size-9 shrink-0 place-items-center rounded-full text-muted hover:bg-white/80" aria-label="Close">
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
