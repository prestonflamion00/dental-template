import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import office from "@/config/office";
import { BookButton } from "@/components/booking/BookButton";
import { EmergencyButton } from "@/components/ui/EmergencyButton";
import { ContentBlocks, PageShell } from "@/components/ui/PageShell";
import { cx, telHref, withBase } from "@/lib/format";
import { allCategories, findService } from "@/lib/catalog";

/* One page per service (/services/implants/), in the practice's own words, with a way to book and the rest of its group. */

export const dynamicParams = false;

/** The summary is shown as the lead, so trim that same sentence off the start of the first paragraph. */
function withoutLead(body: [string, string][], lead: string): [string, string][] {
  const [first, ...rest] = body;
  if (!first || first[0] !== "p" || !first[1].startsWith(lead)) return body;
  const remainder = first[1].slice(lead.length).trim();
  return remainder ? [["p", remainder], ...rest] : rest;
}

export function generateStaticParams() {
  return allCategories(office).flatMap((c) => c.services.map((s) => ({ slug: s.id })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const found = findService(office, (await params).slug);
  if (!found) return {};
  const a = office.contact.address;
  return {
    title: `${found.service.name} in ${a.city}, ${a.region}`,
    description: found.service.summary,
    alternates: { canonical: `/services/${found.service.id}/` },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const found = findService(office, (await params).slug);
  if (!found) notFound();
  const { service, category } = found;
  const siblings = category.services.filter((s) => s.id !== service.id);
  const grouped = allCategories(office).length > 1;
  return (
    <PageShell>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_320px] lg:gap-14">
        <article>
          <a href={withBase(`/services/${grouped ? `#${category.id}` : ""}`)} className="inline-flex min-h-10 items-center gap-1.5 text-[0.95rem] font-semibold text-muted hover:text-ink">
            <ArrowLeft size={17} aria-hidden="true" /> {grouped ? category.name : "All services"}
          </a>
          <h1 className="mt-3 text-[2.5rem] leading-[1.05] text-ink sm:text-6xl">{service.name}</h1>
          <p className="mt-4 text-xl leading-snug text-ink/80">{service.summary}</p>
          <div className="mt-8">
            <ContentBlocks blocks={withoutLead(service.body, service.summary)} />
          </div>
        </article>

        <aside className="grid content-start gap-5 lg:sticky lg:top-28">
          <div className="glass rounded-[26px] p-6">
            <p className="font-serif text-2xl leading-tight text-ink">Ready when you are</p>
            <p className="mt-2 text-[0.95rem] text-muted">Request a visit online, or call and we’ll help you pick a time.</p>
            <div className="mt-5 grid gap-2.5">
              <BookButton className="w-full" />
              <a href={telHref(office.contact.phone)} className="btn btn-glass w-full">
                <Phone size={17} aria-hidden="true" className="text-accent" /> {office.contact.phone}
              </a>
              {/* An emergency-care page is where someone in pain lands, so it gets the red button too. */}
              {/emergenc/i.test(`${service.id} ${service.name}`) && <EmergencyButton className="w-full" />}
            </div>
          </div>
          {siblings.length > 0 && (
            <nav aria-label={`More ${category.name.toLowerCase()}`} className="glass rounded-[26px] p-5">
              <p className="px-1 font-sans text-sm font-bold uppercase tracking-[0.12em] text-muted">More {grouped ? category.name.toLowerCase() : "services"}</p>
              <ul className="mt-2 grid">
                {siblings.map((s) => (
                  <li key={s.id}>
                    <a href={withBase(`/services/${s.id}/`)} className={cx("group flex min-h-11 items-center justify-between gap-3 rounded-xl px-2 font-semibold text-ink hover:bg-white/70")}>
                      {s.name}
                      <ArrowRight size={15} aria-hidden="true" className="shrink-0 text-accent transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </aside>
      </div>
    </PageShell>
  );
}
