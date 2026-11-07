import Image from "next/image";
import { MobileReveal } from "@/components/ui/MobileReveal";
import type { OfficeConfig } from "@/config/types";
import { Section } from "@/components/ui/Section";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { ArrowRight } from "lucide-react";
import { cx, doctorShortName, doctorSlug, initials, withBase } from "@/lib/format";

export function Doctors({ office }: { office: OfficeConfig }) {
  const { doctors, copy } = office;
  // Demos of real practices show a placeholder where a photo will go, unless we've added theirs.
  const samplePhotos = office.stage === "demo" && !office.fictional;
  // With doctor pages on, each whole card opens that doctor's page (app/doctors/[slug]).
  const pages = !!office.experiments?.doctorPages;
  const cols =
    doctors.length >= 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : doctors.length === 2
        ? "sm:grid-cols-2 max-w-4xl mx-auto"
        : "max-w-sm mx-auto";
  return (
    <Section
      id="doctors"
      eyebrow="Meet the team"
      title="Friendly faces, gentle hands"
      intro={copy.doctorsIntro}
    >
      {/* grid-cols-1 (not an auto column) and min-w-0: iPhone Safari let the square photo widen the
          column past the screen, so the cards sat off to the right with no margin. */}
      <ul className={cx("grid grid-cols-1 gap-5", cols)}>
        {doctors.map((d, i) => (
          // Every screen: a big portrait (full card width on phones), with the name and details under it.
          <li
            key={d.name}
            className="glass glass-hover relative flex min-w-0 flex-col rounded-[28px] p-3"
            data-reveal
            style={{ ["--d" as string]: `${i * 90}ms` }}
          >
            <div className="relative aspect-[4/4.2] w-full overflow-hidden rounded-[22px] bg-accent-soft">
              {d.photo ? (
                <Image
                  src={withBase(d.photo)}
                  alt={`Portrait of ${d.name}`}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                  loading="lazy"
                />
              ) : samplePhotos ? (
                <PhotoPlaceholder className="absolute inset-0" />
              ) : (
                <span
                  className="absolute inset-0 grid place-items-center font-serif text-7xl text-accent"
                  aria-hidden="true"
                >
                  {initials(d.name)}
                </span>
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col px-3 pb-4 pt-5">
              <h3 className="text-[1.35rem] leading-tight text-ink sm:text-[1.65rem]">
                {pages ? (
                  // The link covers the whole card (after:inset-0), so a tap anywhere on it opens the page.
                  <a
                    href={withBase(`/doctors/${doctorSlug(d.name)}/`)}
                    className="rounded-lg after:absolute after:inset-0 after:rounded-[28px] after:content-['']"
                  >
                    {d.name}
                  </a>
                ) : (
                  d.name
                )}
                {d.credentials && (
                  <span className="ml-2 align-middle font-sans text-sm font-bold tracking-wide text-muted">
                    {d.credentials}
                  </span>
                )}
              </h3>
              <p className="mt-1 text-[0.95rem] font-semibold text-accent">
                {d.title}
              </p>
              {pages ? (
                <span
                  className="mt-4 inline-flex items-center gap-1.5 self-start text-[0.95rem] font-bold text-accent"
                  aria-hidden="true"
                >
                  Meet {doctorShortName(d.name)}
                  <ArrowRight size={16} />
                </span>
              ) : (
                d.bio && (
                  <MobileReveal
                    label="Read bio"
                    className="mt-4 self-start !min-h-10 text-sm"
                  >
                    <p className="mt-3 text-muted">{d.bio}</p>
                  </MobileReveal>
                )
              )}
              {d.highlights && (
                <ul
                  className="mt-auto flex flex-wrap gap-2 pt-5"
                  aria-label={`About ${d.name}`}
                >
                  {d.highlights.map((h) => (
                    <li
                      key={h}
                      className="rounded-full bg-accent-soft px-3 py-1.5 text-sm font-semibold text-ink"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
      {office.staff?.length ? (
        <p className="mt-8 text-center">
          <a href={withBase("/team/")} className="btn btn-glass">
            Meet the whole team ({doctors.length + office.staff.length}) <ArrowRight size={16} aria-hidden="true" />
          </a>
        </p>
      ) : null}
    </Section>
  );
}
