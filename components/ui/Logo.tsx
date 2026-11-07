import Image from "next/image";
import type { OfficeConfig } from "@/config/types";
import { Tooth } from "./Icon";
import { withBase } from "@/lib/format";

/** Text logo (default) or image logo when `practice.logo.image` is set. */
export function Logo({ practice, compact = false }: { practice: OfficeConfig["practice"]; compact?: boolean }) {
  const { logo, name } = practice;
  if (logo.image) {
    // Their own logo artwork, used only when it clearly spells out the practice name (it replaces the
    // text). `data-logo-text` lets the phone hero's big logo glide into this one (Nav.tsx).
    return <Image data-logo-text src={withBase(logo.image)} alt={name} width={logo.width ?? 180} height={logo.height ?? 48} className="h-10 w-auto max-w-none" priority />;
  }
  // Phones: a long name drops the tooth tile (and a very long one gets slightly smaller) so it fits
  // on one line and the bar stays short.
  const long = logo.text.length > 16;
  return (
    <span className="flex items-center gap-2.5">
      <span className={`icon-tile !size-10 !rounded-[14px] max-[359px]:!hidden ${long ? "max-sm:!hidden" : ""}`} aria-hidden="true">
        <Tooth size={22} />
      </span>
      <span className="flex flex-col leading-none">
        <span data-logo-text className={`font-serif text-[1.3rem] font-medium tracking-tight text-ink ${logo.text.length > 20 ? "max-sm:text-[1.1rem]" : ""}`}>{logo.text}</span>{" "}
        {logo.mark && !compact && (
          <span data-logo-mark className="mt-1 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-muted">{logo.mark}</span>
        )}
      </span>
    </span>
  );
}
