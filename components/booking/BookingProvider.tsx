"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Day, DayHours, Service } from "@/config/types";
import { BookingModal } from "./BookingModal";

export interface BookingSettings {
  practiceName: string;
  phone: string;
  services: Pick<Service, "id" | "name" | "short" | "icon" | "durationMin">[];
  hours: Record<Day, DayHours>;
  slotMinutes: number;
  /** External scheduler URL; when set, buttons link out instead of opening the mock. */
  url?: string;
}

const Ctx = createContext<{ open: (serviceId?: string) => void; url?: string } | null>(null);

export function BookingProvider({ settings, children }: { settings: BookingSettings; children: React.ReactNode }) {
  const [state, setState] = useState<{ open: boolean; serviceId?: string; key: number }>({ open: false, key: 0 });
  const open = useCallback((serviceId?: string) => setState((s) => ({ open: true, serviceId, key: s.key + 1 })), []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);
  const value = useMemo(() => ({ open, url: settings.url }), [open, settings.url]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {!settings.url && (
        <BookingModal key={state.key} open={state.open} onClose={close} initialServiceId={state.serviceId} settings={settings} />
      )}
    </Ctx.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
