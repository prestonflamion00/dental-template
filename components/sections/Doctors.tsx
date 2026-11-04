import Image from "next/image";
import { MobileReveal } from "@/components/ui/MobileReveal";
import type { OfficeConfig } from "@/config/types";
import { Section } from "@/components/ui/Section";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { cx, initials, withBase } from "@/lib/format";

export function Doctors({ office }: { office: OfficeConfig }) {
  const { doctors, copy } = office;
  // Demos of real practices never use their photos: a placeholder marks where theirs will go.
  const samplePhotos = office.stage === "demo" && !office.fictional;
  const cols =
    doctors.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : doctors.length === 2 ? "sm:grid-cols-2 max-w-4xl mx-auto" : "max-w-sm mx-auto";
  return (
    <Section id="doctors" eyebrow="Meet the team" title="Friendly faces, gentle hands" intro={copy.doctorsIntro}>
      <ul className={cx("grid gap-5", cols)}>
        {doctors.map((d, i) => (
          // Phones: a compact row (small photo beside the name) instead of a tall portrait card.
          <li key={d.name} className="glass glass-hover flex rounded-[28px] p-3 max-sm:items-center max-sm:gap-4 sm:flex-col" data-reveal style={{ ["--d" as string]: `${i * 90}ms` }}>
            <div className="relative aspect-[4/4.2] overflow-hidden rounded-[22px] bg-accent-soft max-sm:size-24 max-sm:shrink-0 max-sm:rounded-2xl">
              {samplePhotos ? (
                <PhotoPlaceholder className="absolute inset-0" />
              ) : d.photo ? (
                <Image
                  src={withBase(d.photo)}
                  alt={`Portrait of ${d.name}`}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center font-serif text-4xl text-accent sm:text-7xl" aria-hidden="true">
                  {initials(d.name)}
                </span>
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col sm:px-3 sm:pb-4 sm:pt-5">
              <h3 className="text-[1.35rem] leading-tight text-ink sm:text-[1.65rem]">
                {d.name}
                <span className="ml-2 align-middle font-sans text-sm font-bold tracking-wide text-muted">{d.credentials}</span>
              </h3>
              <p className="mt-1 text-[0.95rem] font-semibold text-accent">{d.title}</p>
              {d.bio && (
                <MobileReveal label="Read bio" className="mt-4 self-start !min-h-10 text-sm">
                  <p className="mt-3 text-muted">{d.bio}</p>
                </MobileReveal>
              )}
              {d.highlights && (
                <ul className="mt-auto flex flex-wrap gap-2 pt-5" aria-label={`About ${d.name}`}>
                  {d.highlights.map((h) => (
                    <li key={h} className="rounded-full bg-accent-soft px-3 py-1.5 text-sm font-semibold text-ink">
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
