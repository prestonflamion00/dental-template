"use client";

/**
 * Side-by-side demo of the three ways a third-party scheduler goes on a site: link, pop-up, inline.
 * Uses Cal.com's embed script. Practice-run only: real practices use their own booking vendor.
 */

import { useEffect } from "react";

declare global {
  interface Window {
    Cal?: ((...args: unknown[]) => void) & { ns: Record<string, (...args: unknown[]) => void>; loaded?: boolean; q?: unknown[] };
  }
}

const NAMESPACE = "schedulerdemo";

/** Cal.com's documented loader: queues calls until embed.js has loaded. */
function loadCal() {
  if (window.Cal) return;
  (function (C: Window & typeof globalThis, A: string, L: string) {
    const p = (a: { q: unknown[] }, ar: unknown) => a.q.push(ar);
    const d = C.document;
    const cal = function (this: unknown, ...ar: unknown[]) {
      const c = C.Cal as unknown as { loaded?: boolean; ns: Record<string, unknown>; q: unknown[] };
      if (!c.loaded) {
        c.ns = {};
        c.q = c.q || [];
        d.head.appendChild(d.createElement("script")).src = A;
        c.loaded = true;
      }
      if (ar[0] === L) {
        const api = function (...args: unknown[]) {
          p(api as unknown as { q: unknown[] }, args);
        } as unknown as { q: unknown[] };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === "string") {
          c.ns[namespace] = c.ns[namespace] || api;
          p(c.ns[namespace] as { q: unknown[] }, ar);
          p(c, ["initNamespace", namespace]);
        } else p(c, ar);
        return;
      }
      p(c, ar);
    };
    C.Cal = cal as unknown as Window["Cal"];
  })(window, "https://app.cal.com/embed/embed.js", "init");
}

export function SchedulerDemo({ calLink }: { calLink: string }) {
  useEffect(() => {
    loadCal();
    window.Cal!("init", NAMESPACE, { origin: "https://app.cal.com" });
    window.Cal!.ns[NAMESPACE]("inline", { elementOrSelector: "#scheduler-inline", calLink, config: { layout: "month_view" } });
    window.Cal!.ns[NAMESPACE]("ui", { hideEventTypeDetails: false, layout: "month_view" });
  }, [calLink]);

  return (
    <>
      <h2>1. Link</h2>
      <p>The simplest option. The button opens the scheduler in a new tab, so the patient leaves the practice’s site.</p>
      <p>
        <a className="btn btn-primary" href={`https://cal.com/${calLink}`} target="_blank" rel="noopener noreferrer">
          Book online (opens new tab)
        </a>
      </p>

      <h2>2. Pop-up</h2>
      <p>The scheduler opens on top of the page. The patient stays on the site and closes it when done.</p>
      <p>
        <button
          type="button"
          className="btn btn-primary"
          data-cal-link={calLink}
          data-cal-namespace={NAMESPACE}
          data-cal-config='{"layout":"month_view"}'
        >
          Book online (pop-up)
        </button>
      </p>

      <h2>3. Embedded</h2>
      <p>The calendar sits right in the page, for example on a “Book online” page.</p>
      <div id="scheduler-inline" className="mt-4 min-h-[600px] overflow-hidden rounded-2xl border border-ink/10 bg-white" />
    </>
  );
}
