"use client";

import { Children, useId, useState } from "react";
import { cx } from "@/lib/format";

/** Practices with several offices: one tab per office, showing that office's card (Contact.tsx). */
export function OfficeTabs({ names, children }: { names: string[]; children: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const uid = useId();
  const panels = Children.toArray(children);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === "ArrowRight" ? (i + 1) % names.length : e.key === "ArrowLeft" ? (i - 1 + names.length) % names.length : -1;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    document.getElementById(`${uid}-tab-${next}`)?.focus();
  };
  return (
    <div>
      <div role="tablist" aria-label="Choose an office" className="mx-auto mb-5 flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-full bg-ink/5 p-1">
        {names.map((n, i) => (
          <button
            key={n}
            id={`${uid}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-controls={`${uid}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={cx("min-h-11 rounded-full px-5 font-semibold transition", active === i ? "bg-ink text-bg" : "text-ink hover:bg-ink/10")}
          >
            {n}
          </button>
        ))}
      </div>
      {panels.map((p, i) => (
        <div key={names[i]} id={`${uid}-panel-${i}`} role="tabpanel" aria-labelledby={`${uid}-tab-${i}`} hidden={active !== i}>
          {p}
        </div>
      ))}
    </div>
  );
}
