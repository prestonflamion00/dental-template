import Image from "next/image";
import { BadgeCheck, CalendarDays, Check, Phone } from "lucide-react";
import type { OfficeConfig } from "@/config/types";
import { BookButton } from "@/components/booking/BookButton";
import { Highlighted } from "@/components/ui/Section";
import { Stars } from "@/components/ui/Stars";
import { telHref, withBase } from "@/lib/format";

export function Hero({ office }: { office: OfficeConfig }) {
  const { practice, copy, rating, contact, doctors } = office;
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-x-clip pb-10 pt-10 sm:pt-16 lg:pb-16 lg:pt-20">
      <div className="orb-local" style={{ ["--c" as string]: "var(--orb-1)", width: 520, height: 520, top: -80, left: "-12%" }} />
      <div className="orb-local" style={{ ["--c" as string]: "var(--orb-3)", width: 460, height: 460, top: 120, right: "-6%" }} />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        <div>
          <p className="eyebrow">
            {copy.heroEyebrow}
          </p>
          <h1
            id="hero-title"
            className="mt-4 text-[2.75rem] leading-[1.04] text-ink sm:text-6xl lg:text-[4.5rem]"
          >
            <Highlighted text={copy.heroHeadline} highlight={copy.heroHighlight} />
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted sm:text-xl">
            {copy.heroSubhead}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BookButton size="lg" />
            <a href={telHref(contact.phone)} className="btn btn-glass btn-lg">
              <Phone size={18} aria-hidden="true" className="text-accent" />
              Call {contact.phone}
            </a>
          </div>

          {/* Trust strip */}
          <ul
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.95rem] text-muted"
            aria-label="Why patients trust us"
          >
            <li className="flex items-center gap-2">
              <Stars rating={rating.value} className="text-ink" />
              <span>
                <strong className="text-ink">{rating.value.toFixed(1)}</strong> from {rating.count.toLocaleString()} {rating.source} reviews
              </span>
            </li>
            <li className="flex items-center gap-2">
              <BadgeCheck size={18} className="text-accent" aria-hidden="true" />
              <span>
                <strong className="text-ink">{practice.yearsInPractice} years</strong> in practice
              </span>
            </li>
            {practice.acceptingNewPatients && (
              <li className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-success text-white" aria-hidden="true">
                  <Check size={13} strokeWidth={3} />
                </span>
                <strong className="text-ink">Accepting new patients</strong>
              </li>
            )}
          </ul>
        </div>

        {/* Visual: layered glass cards instead of stock photography */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none" data-reveal style={{ ["--d" as string]: "150ms" }}>
          <div className="glass rounded-[28px] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {doctors.slice(0, 3).map((d) => (
                  <Image
                    key={d.name}
                    src={withBase(d.photo)}
                    alt=""
                    width={48}
                    height={48}
                    className="size-12 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <p className="text-[0.95rem] leading-snug text-muted">
                Care from{" "}
                <strong className="text-ink">
                  {doctors.length === 1 ? doctors[0].name : `${doctors[0].name} & team`}
                </strong>
              </p>
            </div>

            <p className="mt-7 font-serif text-[1.85rem] leading-tight text-ink">Your visit, at your pace.</p>
            <ul className="mt-5 grid gap-3">
              {copy.comfortPerks.map((perk) => (
                <li key={perk} className="flex items-center gap-3 text-ink">
                  <span className="grid size-8 place-items-center rounded-full bg-accent-soft text-accent" aria-hidden="true">
                    <Check size={16} strokeWidth={2.5} />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex items-center gap-3 rounded-2xl bg-white/70 p-4">
              <span className="icon-tile !size-11 shrink-0 !rounded-xl" aria-hidden="true">
                <CalendarDays size={20} />
              </span>
              <p className="text-[0.95rem] leading-snug text-muted">
                <strong className="block text-ink">New patient openings this week</strong>
                Most visits booked within a few days
              </p>
            </div>
          </div>

          {/* Floating accent (decorative duplicate of the rating stated below) */}
          <div
            aria-hidden="true"
            className="glass absolute -right-2 -top-6 hidden rounded-2xl px-4 py-3 sm:block lg:-right-6"
          >
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl text-ink">{rating.value.toFixed(1)}</span>
              <Stars rating={rating.value} size={14} className="text-ink" />
            </div>
            <p className="text-xs font-semibold text-muted">{rating.count.toLocaleString()} reviews</p>
          </div>
        </div>
      </div>
    </section>
  );
}
