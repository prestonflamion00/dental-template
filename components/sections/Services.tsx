"use client";

import { useCallback, useState } from "react";
import { ArrowRight, Check, MessageCircleQuestion } from "lucide-react";
import type { Service } from "@/config/types";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { BookButton } from "@/components/booking/BookButton";

export function ServicesGrid({ services, phone }: { services: Service[]; phone: string }) {
  const [active, setActive] = useState<Service | null>(null);
  const close = useCallback(() => setActive(null), []);

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
        {services.map((s, i) => (
          <li
            key={s.id}
            id={`service-${s.id}`}
            className="glass glass-hover group relative flex gap-4 rounded-[24px] p-5 sm:flex-col sm:gap-0 sm:p-6"
            data-reveal
            style={{ ["--d" as string]: `${(i % 4) * 60}ms` }}
          >
            <span className="icon-tile shrink-0" aria-hidden="true">
              <Icon name={s.icon} size={24} />
            </span>
            <div className="flex flex-1 flex-col">
            <h3 className="font-sans text-[1.15rem] font-bold leading-snug tracking-tight text-ink sm:mt-5">{s.name}</h3>
            <p className="mt-1.5 flex-1 text-[0.975rem] leading-relaxed text-muted sm:mt-2">{s.short}</p>
            <button
              type="button"
              onClick={() => setActive(s)}
              aria-haspopup="dialog"
              className="mt-2 inline-flex min-h-11 items-center gap-1.5 self-start sm:mt-5 rounded-full text-[0.95rem] font-bold text-accent after:absolute after:inset-0 after:rounded-[24px] after:content-['']"
            >
              Learn more<span className="sr-only"> about {s.name}</span>
              <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
            </button>
            </div>
          </li>
        ))}
        {/* Helper card fills the grid and catches undecided visitors. */}
        <li
          className="relative flex flex-col justify-between rounded-[24px] bg-gradient-to-br from-accent to-accent-2 p-6 text-white shadow-xl"
          data-reveal
          style={{ ["--d" as string]: `${(services.length % 4) * 60}ms` }}
        >
          <div>
            <MessageCircleQuestion size={28} aria-hidden="true" />
            <h3 className="mt-5 font-sans text-[1.15rem] font-bold leading-snug">Not sure what you need?</h3>
            <p className="mt-2 text-[0.975rem] leading-relaxed text-white/90">
              Book a regular visit and we’ll figure it out together, or call us at {phone}.
            </p>
          </div>
          <BookButton variant="glass" className="mt-5 self-start !text-ink" icon={false}>
            Book a visit
          </BookButton>
        </li>
      </ul>

      <Modal open={!!active} onClose={close} labelledBy="service-modal-title">
        {active && (
          <div className="p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:p-9">
            <span className="icon-tile" aria-hidden="true">
              <Icon name={active.icon} size={24} />
            </span>
            <h2 id="service-modal-title" className="mt-5 pr-10 text-3xl text-ink sm:text-4xl">
              {active.name}
            </h2>
            <p className="mt-4 text-lg text-muted">{active.detail}</p>
            {active.points && (
              <ul className="mt-6 grid gap-2.5">
                {active.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-ink">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent-soft text-accent" aria-hidden="true">
                      <Check size={14} strokeWidth={2.75} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <BookButton serviceId={active.id}>Book {active.name.length > 24 ? "this visit" : active.name}</BookButton>
            </div>
            <p className="mt-5 text-sm text-muted">Every smile is different. We’ll talk through options and costs before any treatment.</p>
          </div>
        )}
      </Modal>
    </>
  );
}
