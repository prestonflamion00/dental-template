"use client";

import { useEffect, useState } from "react";

/**
 * A listing's price, with an optional sale price that disappears on its own once the sale has
 * ended (the day after `saleEnds`, in the visitor's time). The page is built ahead of time, so the
 * check runs in the browser: an expired deal never stays on the homepage by accident.
 */
export function DealPrice({ price, salePrice, saleEnds }: { price?: string; salePrice?: string; saleEnds?: string }) {
  const [onSale, setOnSale] = useState(() => !!salePrice && !saleEnds);
  useEffect(() => {
    if (!salePrice) return;
    if (!saleEnds) return setOnSale(true);
    const [y, m, d] = saleEnds.split("-").map(Number);
    setOnSale(Date.now() < new Date(y, m - 1, d + 1).getTime());
  }, [salePrice, saleEnds]);

  if (onSale && salePrice) {
    const ends = saleEnds
      ? new Date(saleEnds + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : null;
    return (
      <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
        <span className="text-xl font-bold text-ink">{salePrice}</span>
        {price && <s className="text-sm text-muted">{price}</s>}
        {ends && <span className="w-full text-xs font-semibold text-accent">Sale ends {ends}</span>}
      </p>
    );
  }
  return price ? <p className="mt-3 text-xl font-bold text-ink">{price}</p> : <p className="mt-3 font-semibold text-muted">Call for price</p>;
}
