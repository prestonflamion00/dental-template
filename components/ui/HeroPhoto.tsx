import { withBase } from "@/lib/format";
import { cx } from "@/lib/format";

/**
 * Phones, photo-first hero (`heroLayout`): the practice's photo leads the first screen and takes
 * whatever room is left above the headline and buttons (CSS flex, app/globals.css "Photo-first
 * hero"), so it fits even small phones. With a team photo and a building photo, the team shows first
 * and the picture slowly crossfades to the building and back. Demos of real practices without photos
 * get a placeholder marking where theirs will go. Bigger screens show the photo cards beside the text.
 */
export function HeroPhoto({
  image,
  placeholder,
}: {
  image?: { src: string; alt: string; position?: string; team?: { src: string; alt: string } };
  placeholder?: boolean;
}) {
  if (!image && !placeholder) return null;
  return (
    <div className="hero-photo relative overflow-hidden sm:hidden" aria-hidden={!image}>
      {image ? (
        <div className="hp-zoom absolute inset-0 bg-gradient-to-b from-accent-soft to-[var(--bg)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBase(image.src)}
            alt={image.team ? "" : image.alt}
            className="absolute inset-0 size-full object-cover"
            style={{ objectPosition: image.position }}
          />
          {image.team && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={withBase(image.team.src)}
              alt={`${image.team.alt}; ${image.alt}`}
              className="hp-fade absolute inset-0 size-full bg-gradient-to-b from-accent-soft to-[var(--bg)] object-cover object-top"
            />
          )}
        </div>
      ) : (
        <span className={cx("photo-placeholder absolute inset-0 flex flex-col items-center justify-center gap-2")}>
          <svg viewBox="0 0 160 90" className="w-2/5" fill="currentColor" aria-hidden="true">
            <circle cx="50" cy="30" r="13" />
            <path d="M24 88c2-18 13-27 26-27s24 9 26 27z" />
            <circle cx="110" cy="30" r="13" />
            <path d="M84 88c2-18 13-27 26-27s24 9 26 27z" />
            <circle cx="80" cy="22" r="14" />
            <path d="M52 88c2-21 14-31 28-31s26 10 28 31z" />
          </svg>
          <span className="text-sm font-semibold tracking-wide">Your team photo here</span>
        </span>
      )}
    </div>
  );
}
