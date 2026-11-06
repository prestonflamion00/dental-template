"use client";

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
