import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import office from "@/config/office";
import { PageShell } from "@/components/ui/PageShell";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { doctorShortName, doctorSlug, initials, withBase } from "@/lib/format";

export const metadata: Metadata = {
  title: `Our team`,
  description: `Meet the dentists, hygienists and team at ${office.practice.name} in ${office.contact.address.city}, ${office.contact.address.region}.`,
  alternates: { canonical: "/team/" },
};

/** Staff grouped the way patients think about them. */
function groups(staff: NonNullable<typeof office.staff>) {
  const hygienists = staff.filter((p) => /hygienist/i.test(p.role));
  const assistants = staff.filter((p) => !hygienists.includes(p) && /assistant/i.test(p.role));
  const front = staff.filter((p) => !hygienists.includes(p) && !assistants.includes(p));
  return [
    { title: "Hygienists", people: hygienists },
    { title: "Dental assistants", people: assistants },
    { title: "Front office & administration", people: front },
  ].filter((g) => g.people.length);
}

/** Everyone at the practice: the doctors (each linking to their own page) and the rest of the team. */
export default function TeamPage() {
  const { doctors, staff = [] } = office;
  const pages = !!office.experiments?.doctorPages;
  const samplePhotos = office.stage === "demo" && !office.fictional;
  const face = (photo: string | undefined, name: string, sizes: string) =>
    photo ? (
      <Image src={withBase(photo)} alt={`Portrait of ${name}`} fill sizes={sizes} className="object-cover" />
    ) : samplePhotos ? (
      <PhotoPlaceholder className="absolute inset-0" />
    ) : (
      <span className="absolute inset-0 grid place-items-center font-serif text-5xl text-accent" aria-hidden="true">
        {initials(name)}
      </span>
    );
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Our team</p>
          <h1 className="mt-3 text-[2.6rem] leading-[1.05] text-ink sm:text-6xl">Friendly faces, gentle hands</h1>
          <p className="mt-4 text-lg text-muted">
            {doctors.length + staff.length} people who’ll take care of you at {office.practice.name}.
          </p>
        </header>

        <section aria-labelledby="dentists" className="mt-12">
          <h2 id="dentists" className="text-3xl text-ink sm:text-4xl">
            Our dentists
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {doctors.map((d) => {
              const inner = (
                <>
                  <div className="relative aspect-[4/4.3] w-full overflow-hidden rounded-[18px] bg-accent-soft">{face(d.photo, d.name, "(min-width: 1024px) 280px, 50vw")}</div>
                  <span className="block px-2 pb-2 pt-3">
                    <span className="block text-[1.1rem] font-semibold leading-tight text-ink">{d.name}</span>
                    <span className="mt-0.5 block text-sm text-muted">{d.title}</span>
                    {pages && (
                      <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-accent">
                        Meet {doctorShortName(d.name)} <ArrowRight size={15} aria-hidden="true" />
                      </span>
                    )}
                  </span>
                </>
              );
              return (
                <li key={d.name}>
                  {pages ? (
                    <a href={withBase(`/doctors/${doctorSlug(d.name)}/`)} className="glass glass-hover flex h-full flex-col rounded-[24px] p-2">
                      {inner}
                    </a>
                  ) : (
                    <div className="glass flex h-full flex-col rounded-[24px] p-2">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {groups(staff).map((g) => (
          <section key={g.title} aria-labelledby={g.title} className="mt-14">
            <h2 id={g.title} className="text-2xl text-ink sm:text-3xl">
              {g.title}
            </h2>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {g.people.map((p) => (
                <li key={p.name} className="glass flex flex-col rounded-[20px] p-1.5">
                  <div className="relative aspect-square overflow-hidden rounded-[15px] bg-accent-soft">{face(p.photo, p.name, "(min-width: 1024px) 220px, 50vw")}</div>
                  <span className="block px-2 pb-2 pt-2.5">
                    <span className="block font-semibold leading-tight text-ink">{p.name}</span>
                    <span className="mt-0.5 block text-[0.85rem] leading-snug text-muted">{p.role}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
