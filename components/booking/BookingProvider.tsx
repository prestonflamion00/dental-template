"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { withBase } from "@/lib/format";

/** Fired on the page when a request button is used; the form picks the service and takes focus. */
export const REQUEST_EVENT = "request:start";
export type RequestEventDetail = { serviceId?: string };

export interface BookingSettings {
  /** External scheduler URL; when set, buttons link out instead of going to the request form. */
  url?: string;
  /** The main button's words, e.g. "Request appointment" or "Get a free estimate" (office.terms.request). */
  requestLabel?: string;
  /** The red button's words, or null when this kind of business has no emergencies (no red button). */
  emergency?: string | null;
}

const Ctx = createContext<{ open: (serviceId?: string) => void; url?: string; requestLabel: string; emergency: string | null } | null>(null);

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
      // Phones land on the form's heading, just below the sticky bar (skipping the section's top
      // padding and eyebrow), so the heading and the first fields share the screen.
      const phone = window.matchMedia("(max-width: 639.98px)").matches;
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      const title = phone ? document.getElementById("request-title") : null;
      if (title) {
        // Land the heading 8px below the sticky bar, measured (its height varies by phone and it
        // shrinks once the page scrolls), so the small label above the heading is tucked under it.
        const spot = () => (document.querySelector("header nav")?.getBoundingClientRect().bottom ?? 76) + 8;
        const go = (b: ScrollBehavior) => window.scrollTo({ top: window.scrollY + title.getBoundingClientRect().top - spot(), behavior: b });
        go(behavior);
        // Once the scroll settles, correct for the bar having shrunk on the way.
        setTimeout(() => Math.abs(title.getBoundingClientRect().top - spot()) > 2 && go("auto"), behavior === "smooth" ? 900 : 50);
      } else {
        section.scrollIntoView({ behavior });
      }
      window.dispatchEvent(new CustomEvent<RequestEventDetail>(REQUEST_EVENT, { detail: { serviceId } }));
    });
  }, []);
  const value = useMemo(
    () => ({ open, url: settings.url, requestLabel: settings.requestLabel ?? "Request appointment", emergency: settings.emergency === undefined ? "Emergency" : settings.emergency }),
    [open, settings.url, settings.requestLabel, settings.emergency],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBooking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
