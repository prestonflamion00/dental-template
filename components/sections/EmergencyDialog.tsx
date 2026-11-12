"use client";

import { useCallback, useEffect, useState } from "react";
import { Navigation, Phone, Siren } from "lucide-react";
import type { Location } from "@/config/types";
import { Modal } from "@/components/ui/Modal";
import { mapsProps, telHref } from "@/lib/format";

/**
 * Emergency info as a pop-up instead of a page section: opened by any link to #emergency (the
 * "Emergency?" button in the quick-info strip, the phone menu, or a link shared by the practice).
 */
export function EmergencyDialog({ headline, text, warning, locations }: { headline: string; text: string; warning: string; locations: Location[] }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const sync = () => setOpen(window.location.hash === "#emergency");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    if (window.location.hash === "#emergency") history.replaceState(null, "", window.location.pathname + window.location.search);
  }, []);
  const several = locations.length > 1;

  return (
    <Modal open={open} onClose={close} labelledBy="emergency-title">
      <div className="p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:p-9">
        <span className="grid size-14 place-items-center rounded-2xl bg-danger text-white shadow-lg" aria-hidden="true">
          <Siren size={26} />
        </span>
        <h2 id="emergency-title" className="mt-5 pr-10 text-3xl text-ink sm:text-4xl">
          {headline}
        </h2>
        <p className="mt-3 text-lg text-muted">{text}</p>
        <div className="mt-7 grid min-w-0 gap-3">
          {locations.map((l) => (
            <a key={l.name} href={telHref(l.phone)} className="btn btn-lg whitespace-normal bg-danger text-center text-white shadow-lg hover:brightness-110">
              <Phone size={18} aria-hidden="true" />
              Call {several ? `${l.name} ` : ""}
              <span className="whitespace-nowrap">{l.phone}</span>
            </a>
          ))}
          <a {...mapsProps(locations[0])} target="_blank" rel="noopener noreferrer" className="btn btn-glass btn-lg whitespace-normal text-center">
            <Navigation size={18} aria-hidden="true" className="text-accent" />
            Directions{several ? ` to ${locations[0].name}` : ""}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <p className="mt-6 text-[0.95rem] text-muted">
          {warning}
        </p>
      </div>
    </Modal>
  );
}
