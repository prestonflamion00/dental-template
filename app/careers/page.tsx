import type { Metadata } from "next";
import { Check, ExternalLink } from "lucide-react";
import office from "@/config/office";
import { PageShell } from "@/components/ui/PageShell";
import { telHref } from "@/lib/format";

export const metadata: Metadata = {
  title: `Careers | ${office.practice.name}`,
  description: `Join the team at ${office.practice.name} in ${office.contact.address.city}, ${office.contact.address.region}.`,
  alternates: { canonical: "/careers/" },
};

/** Open positions, each with its perks and what the job involves. */
export default function CareersPage() {
  const c = office.careers;
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl">
        <header className="text-center">
          <p className="eyebrow">Careers</p>
          <h1 className="mt-3 text-[2.6rem] leading-[1.05] text-ink sm:text-6xl">Join our team</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">{c?.intro ?? "We’re always glad to hear from great people. Call us to ask about openings."}</p>
        </header>
        {c && (
          <ul className="mt-10 grid gap-5">
            {c.jobs.map((j) => (
              <li key={j.title} className="glass rounded-[26px] p-6 sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h2 className="text-2xl text-ink sm:text-3xl">{j.title}</h2>
                  <p className="text-[0.95rem] font-semibold text-accent">{[j.type, j.pay].filter(Boolean).join(" · ")}</p>
                </div>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {j.perks.map((p) => (
                    <li key={p} className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-sm font-semibold text-ink">
                      <Check size={14} aria-hidden="true" className="text-accent" /> {p}
                    </li>
                  ))}
                </ul>
                <ul className="mt-5 grid gap-2 text-muted">
                  {j.details.map((d) => (
                    <li key={d} className="flex gap-3">
                      <span className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      {d}
                    </li>
                  ))}
                </ul>
                <a href={c.applyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6">
                  Apply now <ExternalLink size={16} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-10 text-center text-muted">
          Questions? Call us at{" "}
          <a href={telHref(office.contact.phone)} className="font-semibold text-ink underline decoration-ink/20 underline-offset-4">
            {office.contact.phone}
          </a>
          .
        </p>
      </div>
    </PageShell>
  );
}
