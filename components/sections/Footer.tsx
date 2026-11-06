import { Phone } from "lucide-react";
import type { OfficeConfig } from "@/config/types";
import { Logo } from "@/components/ui/Logo";
import { SocialIcon } from "@/components/ui/Icon";
import { cx, telHref, withBase } from "@/lib/format";

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  google: "Google reviews",
  youtube: "YouTube",
  tiktok: "TikTok",
  yelp: "Yelp",
};

/**
 * `showContact`: off on the home page, where the contact section right above already has the phone,
 * hours and directions; on for the privacy and accessibility pages.
 */
export function Footer({ office, showContact = true }: { office: OfficeConfig; showContact?: boolean }) {
  const { practice, contact, social } = office;
  const year = new Date().getFullYear();
  return (
    <footer className="px-3 pb-6 pt-10 sm:px-5">
      <div className="glass mx-auto max-w-6xl rounded-[32px] p-7 sm:p-10">
        <div className={cx("grid gap-8 md:grid-cols-2", showContact && "lg:grid-cols-[1.4fr_1fr_0.8fr]")}>
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

          {showContact && (
            <div>
              <h2 className="font-sans text-sm font-bold uppercase tracking-[0.12em] text-muted">Get in touch</h2>
              <ul className="mt-3 grid gap-1.5 text-ink">
                <li>
                  <a href={telHref(contact.phone)} className="inline-flex items-center gap-2 py-1 font-semibold hover:text-accent">
                    <Phone size={16} aria-hidden="true" className="text-accent" />
                    {contact.phone}
                  </a>
                </li>
                {contact.email && (
                  <li>
                    <a href={`mailto:${contact.email}`} className="inline-block py-1 [overflow-wrap:anywhere] hover:text-accent">
                      {contact.email}
                    </a>
                  </li>
                )}
                <li>
                  <a href={withBase("/#contact")} className="inline-block py-1 hover:text-accent">
                    Hours &amp; directions
                  </a>
                </li>
              </ul>
            </div>
          )}

          <nav aria-label="Footer">
            <h2 className="font-sans text-sm font-bold uppercase tracking-[0.12em] text-muted">Info</h2>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-ink md:grid">
              {/* The practice's extra pages, when it has them. */}
              {office.catalog && <li><a href={withBase("/services/")} className="inline-block py-1 hover:text-accent">All services</a></li>}
              {office.staff?.length ? <li><a href={withBase("/team/")} className="inline-block py-1 hover:text-accent">Our team</a></li> : null}
              {office.billing && <li><a href={withBase("/billing/")} className="inline-block py-1 hover:text-accent">Payments &amp; financing</a></li>}
              {office.careers && <li><a href={withBase("/careers/")} className="inline-block py-1 hover:text-accent">Careers</a></li>}
              <li><a href={withBase("/privacy")} className="inline-block py-1 hover:text-accent">Privacy policy</a></li>
              <li><a href={withBase("/accessibility")} className="inline-block py-1 hover:text-accent">Accessibility</a></li>
            </ul>
            {office.areas?.length ? (
              <p className="mt-4 text-[0.95rem] text-muted">
                Serving{" "}
                {office.areas.map((a, i) => (
                  <span key={a.slug}>
                    {i > 0 && (i === office.areas!.length - 1 ? " and " : ", ")}
                    <a href={withBase(`/areas/${a.slug}/`)} className="text-ink underline decoration-ink/20 underline-offset-4 hover:text-accent">
                      {a.town}, {a.region}
                    </a>
                  </span>
                ))}
              </p>
            ) : null}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-ink/10 pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {practice.name}. All rights reserved.</p>
          <p>The information on this site is general and not a substitute for professional dental advice.</p>
        </div>
        {office.stage === "demo" && !office.fictional && (
          <p className="mt-4 text-sm text-muted">
            This is a private sample design made for {practice.name} by butterbite digital, using public business
            information and images. It isn’t affiliated with or endorsed by the practice and isn’t listed on search
            engines. Want it taken down? Email hello@butterbitedigital.com.
          </p>
        )}
      </div>
    </footer>
  );
}
