"use client";

import { useRef } from "react";
import { useSpareHeight } from "./HeroFlourish";
import { withBase } from "@/lib/format";

/**
 * Phones, for practices with a hero photo (`heroImage`): the photo fills the hero's spare room above
 * the rating and headline, as tall as fits (up to about 16:10), and steps aside where there's no room
 * so the buttons stay on the first screen. With a team photo too, the team shows first and the picture
 * slowly crossfades to the building and back. Bigger screens show the photo cards beside the text.
 */
export function HeroPhotoStrip({
  src,
  alt,
  position,
  team,
}: {
  src: string;
  alt: string;
  position?: string;
  team?: { src: string; alt: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const height = useSpareHeight(ref, 120, 260, "data-photo");
  return (
    <div
      ref={ref}
      className="mb-4 overflow-hidden rounded-[22px] shadow-sm sm:hidden"
      style={{ height: height || undefined }}
      hidden={!height}
    >
      {height > 0 && (
        <div className="relative size-full bg-gradient-to-b from-accent-soft to-white/70">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBase(src)}
            alt={team ? "" : alt}
            className="absolute inset-0 size-full object-cover"
            style={{ objectPosition: position }}
          />
          {team && (
            // The team greets you first, then the picture slowly crossfades to the building and back.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={withBase(team.src)}
              alt={`${team.alt}; ${alt}`}
              className="hp-fade absolute inset-0 size-full bg-gradient-to-b from-accent-soft to-[var(--bg)] object-cover"
            />
          )}
        </div>
      )}
    </div>
  );
}
