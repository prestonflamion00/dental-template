"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { withBase } from "@/lib/format";

/** Fired on the page when a request button is used; the form picks the service and takes focus. */
export const REQUEST_EVENT = "request:start";
export type RequestEventDetail = { serviceId?: string };

export interface BookingSettings {
  /** External scheduler URL; when set, buttons link out instead of going to the request form. */
  url?: string;
}

const Ctx = createContext<{ open: (serviceId?: string) => void; url?: string } | null>(null);

/**
 * Every "Request appointment" button scrolls to the request form near the bottom of the page
 * (components/sections/RequestSection.tsx), closing any open pop-up first and pre-selecting the
 * service when the button belongs to one. On pages without the form it goes to the home page's.
 */
export function BookingProvider({ settings, children }: { settings: BookingSettings; children: React.ReactNode }) {
  const open = useCallback((serviceId?: string) => {
    const section = document.getElementById("request");
    if (!section) {
      window.location.href = withBase("/#request");
      return;
    }
    document.querySelectorAll<HTMLDialogElement>("dialog[open]").forEach((d) => d.close());
    // After a pop-up closes it hands focus back to its button; wait a frame, then move on.
    requestAnimationFrame(() => {
      // Phones go straight to the form card, so the fields (not the section heading) fill the screen.
      const phone = window.matchMedia("(max-width: 639.98px)").matches;
      const target = (phone && section.querySelector<HTMLElement>("[data-request-card]")) || section;
      target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      window.dispatchEvent(new CustomEvent<RequestEventDetail>(REQUEST_EVENT, { detail: { serviceId } }));
    });
  }, []);
  const value = useMemo(() => ({ open, url: settings.url }), [open, settings.url]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBooking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
