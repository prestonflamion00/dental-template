import { Clock, Phone, ShieldCheck } from "lucide-react";
import type { OfficeConfig } from "@/config/types";
import { Section } from "@/components/ui/Section";
import { RequestForm } from "@/components/booking/RequestForm";
import { openDays } from "@/lib/hours";
import { telHref } from "@/lib/format";

/** "Request an appointment", high on the page: the same form the buttons open, shown inline. */
export function RequestSection({ office }: { office: OfficeConfig }) {
  const { contact, practice } = office;
  return (
    <Section id="request" eyebrow="Appointments" title="Request an appointment" intro={office.copy.requestIntro ?? "Tell us a little about you and the team will call or text to find a time that works."}>
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <ul className="grid content-start gap-4" data-reveal>
          <li className="glass flex gap-4 rounded-[24px] p-5">
            <span className="icon-tile shrink-0" aria-hidden="true">
              <Clock size={22} />
            </span>
            <div>
              <h3 className="font-sans text-[1.05rem] font-bold text-ink">We confirm by phone or text</h3>
              <p className="mt-1 text-[0.95rem] text-muted">Send a request any time. The team gets back to you during office hours with a time that fits.</p>
            </div>
          </li>
          <li className="glass flex gap-4 rounded-[24px] p-5">
            <span className="icon-tile shrink-0" aria-hidden="true">
              <ShieldCheck size={22} />
            </span>
            <div>
              <h3 className="font-sans text-[1.05rem] font-bold text-ink">We check your insurance</h3>
              <p className="mt-1 text-[0.95rem] text-muted">Tell us your provider and we’ll look up your benefits before your visit.</p>
            </div>
          </li>
          <li className="glass flex gap-4 rounded-[24px] p-5">
            <span className="icon-tile shrink-0" aria-hidden="true">
              <Phone size={22} />
            </span>
            <div>
              <h3 className="font-sans text-[1.05rem] font-bold text-ink">Prefer to call?</h3>
              <a href={telHref(contact.phone)} className="mt-1 inline-block text-lg font-semibold text-ink hover:text-accent">
                {contact.phone}
              </a>
            </div>
          </li>
        </ul>
        <div className="glass min-w-0 rounded-[28px] p-6 sm:p-8" data-reveal style={{ ["--d" as string]: "80ms" }}>
          <RequestForm
            practiceName={practice.name}
            services={office.services.map(({ id, name }) => ({ id, name }))}
            openDays={openDays(office.hours)}
            titleId="request-title"
            heading={false}
          />
        </div>
      </div>
    </Section>
  );
}
