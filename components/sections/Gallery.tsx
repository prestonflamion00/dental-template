"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import type { GalleryItem } from "@/config/types";
import { withBase } from "@/lib/format";

/** Before/after comparison: drag the handle (or use arrow keys on the slider). */
function Compare({ item }: { item: GalleryItem }) {
  const [pos, setPos] = useState(50);
  const id = useId();
  return (
    <figure className="glass rounded-[28px] p-3" data-reveal>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-accent-soft select-none has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-accent">
        <Image src={withBase(item.after)} alt={`After: ${item.title}`} fill sizes="(min-width: 1024px) 360px, 90vw" className="object-cover" loading="lazy" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={withBase(item.before)} alt={`Before: ${item.title}`} fill sizes="(min-width: 1024px) 360px, 90vw" className="object-cover" loading="lazy" />
        </div>
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">Before</span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">After</span>
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${pos}%` }} aria-hidden="true">
          <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-accent shadow-lg">
            <MoveHorizontal size={20} />
          </span>
        </div>
        <label htmlFor={id} className="sr-only">
          Compare before and after for {item.title}
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute inset-0 size-full cursor-ew-resize opacity-0"
          aria-valuetext={`${pos}% before image shown`}
        />
      </div>
      <figcaption className="px-3 pb-3 pt-4">
        <span className="block font-semibold text-ink">{item.title}</span>
        <span className="text-[0.95rem] text-muted">{item.caption}</span>
      </figcaption>
    </figure>
  );
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Compare key={item.title} item={item} />
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        Illustrations shown as placeholders. Real patient photos are shared with consent. Individual results vary.
      </p>
    </>
  );
}
