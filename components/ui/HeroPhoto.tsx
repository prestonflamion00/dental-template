"use client";

import { useRef } from "react";
import { useSpareHeight } from "./HeroFlourish";
import { withBase } from "@/lib/format";

/**
 * Phones, for practices with a hero photo (`heroImage`): the photo fills the hero's spare room above
 * the rating and headline, as tall as fits (up to about 16:10), and steps aside where there's no room
 * so the buttons stay on the first screen. Bigger screens show the photo card beside the text instead.
 */
export function HeroPhotoStrip({ src, alt, position }: { src: string; alt: string; position?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const height = useSpareHeight(ref, 120, 260, "data-photo");
  return (
    <div ref={ref} className="mb-4 overflow-hidden rounded-[22px] shadow-sm sm:hidden" style={{ height: height || undefined }} hidden={!height}>
      {height > 0 && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={withBase(src)} alt={alt} className="size-full object-cover" style={{ objectPosition: position }} />
      )}
    </div>
  );
}
