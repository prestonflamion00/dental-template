import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import office from "@/config/office";
import { PageShell } from "@/components/ui/PageShell";
import { withBase } from "@/lib/format";
import { allCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: `Dental services`,
  description: `Everything ${office.practice.name} offers in ${office.contact.address.city}, ${office.contact.address.region}: ${allCategories(office)
    .map((c) => c.name.toLowerCase())
    .join(", ")}.`,
  alternates: { canonical: "/services/" },
};

/** Every service the practice offers, grouped, each linking to its own page. */
export default function ServicesPage() {
  const cats = allCategories(office);
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Services</p>
          <h1 className="mt-3 text-[2.6rem] leading-[1.05] text-ink sm:text-6xl">Everything we offer</h1>
          <p className="mt-4 text-lg text-muted">{office.copy.servicesIntro}</p>
          {cats.length > 1 && (
            <nav aria-label="Service groups" className="mt-6 flex flex-wrap justify-center gap-2">
              {cats.map((c) => (
                <a key={c.id} href={`#${c.id}`} className="rounded-full bg-accent-soft px-4 py-2 text-sm font-semibold text-ink hover:bg-white">
                  {c.name}
                </a>
              ))}
            </nav>
          )}
        </header>

        {cats.map((c) => (
          <section key={c.id} id={c.id} aria-labelledby={`${c.id}-title`} className="mt-14 scroll-mt-28">
            <h2 id={`${c.id}-title`} className="text-3xl text-ink sm:text-4xl">
              {c.name}
            </h2>
            {c.intro && <p className="mt-3 max-w-3xl text-muted">{c.intro}</p>}
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {c.services.map((s) => (
                <li key={s.id}>
                  <a href={withBase(`/services/${s.id}/`)} className="glass glass-hover group flex h-full flex-col rounded-[22px] p-5">
                    <span className="text-[1.15rem] font-semibold leading-tight text-ink">{s.name}</span>
                    <span className="mt-2 flex-1 text-[0.95rem] text-muted">{s.summary}</span>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-accent">
                      Learn more <ArrowRight size={15} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
