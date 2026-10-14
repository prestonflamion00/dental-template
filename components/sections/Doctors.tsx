import Image from "next/image";
import type { OfficeConfig } from "@/config/types";
import { Section } from "@/components/ui/Section";
import { cx } from "@/lib/format";

export function Doctors({ office }: { office: OfficeConfig }) {
  const { doctors, copy } = office;
  const cols = doctors.length >= 3 ? "lg:grid-cols-3" : doctors.length === 2 ? "md:grid-cols-2 max-w-4xl mx-auto" : "max-w-md mx-auto";
  return (
    <Section id="doctors" eyebrow="Meet the team" title="Friendly faces, gentle hands" intro={copy.doctorsIntro}>
      <ul className={cx("grid gap-5 sm:grid-cols-2", cols)}>
        {doctors.map((d, i) => (
          <li key={d.name} className="glass glass-hover flex flex-col rounded-[28px] p-3" data-reveal style={{ ["--d" as string]: `${i * 90}ms` }}>
            <div className="relative aspect-[4/4.2] overflow-hidden rounded-[22px] bg-accent-soft">
              <Image
                src={d.photo}
                alt={`Portrait of ${d.name}`}
                fill
                sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex flex-1 flex-col px-3 pb-4 pt-5">
              <h3 className="text-[1.65rem] text-ink">
                {d.name}
                <span className="ml-2 align-middle font-sans text-sm font-bold tracking-wide text-muted">{d.credentials}</span>
              </h3>
              <p className="mt-1 text-[0.95rem] font-semibold text-accent">{d.title}</p>
              <p className="mt-3 text-muted">{d.bio}</p>
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
