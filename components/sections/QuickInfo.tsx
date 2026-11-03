import { Clock, MapPin, Phone } from "lucide-react";
import { SampleTag } from "@/components/ui/SampleTag";
import type { OfficeConfig } from "@/config/types";
import { mapsHref, telHref } from "@/lib/format";
import { OpenBadge } from "./OpenStatus";

/** Glass "at a glance" card: live open/closed status, address and phone (one column per office when there are several). */
export function QuickInfo({ office }: { office: OfficeConfig }) {
  if (office.locations.length > 1) return <QuickInfoLocations office={office} />;
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
            <h2 className="mb-1.5 font-sans text-sm font-bold uppercase tracking-[0.12em] text-muted">
              Today’s hours
              <SampleTag office={office} what="hours" />
            </h2>
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
            {office.copy.phoneNote && <p className="text-[0.95rem] text-muted">{office.copy.phoneNote}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Several offices: one column each, with that office's open status, address and phone. */
function QuickInfoLocations({ office }: { office: OfficeConfig }) {
  const cols = office.locations.length >= 3 ? "lg:grid-cols-3" : "sm:grid-cols-2";
  return (
    <section aria-label="Our offices at a glance" className="relative z-10 px-4 sm:px-6">
      <div className={`glass mx-auto grid max-w-6xl gap-6 rounded-[28px] p-6 sm:p-7 ${cols} sm:gap-0 sm:divide-x sm:divide-ink/10`} data-reveal>
        {office.locations.map((l, i) => (
          <div key={l.name} className={i === 0 ? "flex gap-4 sm:pr-6" : "flex gap-4 sm:px-6"}>
            <span className="icon-tile shrink-0" aria-hidden="true">
              <MapPin size={22} />
            </span>
            <div className="min-w-0">
              <h2 className="mb-1.5 font-sans text-sm font-bold uppercase tracking-[0.12em] text-muted">
                {l.name}
                {i === 0 && <SampleTag office={office} what="hours" />}
              </h2>
              <OpenBadge timezone={office.timezone} hours={l.hours} />
              <a
                href={mapsHref(l.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block font-semibold leading-snug text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-accent"
              >
                {l.address.street}, {l.address.city}
                <span className="sr-only"> (open in maps, new tab)</span>
              </a>
              <a href={telHref(l.phone)} className="mt-1 inline-flex items-center gap-2 font-semibold text-ink hover:text-accent">
                <Phone size={16} aria-hidden="true" className="text-accent" />
                {l.phone}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
