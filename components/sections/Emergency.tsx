import { Navigation, Phone, Siren } from "lucide-react";
import type { OfficeConfig } from "@/config/types";
import { mapsHref, telHref } from "@/lib/format";

/** High-visibility emergency card with one-tap call. */
export function Emergency({ office }: { office: OfficeConfig }) {
  const { copy, contact } = office;
  return (
    <section id="emergency" aria-labelledby="emergency-title" className="px-4 py-10 sm:px-6 sm:py-14">
      <div
        className="glass mx-auto flex max-w-6xl flex-col gap-6 overflow-hidden rounded-[28px] p-6 sm:p-9 lg:flex-row lg:items-center lg:justify-between"
        data-reveal
      >
        <div className="flex gap-5">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-danger text-white shadow-lg" aria-hidden="true">
            <Siren size={26} />
          </span>
          <div>
            <h2 id="emergency-title" className="text-[1.85rem] text-ink sm:text-[2.25rem]">
              {copy.emergencyHeadline}
            </h2>
            <p className="mt-2 max-w-xl text-muted">{copy.emergencyText}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <a href={telHref(contact.phone)} className="btn btn-lg bg-danger text-white shadow-lg hover:brightness-110">
            <Phone size={18} aria-hidden="true" />
            Call {contact.phone}
          </a>
          <a href={mapsHref(contact.address)} target="_blank" rel="noopener noreferrer" className="btn btn-glass btn-lg">
            <Navigation size={18} aria-hidden="true" className="text-accent" />
            Directions<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
