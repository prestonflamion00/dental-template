"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { BookButton } from "@/components/booking/BookButton";
import { cx, telHref } from "@/lib/format";

/**
 * Sticky bottom action bar on phones: Request + Call always one thumb-tap away. It stays out of the
 * way while the hero's own Request and Call buttons are on screen, so the first screen never shows
 * the same two buttons twice, and while the request form is on screen.
 */
export function MobileBar({ phone }: { phone: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const heroButtons = document.getElementById("hero-actions");
    if (!heroButtons || !("IntersectionObserver" in window)) {
      setShow(true);
      return;
    }
    // Also out of the way while the request form is on screen: it would cover the fields, and its
    // Request button would just point at the form you're already looking at.
    const request = document.getElementById("request");
    const visible = new Map<Element, boolean>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) visible.set(e.target, e.isIntersecting);
      setShow(!visible.get(heroButtons) && !(request && visible.get(request)));
    });
    io.observe(heroButtons);
    if (request) io.observe(request);
    return () => io.disconnect();
  }, []);
  return (
    <div
      data-mobile-bar
      className={cx(
        "fixed inset-x-0 bottom-0 z-30 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-transform duration-300 motion-reduce:transition-none md:hidden",
        !show && "pointer-events-none translate-y-[120%]",
      )}
      // Hidden: nothing inside can be tabbed to or read out.
      inert={!show}
    >
      <div className="glass-strong grid grid-cols-[1fr_1.4fr] gap-2 rounded-[24px] p-2">
        <a href={telHref(phone)} className="btn btn-glass">
          <Phone size={18} aria-hidden="true" className="text-accent" />
          Call
        </a>
        <BookButton>Request visit</BookButton>
      </div>
    </div>
  );
}
