"use client";

import { useEffect, useId, useState } from "react";
import { Plus } from "lucide-react";
import type { Faq } from "@/config/types";
import { cx } from "@/lib/format";

/** Accessible accordion (WAI-ARIA disclosure pattern): buttons with aria-expanded controlling regions. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  // The first answer starts open on larger screens; on phones every question starts closed.
  const [open, setOpen] = useState<number | null>(0);
  useEffect(() => {
    if (window.matchMedia("(max-width: 639px)").matches) setOpen(null);
  }, []);
  const uid = useId();
  return (
    <div className="glass mx-auto max-w-3xl divide-y divide-ink/10 rounded-[28px] px-2 sm:px-4" data-reveal>
      {faqs.map((f, i) => {
        const isOpen = open === i;
        const btnId = `${uid}-q${i}`;
        const panelId = `${uid}-a${i}`;
        return (
          <div key={f.q}>
            <h3 className="font-sans">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-5 text-left text-[1.075rem] font-semibold text-ink"
              >
                {f.q}
                <span
                  className={cx(
                    "grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent transition-transform duration-300",
                    isOpen && "rotate-45",
                  )}
                  aria-hidden="true"
                >
                  <Plus size={18} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              // Slides open and closed (grid rows 0fr <-> 1fr); `inert` keeps a closed answer out of tab order
              // and screen readers without cutting the closing animation short.
              className={cx(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-[var(--ease-soft)] motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
              inert={!isOpen}
            >
              <div className="overflow-hidden">
                <p className="px-4 pb-6 text-muted">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
