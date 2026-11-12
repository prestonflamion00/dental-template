import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import office from "@/config/office";
import { BookButton } from "@/components/booking/BookButton";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { PageShell } from "@/components/ui/PageShell";
import {
  cx,
  doctorShortName,
  doctorSlug,
  initials,
  telHref,
  withBase,
} from "@/lib/format";

/*
 * One page per doctor (/doctors/dr-eric-herman/): a big portrait up front, then their story, what
 * stands out, and a way to book. Built for every practice; linked from the team cards only when the
 * practice turns doctor pages on (experiments.doctorPages).
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return office.doctors.map((d) => ({ slug: doctorSlug(d.name) }));
}

const find = (slug: string) =>
  office.doctors.find((d) => doctorSlug(d.name) === slug);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const d = find((await params).slug);
  if (!d) return {};
  const a = office.contact.address;
  return {
    title: `${d.name}${d.credentials ? `, ${d.credentials}` : ""}`,
    description:
      d.bio ??
      `${d.name}, ${d.title} at ${office.practice.name} in ${a.city}, ${a.region}.`,
    alternates: { canonical: `/doctors/${doctorSlug(d.name)}/` },
  };
}

export default async function DoctorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const d = find((await params).slug);
  if (!d) notFound();
  const others = office.doctors.filter((o) => o !== d);
  // Demos (fictional samples too): a clearly-marked placeholder where a person's photo belongs.
  const samplePhotos = office.stage === "demo";
  const home = (hash: string) => withBase(`/${hash}`);
  const paragraphs = d.about?.length ? d.about : d.bio ? [d.bio] : [];
  const photo = (
    p: string | undefined,
    name: string,
    sizes: string,
    priority = false,
  ) =>
    p ? (
      <Image
        src={withBase(p)}
        alt={`Portrait of ${name}`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    ) : samplePhotos ? (
      <PhotoPlaceholder className="absolute inset-0" />
    ) : (
      <span
        className="absolute inset-0 grid place-items-center font-serif text-7xl text-accent"
        aria-hidden="true"
      >
        {initials(name)}
      </span>
    );

  return (
    <PageShell>
      <article className="mx-auto grid max-w-6xl items-start gap-7 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
        {/* One big portrait, right up front. */}
        <div className="glass rounded-[30px] p-2.5 lg:sticky lg:top-28">
          <div className="relative aspect-[4/4.3] w-full overflow-hidden rounded-[24px] bg-accent-soft">
            {photo(d.photo, d.name, "(min-width: 1024px) 520px, 100vw", true)}
          </div>
        </div>

        <div className="lg:pt-4">
          <a
            href={home("#doctors")}
            className="inline-flex min-h-10 items-center gap-1.5 text-[0.95rem] font-semibold text-muted hover:text-ink"
          >
            <ArrowLeft size={17} aria-hidden="true" /> Our team
          </a>
          <h1 className="mt-3 text-[2.6rem] leading-[1.05] text-ink sm:text-6xl">
            {d.name}
            {d.credentials && (
              <span className="ml-3 align-middle font-sans text-lg font-bold tracking-wide text-muted">
                {d.credentials}
              </span>
            )}
          </h1>
          <p className="mt-2 text-lg font-semibold text-accent">{d.title}</p>

          {d.highlights && (
            <ul
              className="mt-5 flex flex-wrap gap-2"
              aria-label={`About ${d.name}`}
            >
              {d.highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-full bg-accent-soft px-3.5 py-1.5 text-sm font-semibold text-ink"
                >
                  {h}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-7 grid gap-4 text-[1.075rem] leading-relaxed text-muted">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:flex">
            <BookButton size="lg" className="col-span-2" />
            <a
              href={telHref(office.contact.phone)}
              className="btn btn-glass btn-lg col-span-2"
            >
              {/* No Emergency button here: someone in pain won't be on a dentist's bio, and the number
                  is the front desk, not this dentist's own line (Emergency stays in the menu). */}
              <Phone size={18} aria-hidden="true" className="text-accent" />
              Call the office · {office.contact.phone}
            </a>
          </div>
        </div>
      </article>

      {others.length > 0 && (
        <section
          aria-labelledby="team-title"
          className="mx-auto mt-20 max-w-6xl"
        >
          <h2
            id="team-title"
            className="text-center text-3xl text-ink sm:text-4xl"
          >
            Meet the rest of the team
          </h2>
          <ul
            className={cx(
              "mt-8 grid gap-4",
              others.length >= 3 ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2",
            )}
          >
            {others.map((o) => (
              <li key={o.name}>
                <a
                  href={withBase(`/doctors/${doctorSlug(o.name)}/`)}
                  className="glass glass-hover group flex h-full flex-col rounded-[24px] p-2"
                >
                  <div className="relative aspect-square overflow-hidden rounded-[18px] bg-accent-soft">
                    {photo(o.photo, o.name, "(min-width: 1024px) 340px, 50vw")}
                  </div>
                  <span className="px-2 pb-2 pt-3">
                    <span className="block text-[1.1rem] font-semibold leading-tight text-ink">
                      {o.name}
                    </span>
                    <span className="mt-1 flex items-center gap-1 text-sm font-semibold text-accent">
                      Meet {doctorShortName(o.name)}
                      <ArrowRight
                        size={15}
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  );
}
