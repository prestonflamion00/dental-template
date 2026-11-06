/**
 * Trial (office.experiments.smileLine): the hero's highlighted words get a hand-drawn smile under
 * them and a little tooth with sparkles beside them, drawn in when the page loads, in the practice's
 * accent colour. Pure SVG + CSS (app/globals.css, .smile-line); still for reduced motion.
 */
export function SmileUnderline() {
  return (
    <svg className="smile-line sl-under" viewBox="0 0 200 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="sl-draw sl-1" pathLength={1} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" vectorEffect="non-scaling-stroke"
        d="M4 6 Q2 11 8 12 C60 24 140 24 192 12 Q198 11 196 6" />
    </svg>
  );
}

export function ToothSpark() {
  return (
    <svg className="smile-line sl-tooth" viewBox="0 0 44 40" aria-hidden="true" focusable="false">
      <path className="sl-draw sl-2" pathLength={1} fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round"
        transform="translate(6 8) scale(1.3)"
        d="M7 3c-2.2 0-4 1.8-4 4 0 2 .6 3.6 1.2 5.2.6 1.8 1 3.8 1.3 6 .2 1.4.9 2.8 2.1 2.8 1.2 0 1.8-1.4 2.2-3 .3-1.4.8-2.6 2.2-2.6s1.9 1.2 2.2 2.6c.4 1.6 1 3 2.2 3 1.2 0 1.9-1.4 2.1-2.8.3-2.2.7-4.2 1.3-6C20.4 10.6 21 9 21 7c0-2.2-1.8-4-4-4-1.6 0-2.8.8-5 .8S8.6 3 7 3z" />
      <g fill="#e0a21b">
        <path className="sl-pop sl-3" d="M38 4l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" />
        <path className="sl-pop sl-4" d="M4 2l1 2.6 2.6 1-2.6 1L4 9.2l-1-2.6-2.6-1 2.6-1z" />
        <path className="sl-pop sl-5" d="M40 24l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z" />
      </g>
    </svg>
  );
}
