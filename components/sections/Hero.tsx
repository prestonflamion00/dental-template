import Image from "next/image";
import { BadgeCheck, CalendarDays, Check, ChevronDown, ChevronRight, Phone, Smile } from "lucide-react";
import type { OfficeConfig } from "@/config/types";
import { BookButton } from "@/components/booking/BookButton";
import { Highlighted } from "@/components/ui/Section";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Stars } from "@/components/ui/Stars";
import { EmergencyButton } from "@/components/ui/EmergencyButton";
import { initials, telHref, withBase } from "@/lib/format";
import { HeroStatus } from "./OpenStatus";

export function Hero({ office }: { office: OfficeConfig }) {
  const { practice, copy, rating, contact, doctors } = office;
  // With no doctors listed, the practice speaks as a team.
  const team = `the ${practice.logo.text} team`;
  const samplePhotos = office.stage === "demo" && !office.fictional;
  const has = (id: string) => office.sections.includes(id as (typeof office.sections)[number]);
  const jump = "flex items-center gap-2 rounded-lg decoration-ink/30 underline-offset-4 [&[href]]:hover:underline";
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-x-clip pb-10 pt-5 sm:pt-16 lg:pb-14 lg:pt-12">
      <div className="orb-local" style={{ ["--c" as string]: "var(--orb-1)", width: 520, height: 520, top: -80, left: "-12%" }} />
      <div className="orb-local" style={{ ["--c" as string]: "var(--orb-3)", width: 460, height: 460, top: 120, right: "-6%" }} />

      <div className="hero-main mx-auto grid w-full max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
        <div>
          {/* Phones: the rating, the strongest trust signal, sits above the headline so it's always on the first screen. */}
          {rating && (
            <a href={has("reviews") ? "#reviews" : undefined} className={`mb-3 text-[0.95rem] text-muted sm:hidden ${jump}`}>
              <Stars rating={rating.value} className="text-ink" />
              <span>
                <strong className="text-ink">{rating.value.toFixed(1)}</strong> · {rating.count.toLocaleString()} {rating.source} reviews
              </span>
            </a>
          )}
          {/* Phones skip the eyebrow: the status line and the address strip just below say where they are. */}
          <p className="eyebrow max-sm:hidden">
            {copy.heroEyebrow}
          </p>
          <h1
            id="hero-title"
            className="mt-3 text-[2.75rem] sm:mt-4 leading-[1.04] text-ink sm:text-6xl lg:text-[4.5rem]"
          >
            <Highlighted text={copy.heroHeadline} highlight={copy.heroHighlight} ownLine />
          </h1>
          <p className="hero-sub mt-3 max-w-xl text-[1.05rem] text-muted sm:mt-5 sm:text-xl">
            {copy.heroSubhead}
          </p>

          {/* Phones: Request on its own full-width row, then Call and Emergency side by side, same size.
              Bigger screens: all three in one row, same height. */}
          <div id="hero-actions" className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:flex sm:flex-wrap">
            <BookButton size="lg" className="col-span-2 max-sm:px-4 lg:px-6">
              Request appointment
            </BookButton>
            <a href={telHref(contact.phone)} className="btn btn-glass btn-lg max-sm:min-w-0 max-sm:px-4 lg:px-6">
              <Phone size={18} aria-hidden="true" className="text-accent" />
              {/* The number shows on tablets; phones and computers (number in the top bar) just say Call. */}
              Call<span className="max-sm:sr-only lg:sr-only"> {contact.phone}</span>
            </a>
            <EmergencyButton label="Emergency" size="lg" className="min-w-0 max-sm:px-4 lg:px-6" />
          </div>

          {/* Live open/closed status (the top reason people open a dentist's site) and the emergency pop-up. */}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.95rem]">
            <HeroStatus
              timezone={office.timezone}
              offices={office.locations}
            />
          </div>

          {/* Trust strip: each item jumps to the section that backs it up. */}
          {/* Phones skip this strip: the rating is above the headline and "Accepting new patients" sits in the info strip. */}
          <ul
            className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.95rem] text-muted max-sm:hidden"
            aria-label="Why patients trust us"
          >
            {rating && (
              <li className="max-sm:hidden">
                <a href={has("reviews") ? "#reviews" : undefined} className={jump}>
                  <Stars rating={rating.value} className="text-ink" />
                  <span>
                    <strong className="text-ink">{rating.value.toFixed(1)}</strong> from {rating.count.toLocaleString()} {rating.source} reviews
                  </span>
                </a>
              </li>
            )}
            {practice.yearsInPractice && (
              <li>
                <a href={has("doctors") ? "#doctors" : undefined} className={jump}>
                  <BadgeCheck size={18} className="text-accent" aria-hidden="true" />
                  <span>
                    <strong className="text-ink">{practice.yearsInPractice} years</strong> in practice
                  </span>
                </a>
              </li>
            )}
            {practice.acceptingNewPatients && (
              <li>
                <a href="#request" className={jump}>
                  <span className="grid size-5 place-items-center rounded-full bg-success text-white" aria-hidden="true">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <strong className="text-ink">Accepting new patients</strong>
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Visual: layered glass cards instead of stock photography */}
        {/* Phones skip this decorative card so the first screen stays on what matters. */}
        <div className="relative mx-auto w-full max-w-md max-sm:hidden lg:max-w-none" data-reveal style={{ ["--d" as string]: "150ms" }}>
          <div className="glass rounded-[28px] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              {doctors.length === 0 && (
                <span className="icon-tile shrink-0" aria-hidden="true">
                  <Smile size={22} />
                </span>
              )}
              <div className="flex -space-x-3">
                {doctors.slice(0, 3).map((d) =>
                  samplePhotos ? (
                    <PhotoPlaceholder key={d.name} small className="size-12 overflow-hidden rounded-full border-2 border-white" />
                  ) : d.photo ? (
                    <Image
                      key={d.name}
                      src={withBase(d.photo)}
                      alt=""
                      width={48}
                      height={48}
                      className="size-12 rounded-full border-2 border-white object-cover"
                    />
                  ) : (
                    <span
                      key={d.name}
                      className="grid size-12 place-items-center rounded-full border-2 border-white bg-accent-soft font-bold text-accent"
                      aria-hidden="true"
                    >
                      {initials(d.name)}
                    </span>
                  ),
                )}
              </div>
              <p className="text-[0.95rem] leading-snug text-muted">
                Care from{" "}
                <strong className="text-ink">
                  {doctors.length === 0 ? team : doctors.length === 1 ? doctors[0].name : `${doctors[0].name} & team`}
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

            {/* Handwritten sign-off: hidden unless the design shows it (app/designs.css). */}
            <p className="hand-note">See you soon! – {doctors[0]?.name ?? team.replace(/^the/, "The")}</p>

            <div className="mt-7 flex items-center gap-3 rounded-2xl bg-white/70 p-4">
              <span className="icon-tile !size-11 shrink-0 !rounded-xl" aria-hidden="true">
                <CalendarDays size={20} />
              </span>
              <p className="text-[0.95rem] leading-snug text-muted">
                <strong className="block text-ink">{practice.acceptingNewPatients ? "New patients welcome" : "Request a visit"}</strong>
                Send a request online and we’ll call or text to confirm.
              </p>
            </div>
          </div>

          {/* Floating rating badge: jumps to the reviews section. */}
          {rating && (
            <a
              href={has("reviews") ? "#reviews" : undefined}
              aria-label={`Rated ${rating.value.toFixed(1)} out of 5 from ${rating.count.toLocaleString()} ${rating.source} reviews, see reviews`}
              className="group glass glass-hover absolute -right-2 -top-6 hidden rounded-2xl px-4 py-3 transition-transform duration-200 hover:-translate-y-0.5 sm:block lg:-right-6"
            >
              <span className="flex items-center gap-2" aria-hidden="true">
                <span className="font-serif text-2xl text-ink">{rating.value.toFixed(1)}</span>
                <Stars rating={rating.value} size={14} className="text-ink" />
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-muted group-hover:text-accent" aria-hidden="true">
                {rating.count.toLocaleString()} reviews
                <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          )}
        </div>
      </div>
      {/* Phones: a quiet hint that hours and location are just below (the hero fills the first screen). */}
      <a href="#hours-glance" className="hero-cue mx-auto mb-3 flex min-h-11 items-center gap-1.5 px-4 text-sm font-semibold text-muted sm:hidden">
        Hours &amp; location
        <ChevronDown size={16} aria-hidden="true" />
      </a>
    </section>
  );
}
