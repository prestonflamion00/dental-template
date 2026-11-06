import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import office from "@/config/office";
import { BookButton } from "@/components/booking/BookButton";
import { PageShell } from "@/components/ui/PageShell";
import { doctorSlug, mapsHref, telHref, withBase } from "@/lib/format";
import { allCategories } from "@/lib/catalog";

/*
 * A page for each nearby town the practice serves (/areas/washington-in/), so people searching from
 * there find them. Practices without `areas` get one for their own town.
 */

export const dynamicParams = false;

const areas = () => {
  const a = office.contact.address;
  return office.areas?.length ? office.areas : [{ slug: `${a.city}-${a.region}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"), town: a.city, region: a.region }];
};

export function generateStaticParams() {
  return areas().map((a) => ({ slug: a.slug }));
}

const find = (slug: string) => areas().find((a) => a.slug === slug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const area = find((await params).slug);
  if (!area) return {};
  return {
    title: `Dentist for ${area.town}, ${area.region} | ${office.practice.name}`,
    description: `${office.practice.name} cares for patients from ${area.town}, ${area.region} and the surrounding area: ${allCategories(office)
      .map((c) => c.name.toLowerCase())
      .join(", ")}.`,
    alternates: { canonical: `/areas/${area.slug}/` },
  };
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const area = find((await params).slug);
  if (!area) notFound();
  const a = office.contact.address;
  const home = area.town === a.city && area.region === a.region;
  const years = office.practice.yearsInPractice;
  const pages = !!office.experiments?.doctorPages;
  return (
    <PageShell>
      <div className="mx-auto max-w-5xl">
        <header className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">
            {area.town}, {area.region}
          </p>
          <h1 className="mt-3 text-[2.5rem] leading-[1.05] text-ink sm:text-6xl">
            {home ? `Your ${area.town} dentists` : `Dental care for ${area.town}, ${area.region}`}
          </h1>
          <p className="mt-4 text-lg text-muted">
            {years ? `Over ${years} years of dental care in the ${area.town} area. ` : ""}
            {office.practice.description}
          </p>
          <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3 sm:flex sm:max-w-none sm:justify-center">
            <BookButton size="lg" className="col-span-2">
              Request appointment
            </BookButton>
            <a href={telHref(office.contact.phone)} className="btn btn-glass btn-lg max-sm:px-4">
              <Phone size={18} aria-hidden="true" className="text-accent" /> Call<span className="max-sm:sr-only"> {office.contact.phone}</span>
            </a>
          </div>
        </header>

        <section aria-labelledby="visit" className="glass mt-12 flex flex-col gap-4 rounded-[26px] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex gap-4">
            <span className="icon-tile shrink-0" aria-hidden="true">
              <MapPin size={22} />
            </span>
            <div>
              <h2 id="visit" className="font-sans text-sm font-bold uppercase tracking-[0.12em] text-muted">
                {home ? "Visit us" : `A short drive from ${area.town}`}
              </h2>
              <p className="mt-1 text-lg font-semibold text-ink">
                {a.street}, {a.city}, {a.region} {a.postalCode}
              </p>
            </div>
          </div>
          <a href={mapsHref(a)} target="_blank" rel="noopener noreferrer" className="btn btn-glass self-start sm:self-auto">
            Directions <ArrowRight size={16} aria-hidden="true" />
          </a>
        </section>

        <section aria-labelledby="services" className="mt-12">
          <h2 id="services" className="text-3xl text-ink sm:text-4xl">
            Care for {area.town} families
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {allCategories(office).map((c) => (
              <li key={c.id}>
                <a href={withBase(`/services/${allCategories(office).length > 1 ? `#${c.id}` : ""}`)} className="glass glass-hover flex h-full flex-col rounded-[22px] p-5">
                  <span className="text-lg font-semibold text-ink">{c.name}</span>
                  <span className="mt-1 text-[0.95rem] text-muted">{c.services.slice(0, 4).map((s) => s.name).join(", ")}{c.services.length > 4 ? "…" : ""}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {office.doctors.length > 0 && (
          <section aria-labelledby="doctors" className="mt-12">
            <h2 id="doctors" className="text-3xl text-ink sm:text-4xl">
              Your dentists
            </h2>
            <p className="mt-3 text-muted">
              {office.doctors.map((d, i) => (
                <span key={d.name}>
                  {i > 0 && (i === office.doctors.length - 1 ? " and " : ", ")}
                  {pages ? (
                    <a href={withBase(`/doctors/${doctorSlug(d.name)}/`)} className="font-semibold text-ink underline decoration-ink/20 underline-offset-4">
                      {d.name}
                    </a>
                  ) : (
                    <strong className="text-ink">{d.name}</strong>
                  )}
                </span>
              ))}{" "}
              and their caring team appreciate all honest and candid feedback from patients, and use it to keep improving their care.
            </p>
          </section>
        )}
      </div>
    </PageShell>
  );
}
