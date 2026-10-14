import { FileDown, ShieldCheck } from "lucide-react";
import type { OfficeConfig } from "@/config/types";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { BookButton } from "@/components/booking/BookButton";
import { telHref } from "@/lib/format";

export function NewPatients({ office }: { office: OfficeConfig }) {
  const { copy, insurances, newPatientFormsUrl, contact } = office;
  return (
    <Section id="new-patients" eyebrow="New patients" title="Your first visit, made easy" intro={copy.newPatientsIntro}>
      <ol className="grid gap-4 md:grid-cols-3 md:gap-5">
        {copy.firstVisitSteps.map((step, i) => (
          <li key={step.title} className="glass relative rounded-[24px] p-6 sm:p-7" data-reveal style={{ ["--d" as string]: `${i * 80}ms` }}>
            <div className="flex items-center justify-between">
              <span className="icon-tile" aria-hidden="true">
                <Icon name={step.icon} size={24} />
              </span>
              <span className="font-serif text-5xl text-accent/25" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-5 font-sans text-[1.15rem] font-bold text-ink">
              <span className="sr-only">Step {i + 1}: </span>
              {step.title}
            </h3>
            <p className="mt-2 text-muted">{step.text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        <div className="glass flex flex-col justify-between rounded-[24px] p-6 sm:p-7" data-reveal>
          <div>
            <h3 className="font-sans text-[1.15rem] font-bold text-ink">Save time with forms</h3>
            <p className="mt-2 text-muted">Fill out your paperwork at home so you can spend less time in the waiting room.</p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            {/* MOCK: points at a sample PDF. Replace with the office's real forms, or an online intake link (e.g. Jotform HIPAA, NexHealth Forms). */}
            <a href={newPatientFormsUrl ?? "#"} className="btn btn-glass" download>
              <FileDown size={18} aria-hidden="true" className="text-accent" />
              Download new patient forms
            </a>
            <BookButton />
          </div>
        </div>

        <div className="glass rounded-[24px] p-6 sm:p-7" data-reveal style={{ ["--d" as string]: "80ms" }}>
          <div className="flex items-center gap-3">
            <ShieldCheck size={22} aria-hidden="true" className="text-accent" />
            <h3 className="font-sans text-[1.15rem] font-bold text-ink">Insurance we accept</h3>
          </div>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Accepted insurance and financing">
            {insurances.map((ins) => (
              <li key={ins} className="rounded-full border border-white bg-white/75 px-4 py-2 text-[0.95rem] font-semibold text-ink shadow-sm">
                {ins}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[0.95rem] text-muted">
            Don’t see your plan? Call <a className="font-semibold text-accent underline underline-offset-4" href={telHref(contact.phone)}>{contact.phone}</a> and we’ll check your benefits for you, free of charge.
          </p>
        </div>
      </div>
    </Section>
  );
}
