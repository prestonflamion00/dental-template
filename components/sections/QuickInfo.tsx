import { Clock, MapPin, Phone } from "lucide-react";
import type { OfficeConfig } from "@/config/types";
import { mapsHref, telHref } from "@/lib/format";
import { OpenBadge } from "./OpenStatus";

/** Glass "at a glance" card: live open/closed status, address and phone. */
export function QuickInfo({ office }: { office: OfficeConfig }) {
  const { contact } = office;
  const a = contact.address;
  return (
    <section aria-label="Hours and location at a glance" className="relative z-10 px-4 sm:px-6">
      <div className="glass mx-auto grid max-w-6xl gap-6 rounded-[28px] p-6 sm:p-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-ink/10" data-reveal>
        <div className="flex gap-4 lg:pr-6">
          <span className="icon-tile shrink-0" aria-hidden="true">
            <Clock size={22} />
          </span>
          <div>
            <h2 className="mb-1.5 font-sans text-sm font-bold uppercase tracking-[0.12em] text-muted">Today’s hours</h2>
            <OpenBadge timezone={office.timezone} hours={office.hours} />
          </div>
        </div>

        <div className="flex gap-4 lg:px-6">
          <span className="icon-tile shrink-0" aria-hidden="true">
            <MapPin size={22} />
          </span>
          <div>
            <h2 className="mb-1.5 font-sans text-sm font-bold uppercase tracking-[0.12em] text-muted">Visit us</h2>
            <a
              href={mapsHref(a)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold leading-snug text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-accent"
            >
              {a.street}
              <br />
              {a.city}, {a.region} {a.postalCode}
              <span className="sr-only"> (open in maps, new tab)</span>
            </a>
          </div>
        </div>

        <div className="flex gap-4 lg:pl-6">
          <span className="icon-tile shrink-0" aria-hidden="true">
            <Phone size={22} />
          </span>
          <div>
            <h2 className="mb-1.5 font-sans text-sm font-bold uppercase tracking-[0.12em] text-muted">Call or text</h2>
            <a href={telHref(contact.phone)} className="text-xl font-semibold text-ink hover:text-accent">
              {contact.phone}
            </a>
            <p className="text-[0.95rem] text-muted">Same-day emergency visits</p>
          </div>
        </div>
      </div>
    </section>
  );
}
