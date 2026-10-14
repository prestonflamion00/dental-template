import { Quote } from "lucide-react";
import type { OfficeConfig } from "@/config/types";
import { Section } from "@/components/ui/Section";
import { Stars } from "@/components/ui/Stars";
import { SocialIcon } from "@/components/ui/Icon";

/**
 * Testimonials + rating badge.
 * MOCK: data comes from the office config. INTEGRATION POINT: see lib/integrations.ts §3 (Google Places API).
 */
export function Reviews({ office }: { office: OfficeConfig }) {
  const { reviews, rating, copy, social } = office;
  return (
    <Section id="reviews" eyebrow="Patient stories" title="Smiles, in their own words" intro={copy.reviewsIntro}>
      {/* Rating badge */}
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

      {/* Mobile: swipeable carousel. Desktop: grid. */}
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
    </Section>
  );
}
