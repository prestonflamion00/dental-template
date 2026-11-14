import Image from "next/image";
import { CreditCard, Tag } from "lucide-react";
import type { Inventory as InventoryData } from "@/config/types";
import { Section } from "@/components/ui/Section";
import { BookButton } from "@/components/booking/BookButton";
import { DealPrice } from "./DealPrice";
import { withBase } from "@/lib/format";

/** "For sale": grouped listings, brands carried, and financing. Dealers only (office.inventory). */
export function Inventory({ data, phone }: { data: InventoryData; phone: string }) {
  const tel = `tel:${phone.replace(/[^\d+]/g, "")}`;
  return (
    <Section id="inventory" eyebrow={data.eyebrow ?? "For sale"} title={data.title} intro={data.intro}>
      {data.groups.map((g) => (
        <div key={g.name} className="mb-12 last:mb-0">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2" data-reveal>
            <h3 className="font-sans text-xl font-bold tracking-tight text-ink sm:text-2xl">{g.name}</h3>
            {g.note && <p className="text-sm text-muted">{g.note}</p>}
            <p className="w-full text-xs font-semibold text-muted min-[480px]:hidden">Swipe to see all {g.items.length} →</p>
          </div>
          {/* Small phones: each brand is a sideways swipe row, so 10+ listings don't become a long scroll. */}
          <ul className="grid gap-4 max-[479px]:-mx-4 max-[479px]:flex max-[479px]:snap-x max-[479px]:snap-mandatory max-[479px]:scroll-px-4 max-[479px]:overflow-x-auto max-[479px]:px-4 max-[479px]:pb-2 min-[480px]:grid-cols-2 lg:grid-cols-3 sm:gap-5">
            {g.items.map((it, i) => (
              <li key={it.name} className="glass flex flex-col overflow-hidden rounded-[24px] max-[479px]:w-[82%] max-[479px]:shrink-0 max-[479px]:snap-start" data-reveal style={{ ["--d" as string]: `${(i % 3) * 60}ms` }}>
                <div className="relative aspect-[4/3] bg-white">
                  {it.image ? (
                    <Image src={withBase(it.image)} alt={it.name} fill sizes="(min-width: 1024px) 360px, (min-width: 480px) 45vw, 92vw" className="object-contain p-3" />
                  ) : (
                    <div className="grid h-full place-items-center text-sm font-semibold text-muted">Photo coming soon</div>
                  )}
                  {it.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-xs font-bold text-bg">{it.badge}</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h4 className="font-sans text-lg font-bold leading-snug text-ink">{it.name}</h4>
                  {it.specs && <p className="mt-1 text-[0.95rem] text-muted">{it.specs}</p>}
                  <DealPrice price={it.price} salePrice={it.salePrice} saleEnds={it.saleEnds} />
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    <BookButton serviceId="buy" note={`I'm interested in the ${it.name}. Is it still available?`} icon={false} className="!min-h-11 !px-4 !text-sm">Ask about this one</BookButton>
                    <a href={tel} className="btn btn-glass !min-h-11 !px-4 !text-sm">Call</a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {data.note && <p className="mt-6 text-center text-sm text-muted">{data.note}</p>}

      {(data.brands?.length || data.financing) && (
        <div className="mt-12 grid gap-4 lg:grid-cols-3 sm:gap-5">
          {data.brands?.map((b) => (
            <div key={b.name} className="glass rounded-[24px] p-6" data-reveal>
              <p className="eyebrow mb-2">Brand we sell</p>
              <h3 className="font-sans text-xl font-bold text-ink">{b.name}</h3>
              <p className="mt-2 text-muted">{b.text}</p>
            </div>
          ))}
          {data.financing && (
            <div className="rounded-[24px] bg-gradient-to-br from-accent to-accent-2 p-6 text-white shadow-xl" data-reveal>
              <CreditCard aria-hidden="true" />
              <h3 className="mt-3 font-sans text-xl font-bold">{data.financing.title}</h3>
              <p className="mt-2 text-white/90">{data.financing.text}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {data.financing.links?.map((l) => (
                  <a key={l.label} href={l.href} className="btn btn-glass !min-h-11 !px-4 !text-sm" target="_blank" rel="noopener noreferrer">{l.label}</a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="glass mt-5 flex flex-col items-start gap-4 rounded-[24px] p-6 sm:flex-row sm:items-center sm:justify-between" data-reveal>
        <div className="flex items-start gap-3">
          <span className="icon-tile shrink-0" aria-hidden="true"><Tag size={22} /></span>
          <div>
            <h3 className="font-sans text-lg font-bold text-ink">Selling or trading in your scooter?</h3>
            <p className="mt-1 text-muted">Tell us the make, model, year and miles, and we’ll let you know what we can do.</p>
          </div>
        </div>
        <BookButton serviceId="sell" icon={false}>Tell us about it</BookButton>
      </div>
    </Section>
  );
}
