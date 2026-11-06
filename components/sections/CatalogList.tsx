"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { ServiceCategory } from "@/config/types";
import { cx, withBase } from "@/lib/format";

/**
 * "Everything we offer" under the service cards, for practices with a full catalog: every service by
 * group, each a link to its own page. Bigger screens show all groups side by side; phones fold each
 * group behind its name so the list doesn't add screens of scrolling.
 */
export function CatalogList({ categories }: { categories: ServiceCategory[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const total = categories.reduce((n, c) => n + c.services.length, 0);
  return (
    <div className="glass mt-8 rounded-[28px] p-5 sm:mt-10 sm:p-8" data-reveal>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-1">
        <h3 className="text-2xl text-ink sm:text-[1.75rem]">Everything we offer</h3>
        <a href={withBase("/services/")} className="inline-flex items-center gap-1 text-[0.95rem] font-bold text-accent">
          All {total} services <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
      <div className="mt-4 grid sm:mt-6 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-7 lg:grid-cols-3">
        {categories.map((c) => {
          const isOpen = open === c.id;
          return (
            <section key={c.id} aria-labelledby={`cat-${c.id}`} className="border-t border-ink/10 first:border-t-0 sm:border-t-0">
              <h4 id={`cat-${c.id}`} className="font-sans">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : c.id)}
                  aria-expanded={isOpen}
                  aria-controls={`cat-list-${c.id}`}
                  className="flex min-h-12 w-full items-center justify-between gap-3 px-1 text-left text-[1.05rem] font-bold text-ink sm:pointer-events-none sm:min-h-0"
                >
                  <span>
                    {c.name} <span className="font-semibold text-muted">· {c.services.length}</span>
                  </span>
                  <ChevronDown size={18} aria-hidden="true" className={cx("shrink-0 text-muted transition-transform sm:hidden", isOpen && "rotate-180")} />
                </button>
              </h4>
              <div
                id={`cat-list-${c.id}`}
                className={cx(
                  "grid transition-[grid-template-rows,opacity] duration-400 ease-[var(--ease-soft)] motion-reduce:transition-none sm:grid-rows-[1fr] sm:opacity-100",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <ul className="min-h-0 overflow-hidden">
                  {c.services.map((s) => (
                    <li key={s.id}>
                      <a href={withBase(`/services/${s.id}/`)} className="group flex min-h-10 items-center justify-between gap-2 rounded-lg px-1 text-[0.975rem] text-muted hover:text-ink">
                        {s.name}
                        <ArrowRight size={14} aria-hidden="true" className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                  <li className="h-2 sm:hidden" aria-hidden="true" />
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
