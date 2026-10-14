import Image from "next/image";
import type { OfficeConfig } from "@/config/types";
import { Tooth } from "./Icon";

/** Text logo (default) or image logo when `practice.logo.image` is set. */
export function Logo({ practice, compact = false }: { practice: OfficeConfig["practice"]; compact?: boolean }) {
  const { logo, name } = practice;
  if (logo.image) {
    return <Image src={logo.image} alt={name} width={180} height={48} className="h-10 w-auto" priority />;
  }
  return (
    <span className="flex items-center gap-2.5">
      <span className="icon-tile !size-10 !rounded-[14px]" aria-hidden="true">
        <Tooth size={22} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.3rem] font-medium tracking-tight text-ink">{logo.text}</span>{" "}
        {logo.mark && !compact && (
          <span className="mt-1 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-muted">{logo.mark}</span>
        )}
      </span>
    </span>
  );
}
