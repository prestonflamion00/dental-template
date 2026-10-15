import { Phone } from "lucide-react";
import type { OfficeConfig } from "@/config/types";
import { Logo } from "@/components/ui/Logo";
import { SocialIcon } from "@/components/ui/Icon";
import { compactHours } from "@/lib/hours";
import { mapsHref, telHref, withBase } from "@/lib/format";

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  google: "Google reviews",
  youtube: "YouTube",
  tiktok: "TikTok",
  yelp: "Yelp",
};

export function Footer({ office }: { office: OfficeConfig }) {
  const { practice, contact, social, hours } = office;
  const a = contact.address;
  const year = new Date().getFullYear();
  return (
    <footer className="px-3 pb-6 pt-10 sm:px-5">
      <div className="glass mx-auto max-w-6xl rounded-[32px] p-7 sm:p-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_0.8fr]">
          <div>
            <Logo practice={practice} />
            <p className="mt-4 max-w-xs text-[0.95rem] text-muted">{practice.tagline}.</p>
            {Object.keys(social).length > 0 && (
              <ul className="mt-5 flex gap-2" aria-label="Social media">
                {Object.entries(social).map(([k, href]) => (
                  <li key={k}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid size-11 place-items-center rounded-full bg-white/70 text-ink transition hover:bg-white hover:text-accent"
                      aria-label={`${practice.name} on ${SOCIAL_LABELS[k] ?? k} (opens in a new tab)`}
                    >
                      <SocialIcon name={k} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="font-sans text-sm font-bold uppercase tracking-[0.12em] text-muted">Visit</h2>
            <address className="mt-3 not-italic text-ink">
              <a href={mapsHref(a)} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                {a.street}
                <br />
                {a.city}, {a.region} {a.postalCode}
                <span className="sr-only"> (opens in maps, new tab)</span>
              </a>
              <br />
              <a href={telHref(contact.phone)} className="mt-3 inline-flex items-center gap-2 font-semibold hover:text-accent">
                <Phone size={16} aria-hidden="true" className="text-accent" />
                {contact.phone}
              </a>
              <br />
              <a href={`mailto:${contact.email}`} className="[overflow-wrap:anywhere] hover:text-accent">
                {contact.email}
              </a>
            </address>
          </div>

          <div>
            <h2 className="font-sans text-sm font-bold uppercase tracking-[0.12em] text-muted">Hours</h2>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.95rem]">
              {compactHours(hours).map((h) => (
                <div key={h.label} className="contents">
                  <dt className="text-muted">{h.label}</dt>
                  <dd className="text-ink">{h.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-sans text-sm font-bold uppercase tracking-[0.12em] text-muted">Info</h2>
            <ul className="mt-3 grid gap-1.5 text-ink">
              <li><a href={withBase("/privacy")} className="inline-block py-1 hover:text-accent">Privacy policy</a></li>
              <li><a href={withBase("/accessibility")} className="inline-block py-1 hover:text-accent">Accessibility</a></li>
              <li><a href={withBase("/#contact")} className="inline-block py-1 hover:text-accent">Contact</a></li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-ink/10 pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {practice.name}. All rights reserved.</p>
          <p>The information on this site is general and not a substitute for professional dental advice.</p>
        </div>
      </div>
    </footer>
  );
}
