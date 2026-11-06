"use client";

import { useEffect, useState } from "react";

/*
 * The hero's pen underline (on by default; `experiments.smileLine: false` turns it off for a
 * practice): a hand-drawn line that draws itself under the headline's highlighted words, in a muted
 * ink version of the accent colour. Styles: app/globals.css, "Hero pen underline". Still for reduced motion.
 */
export function HighlightSwoosh() {
  return (
    <svg className="hf-art hf-under" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="hf-draw" pathLength={1} fill="none" stroke="currentColor" strokeWidth={4.5} strokeLinecap="round" d="M3 13 C40 6 80 5 120 7 S178 12 197 8" />
    </svg>
  );
}

/**
 * Phones: how much room the hero has to spare above and below its content (0 when there isn't
 * enough, or on bigger screens), so something (the hero photo) can fill it without pushing the
 * buttons down. Sets `attr` on the hero while it's in use.
 */
export function useSpareHeight(ref: React.RefObject<HTMLElement | null>, min: number, max: number, attr: string) {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const fit = () => {
      const hero = document.getElementById("top");
      const main = hero?.querySelector<HTMLElement>(".hero-main");
      const cue = hero?.querySelector<HTMLElement>(".hero-cue");
      if (!hero || !main || window.innerWidth >= 640) return setHeight(0);
      const mine = ref.current?.offsetHeight ?? 0;
      const free = hero.clientHeight - (main.offsetHeight - mine) - (cue?.offsetHeight ?? 0) - 40;
      setHeight(free >= min ? Math.min(max, free - 20) : 0);
    };
    fit();
    document.fonts?.ready.then(fit); // the headline's height settles once its font loads
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [ref, min, max]);
  useEffect(() => {
    document.getElementById("top")?.toggleAttribute(attr, height > 0);
  }, [height, attr]);
  return height;
}
