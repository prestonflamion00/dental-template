import { Mail, MapPin, Navigation, Phone } from "lucide-react";
import { SampleTag } from "@/components/ui/SampleTag";
import type { Location, OfficeConfig } from "@/config/types";
import { Section } from "@/components/ui/Section";
import { fullAddress, mapsHref, telHref } from "@/lib/format";
import { HoursTable } from "./OpenStatus";
import { OfficeTabs } from "./OfficeTabs";

/**
 * Illustrated map placeholder (no API key, no third-party requests).
 * INTEGRATION POINT: swap for a lazy Google Maps / OpenStreetMap iframe — see lib/integrations.ts §4.
 */
function MapPlaceholder({ name, location }: { name: string; location: Location }) {
  const a = location.address;
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] bg-accent-soft">
      <svg viewBox="0 0 400 250" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="250" fill="var(--bg-2)" />
        <path d="M-10 70 Q120 40 210 95 T420 80" stroke="#fff" strokeWidth="14" fill="none" opacity=".9" />
        <path d="M-10 180 Q160 150 260 190 T420 170" stroke="#fff" strokeWidth="10" fill="none" opacity=".8" />
        <path d="M120 -10 L150 260 M290 -10 L250 260" stroke="#fff" strokeWidth="9" opacity=".85" />
        <path d="M30 -10 L60 260 M360 -10 L340 260" stroke="#fff" strokeWidth="5" opacity=".6" />
        <circle cx="330" cy="40" r="34" fill="var(--orb-3)" opacity=".7" />
        <circle cx="60" cy="215" r="44" fill="var(--orb-2)" opacity=".7" />
        <rect x="170" y="115" width="60" height="40" rx="8" fill="var(--orb-1)" opacity=".55" />
      </svg>
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-full" aria-hidden="true">
        <span className="grid size-14 place-items-center rounded-full rounded-br-none bg-accent text-white shadow-xl rotate-45">
          <MapPin size={24} className="-rotate-45" />
        </span>
      </div>
      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-2xl bg-white/90 p-3 pl-4 shadow-lg sm:inset-x-4 sm:bottom-4">
        <p className="text-sm leading-snug text-ink">
          <strong className="block">{name}</strong>
          {a.street}
        </p>
        <a href={mapsHref(a)} target="_blank" rel="noopener noreferrer" className="btn btn-primary !min-h-11 shrink-0 !px-4 text-sm">
          <Navigation size={16} aria-hidden="true" />
          Directions<span className="sr-only"> to {fullAddress(a)} (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}

/** Map, full weekly hours and ways to reach each office. The form lives higher up (RequestSection). */
export function Contact({ office }: { office: OfficeConfig }) {
  const several = office.locations.length > 1;
  return (
    <Section
      id="contact"
      eyebrow={several ? "Our offices" : "Contact & location"}
      title={several ? `${office.locations.length} offices, one friendly team` : "Come say hello"}
      intro={office.copy.contactIntro}
    >
      {several ? (
        <OfficeTabs names={office.locations.map((l) => l.name)}>
          {office.locations.map((l, i) => (
            <LocationCard key={l.name} office={office} location={l} main={i === 0} several />
          ))}
        </OfficeTabs>
      ) : (
        <LocationCard office={office} location={office.locations[0]} main several={false} />
      )}
    </Section>
  );
}

function LocationCard({ office, location: l, main, several }: { office: OfficeConfig; location: Location; main: boolean; several: boolean }) {
  const { contact } = office;
  // With several offices each card has its own heading, so its labels sit one level lower.
  const Label = several ? "h4" : "h3";
  return (
    <div className="glass grid gap-6 rounded-[28px] p-3 lg:grid-cols-[1.15fr_1fr] lg:items-center" data-reveal>
      {/* Phones skip the illustrated map; the Directions button below does the same job. */}
      <div className="max-sm:hidden">
        <MapPlaceholder name={several ? `${office.practice.logo.text}, ${l.name}` : office.practice.name} location={l} />
      </div>
      <div className="p-4 sm:p-5">
        {several && <h3 className="mb-5 text-2xl text-ink max-sm:sr-only">{l.name}</h3>}
        <div className="grid gap-6 sm:grid-cols-[1.1fr_1fr]">
          <div>
            <Label className="font-sans text-sm font-bold uppercase tracking-[0.12em] text-muted">
              Hours
              {main && <SampleTag office={office} what="hours" />}
            </Label>
            <div className="mt-3">
              <HoursTable timezone={office.timezone} hours={l.hours} />
            </div>
          </div>
          <div>
            <Label className="font-sans text-sm font-bold uppercase tracking-[0.12em] text-muted">Get in touch</Label>
            <ul className="mt-3 grid gap-3">
              <li>
                <a href={telHref(l.phone)} className="flex items-center gap-3 font-semibold text-ink hover:text-accent">
                  <Phone size={18} aria-hidden="true" className="shrink-0 text-accent" />
                  {l.phone}
                </a>
              </li>
              {main && contact.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-3 font-semibold [overflow-wrap:anywhere] text-ink hover:text-accent">
                    <Mail size={18} aria-hidden="true" className="shrink-0 text-accent" />
                    {contact.email}
                  </a>
                </li>
              )}
              <li>
                <a href={mapsHref(l.address)} target="_blank" rel="noopener noreferrer" className="flex gap-3 text-ink hover:text-accent">
                  <MapPin size={18} aria-hidden="true" className="mt-1 shrink-0 text-accent" />
                  <address className="not-italic">
                    {l.address.street}
                    <br />
                    {l.address.city}, {l.address.region} {l.address.postalCode}
                  </address>
                  <span className="sr-only"> (opens in maps, new tab)</span>
                </a>
              </li>
            </ul>
            {l.directionsNote && <p className="mt-4 text-[0.95rem] text-muted">{l.directionsNote}</p>}
            <a href={mapsHref(l.address)} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-5 w-full sm:hidden">
              <Navigation size={16} aria-hidden="true" />
              Directions<span className="sr-only"> to {fullAddress(l.address)} (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
