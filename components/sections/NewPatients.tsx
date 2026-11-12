import { Check, FileDown, ShieldCheck } from "lucide-react";
import { MobileReveal } from "@/components/ui/MobileReveal";
import { SampleTag } from "@/components/ui/SampleTag";
import type { OfficeConfig } from "@/config/types";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { BookButton } from "@/components/booking/BookButton";
import { telHref, withBase } from "@/lib/format";

export function NewPatients({ office }: { office: OfficeConfig }) {
  const { copy, insurances, newPatientFormsUrl, contact, terms } = office;
  return (
    <Section id="new-patients" eyebrow={terms.newCustomersEyebrow} title={terms.newCustomersTitle} intro={copy.newPatientsIntro}>
      <ol className="grid gap-4 md:grid-cols-3 md:gap-5">
        {copy.firstVisitSteps.map((step, i) => (
          // Phones: icon beside the text, without the big step number.
          <li key={step.title} className="glass relative rounded-[24px] p-5 max-sm:flex max-sm:gap-4 sm:p-7" data-reveal style={{ ["--d" as string]: `${i * 80}ms` }}>
            <div className="flex shrink-0 items-center justify-between">
              <span className="icon-tile" aria-hidden="true">
                <Icon name={step.icon} size={24} />
              </span>
              <span className="font-serif text-5xl text-accent/25 max-sm:hidden" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div>
              <h3 className="font-sans text-[1.15rem] font-bold text-ink sm:mt-5">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-1 text-muted sm:mt-2">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      {!terms.insurance ? (
        // Home services: no forms or insurance plans. One card with the promises that win the call.
        <div className="glass mt-5 grid gap-5 rounded-[24px] p-6 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center" data-reveal>
          <div>
            <h3 className="font-sans text-[1.15rem] font-bold text-ink">Our promise to you</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {copy.comfortPerks.map((p) => (
                <li key={p} className="flex items-center gap-2 rounded-full border border-white bg-white/75 px-4 py-2 text-[0.95rem] font-semibold text-ink shadow-sm">
                  <Check size={16} strokeWidth={3} aria-hidden="true" className="text-accent" />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.95rem] text-muted">
              Questions first? Call <a className="font-semibold text-accent underline underline-offset-4" href={telHref(contact.phone)}>{contact.phone}</a>. A real person answers.
            </p>
          </div>
          <BookButton size="lg" />
        </div>
      ) : (
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        {/* Phones skip the forms card: the first-visit steps already cover paperwork. */}
        <div className="glass flex min-w-0 flex-col justify-between rounded-[24px] p-6 max-sm:hidden sm:p-7" data-reveal>
          <div>
            <h3 className="font-sans text-[1.15rem] font-bold text-ink">Save time with forms</h3>
            <p className="mt-2 text-muted">
              {newPatientFormsUrl
                ? "Fill out your paperwork at home so you can spend less time in the waiting room."
                : "We’ll send your paperwork before your visit, so you can fill it out at home."}
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {/* MOCK: points at a sample PDF. Replace with the office's real forms, or an online intake link (e.g. Jotform HIPAA, NexHealth Forms). */}
            {newPatientFormsUrl && (
              <a href={withBase(newPatientFormsUrl)} className="btn btn-glass" download>
                <FileDown size={18} aria-hidden="true" className="text-accent" />
                Download new patient forms
              </a>
            )}
            <BookButton />
          </div>
        </div>

        <div className="glass min-w-0 rounded-[24px] p-6 sm:p-7" data-reveal style={{ ["--d" as string]: "80ms" }}>
          <div className="flex items-center gap-3">
            <ShieldCheck size={22} aria-hidden="true" className="text-accent" />
            <h3 className="font-sans text-[1.15rem] font-bold text-ink">
              Insurance we accept
              <SampleTag office={office} what="insurances" />
            </h3>
          </div>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Accepted insurance and financing">
            {insurances.slice(0, 6).map((ins) => (
              <li key={ins} className="rounded-full border border-white bg-white/75 px-4 py-2 text-[0.95rem] font-semibold text-ink shadow-sm">
                {ins}
              </li>
            ))}
          </ul>
          {/* Long lists: phones show 6 plans and a button for the rest. */}
          {insurances.length > 6 && (
            <MobileReveal label={`See all ${insurances.length} plans`} className="mt-3 !min-h-10 text-sm">
              <ul className="mt-2 flex flex-wrap gap-2" aria-label="More accepted plans">
                {insurances.slice(6).map((ins) => (
                  <li key={ins} className="rounded-full border border-white bg-white/75 px-4 py-2 text-[0.95rem] font-semibold text-ink shadow-sm">
                    {ins}
                  </li>
                ))}
              </ul>
            </MobileReveal>
          )}
          <p className="mt-5 text-[0.95rem] text-muted">
            Don’t see your plan? Call <a className="font-semibold text-accent underline underline-offset-4" href={telHref(contact.phone)}>{contact.phone}</a> and we’ll check your benefits for you, free of charge.
          </p>
        </div>
      </div>
      )}
    </Section>
  );
}
