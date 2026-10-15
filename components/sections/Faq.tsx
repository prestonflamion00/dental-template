"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import type { Faq } from "@/config/types";
import { cx } from "@/lib/format";

/** Accessible accordion (WAI-ARIA disclosure pattern): buttons with aria-expanded controlling regions. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
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
              className={cx("grid transition-[grid-template-rows] duration-300 ease-[var(--ease-soft)]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
              hidden={!isOpen}
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
