"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { RequestForm, type RequestFormProps } from "./RequestForm";

export interface BookingSettings extends Omit<RequestFormProps, "initialServiceId" | "titleId"> {
  /** External scheduler URL; when set, buttons link out instead of opening the request form. */
  url?: string;
}

const Ctx = createContext<{ open: (serviceId?: string) => void; url?: string } | null>(null);

/** Every "Request appointment" button opens the request form in a pop-up (or links to `url`). */
export function BookingProvider({ settings, children }: { settings: BookingSettings; children: React.ReactNode }) {
  const [state, setState] = useState<{ open: boolean; serviceId?: string; key: number }>({ open: false, key: 0 });
  const open = useCallback((serviceId?: string) => setState((s) => ({ open: true, serviceId, key: s.key + 1 })), []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);
  const value = useMemo(() => ({ open, url: settings.url }), [open, settings.url]);
  const { url, ...form } = settings;

  return (
    <Ctx.Provider value={value}>
      {children}
      {!url && (
        <Modal open={state.open} onClose={close} labelledBy="request-modal-title">
          <div className="p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:p-9">
            <RequestForm key={state.key} {...form} initialServiceId={state.serviceId} titleId="request-modal-title" />
          </div>
        </Modal>
      )}
    </Ctx.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
