import { Phone } from "lucide-react";
import type { OfficeConfig } from "@/config/types";
import { BookButton } from "@/components/booking/BookButton";
import { telHref } from "@/lib/format";

/** Mid-page booking band. */
export function Cta({ office }: { office: OfficeConfig }) {
  const { copy, contact } = office;
  return (
    <section aria-labelledby="cta-title" className="relative overflow-x-clip px-4 py-10 sm:px-6 sm:py-16">
      <div className="orb-local" style={{ ["--c" as string]: "var(--orb-1)", width: 420, height: 420, left: "8%", top: -40 }} />
      <div className="orb-local" style={{ ["--c" as string]: "var(--orb-2)", width: 380, height: 380, right: "10%", bottom: -60 }} />
      <div className="glass mx-auto max-w-4xl rounded-[32px] px-6 py-12 text-center sm:px-12 sm:py-16" data-reveal>
        <h2 id="cta-title" className="text-[2.25rem] text-ink sm:text-5xl">
          {copy.ctaHeadline}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{copy.ctaText}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <BookButton size="lg" />
          <a href={telHref(contact.phone)} className="btn btn-glass btn-lg">
            <Phone size={18} aria-hidden="true" className="text-accent" />
            Call {contact.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
