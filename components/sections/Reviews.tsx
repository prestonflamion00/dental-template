import { Quote } from "lucide-react";
import type { OfficeConfig } from "@/config/types";
import { Section } from "@/components/ui/Section";
import { Stars } from "@/components/ui/Stars";
import { SocialIcon } from "@/components/ui/Icon";

/** Demo-only stand-ins: clearly samples, never mistaken for real patients. */
const SAMPLE_REVIEWS = [
  { name: "Your next happy patient", text: "Your Google reviews here! This is where patients rave about their visits.", meta: "Sample review" },
  { name: "A future five-star fan", text: "Imagine a glowing review right here. We pull your newest ones in automatically.", meta: "Sample review" },
  { name: "Probably your mom", text: "Best practice in town, obviously. (Your real reviews will be much more convincing.)", meta: "Sample review" },
];

/**
 * Testimonials + rating badge, each shown only when the office has it (never invented).
 * A demo without reviews shows playful sample cards, so it's obvious they aren't real reviews.
 * MOCK: data comes from the office config. INTEGRATION POINT: see lib/integrations.ts §3.
 */
export function Reviews({ office }: { office: OfficeConfig }) {
  const { reviews, rating, copy, social, stage } = office;
  return (
    <Section id="reviews" eyebrow="Patient stories" title={reviews.length ? "Smiles, in their own words" : "What patients say"} intro={copy.reviewsIntro}>
      {/* Rating badge */}
      {rating && (
      <div className="mb-8 flex justify-center" data-reveal>
        <a
          href={social.google ?? "#reviews"}
          target={social.google ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="glass glass-hover inline-flex items-center gap-4 rounded-full py-2.5 pl-3 pr-6"
        >
          <span className="grid size-11 place-items-center rounded-full bg-white text-[#4285F4] shadow-sm" aria-hidden="true">
            <SocialIcon name="google" size={22} />
          </span>
          <span className="flex flex-col">
            <span className="flex items-center gap-2">
              <span className="text-xl font-bold text-ink">{rating.value.toFixed(1)}</span>
              <Stars rating={rating.value} className="text-ink" />
            </span>
            <span className="text-sm text-muted">
              {rating.count.toLocaleString()} reviews on {rating.source}
              {social.google && <span className="sr-only"> (opens in a new tab)</span>}
            </span>
          </span>
        </a>
      </div>
      )}

      {reviews.length === 0 && stage === "demo" && (
        <>
          <ul className="grid gap-4 md:grid-cols-3" aria-label="Sample reviews">
            {SAMPLE_REVIEWS.map((r, i) => (
              <li key={r.name} className="glass flex flex-col rounded-[24px] border-2 border-dashed border-ink/15 p-6" data-reveal style={{ ["--d" as string]: `${i * 80}ms` }}>
                <Stars rating={5} className="text-ink/40" />
                <p className="mt-4 flex-1 text-ink">“{r.text}”</p>
                <p className="mt-5 border-t border-ink/10 pt-4">
                  <span className="block font-semibold text-ink">{r.name}</span>
                  <span className="text-sm text-muted">{r.meta}</span>
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm text-muted">Sample reviews. Your real Google reviews appear here automatically, refreshed every day.</p>
        </>
      )}

      {/* Mobile: swipeable carousel. Desktop: grid. */}
      {reviews.length > 0 && (
      <div
        className="snap-row -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3"
        role="region"
        aria-label="Patient reviews, scroll horizontally for more"
        tabIndex={0}
      >
        {reviews.slice(0, 6).map((r, i) => (
          <figure
            key={r.name}
            className="glass flex w-[85%] shrink-0 flex-col rounded-[24px] p-6 sm:w-[60%] md:w-auto"
            data-reveal
            style={{ ["--d" as string]: `${(i % 3) * 80}ms` }}
          >
            <div className="flex items-center justify-between">
              <Stars rating={r.rating} className="text-ink" />
              <Quote size={26} aria-hidden="true" className="text-accent/30" />
            </div>
            <blockquote className="mt-4 flex-1 text-ink">
              <p>“{r.text}”</p>
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-ink/10 pt-4">
              <span className="grid size-10 place-items-center rounded-full bg-accent-soft font-bold text-accent" aria-hidden="true">
                {r.name.charAt(0)}
              </span>
              <span>
                <span className="block font-semibold text-ink">{r.name}</span>
                {r.meta && <span className="text-sm text-muted">{r.meta}</span>}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      )}
    </Section>
  );
}
