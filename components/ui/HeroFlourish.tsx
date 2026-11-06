"use client";

import { useEffect, useRef, useState } from "react";

/*
 * The hero's pen drawing (on by default; `experiments.smileLine: false` turns it off for a practice):
 *   HighlightSwoosh  a pen underline that draws itself under the headline's highlighted words
 *   ToothSketch      a small sketched tooth with pen sparkles beside those words
 *   SmileScene       taller phones with room to spare: one pen line drawn across the top of the hero,
 *                    dipping into a smile with a tooth above it (the small tooth then steps aside)
 * After drawing, the sparkles twinkle and the tooth floats, slowly. Thin strokes in a muted ink version
 * of the accent colour. Styles: app/globals.css, "Hero pen drawing". Still for reduced motion.
 */

const TOOTH =
  "M7 3c-2.2 0-4 1.8-4 4 0 2 .6 3.6 1.2 5.2.6 1.8 1 3.8 1.3 6 .2 1.4.9 2.8 2.1 2.8 1.2 0 1.8-1.4 2.2-3 .3-1.4.8-2.6 2.2-2.6s1.9 1.2 2.2 2.6c.4 1.6 1 3 2.2 3 1.2 0 1.9-1.4 2.1-2.8.3-2.2.7-4.2 1.3-6C20.4 10.6 21 9 21 7c0-2.2-1.8-4-4-4-1.6 0-2.8.8-5 .8S8.6 3 7 3z";

/** A pen sparkle: two short crossing strokes. */
function Spark({ x, y, r, i }: { x: number; y: number; r: number; i: number }) {
  return (
    <g className={`hf-spark hf-s${i}`} style={{ transformOrigin: `${x}px ${y}px` }}>
      <path d={`M${x} ${y - r}V${y + r}M${x - r} ${y}H${x + r}`} />
    </g>
  );
}

export function HighlightSwoosh() {
  return (
    <svg className="hf-art hf-under" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="hf-draw" pathLength={1} fill="none" stroke="currentColor" strokeWidth={4.5} strokeLinecap="round" d="M3 13 C40 6 80 5 120 7 S178 12 197 8" />
    </svg>
  );
}

export function ToothSketch() {
  return (
    <svg className="hf-art hf-tooth" viewBox="0 0 44 40" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <g className="hf-float">
          <path className="hf-draw hf-d2" pathLength={1} strokeWidth={0.95} transform="translate(6 8) scale(1.3)" d={TOOTH} />
        </g>
        <g strokeWidth={1.1}>
          {/* Only to the right of the tooth, so none reach the words beside or above it. */}
          <Spark x={42} y={7} r={3} i={1} />
          <Spark x={46} y={25} r={2} i={2} />
        </g>
      </g>
    </svg>
  );
}

/**
 * Taller phones only: when the hero has room to spare, the pen line fills it. Measured, so it shows
 * only where it fits and never pushes the buttons off the first screen. Rendered on every screen size
 * (hidden where there's no room) because the measuring also keeps the small tooth from running off
 * the edge.
 */
/**
 * Phones: how much room the hero has to spare above and below its content (0 when there isn't
 * enough, or on bigger screens), so something can fill it without pushing the buttons down.
 */
export function useSpareHeight(ref: React.RefObject<HTMLElement | null>, min: number, max: number, attr: string) {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const fit = () => {
      const hero = document.getElementById("top");
      // The small tooth beside the words only shows where it fits on the line's screen width.
      const tooth = hero?.querySelector<SVGElement>(".hf-tooth");
      if (tooth) {
        tooth.style.visibility = "";
        tooth.style.visibility = tooth.getBoundingClientRect().right > document.documentElement.clientWidth - 8 ? "hidden" : "";
      }
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

export function SmileScene() {
  const ref = useRef<HTMLDivElement>(null);
  const height = useSpareHeight(ref, 90, 170, "data-scene");
  return (
    <div ref={ref} className="hf-scene" style={{ height: height || undefined }} aria-hidden="true" hidden={!height}>
      {height > 0 && (
        <svg viewBox="0 0 360 120" preserveAspectRatio="xMidYMid meet">
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* One pen line across the page, dipping into a smile in the middle. */}
            <path
              className="hf-draw hf-line"
              pathLength={1}
              strokeWidth={1.5}
              d="M-12 92 C24 90 54 74 98 76 C132 78 136 104 180 104 C224 104 228 78 262 76 C306 74 336 90 372 88"
            />
            <g className="hf-float">
              <path className="hf-draw hf-d2" pathLength={1} strokeWidth={0.75} transform="translate(158 16) scale(1.85)" d={TOOTH} />
            </g>
            <g strokeWidth={1.3}>
              <Spark x={214} y={20} r={5} i={1} />
              <Spark x={146} y={26} r={3.2} i={2} />
              <Spark x={222} y={50} r={2.6} i={3} />
            </g>
          </g>
        </svg>
      )}
    </div>
  );
}
