"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { BookButton } from "@/components/booking/BookButton";
import { cx, telHref } from "@/lib/format";

/** Sticky frosted-glass navigation. Shrinks slightly once the page scrolls. */
export function Nav({
  logo,
  practiceName,
  phone,
  links,
}: {
  logo: React.ReactNode;
  practiceName: string;
  phone: string;
  links: { href: string; label: string }[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuBtn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        aria-label="Main"
        className={cx(
          "glass-strong mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-[24px] pl-4 pr-2.5 transition-all duration-300 ease-[var(--ease-soft)] sm:pl-5",
          scrolled ? "py-1.5 shadow-lg" : "py-2.5",
        )}
      >
        <a href="#top" className="shrink-0 rounded-xl">
          <span className={cx("block origin-left transition-transform duration-300", scrolled && "scale-[0.94]")}>{logo}</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="whitespace-nowrap rounded-full px-3 py-2.5 text-[0.95rem] font-semibold text-ink/90 transition-colors hover:bg-white/80 hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <a
            href={telHref(phone)}
            className="hidden items-center gap-2 whitespace-nowrap rounded-full px-3 py-2.5 text-[0.95rem] font-semibold text-ink hover:bg-white/80 xl:inline-flex"
          >
            <Phone size={17} aria-hidden="true" className="text-accent" />
            {phone}
          </a>
          {/* Tap-to-call icon (number shown in full on wide screens) */}
          <a
            href={telHref(phone)}
            className="grid size-12 place-items-center rounded-full text-accent hover:bg-white/80 xl:hidden"
            aria-label={`Call ${practiceName} at ${phone}`}
          >
            <Phone size={21} aria-hidden="true" />
          </a>
          <BookButton className="hidden sm:inline-flex" icon={false} />
          <button
            ref={menuBtn}
            type="button"
            className="grid size-12 place-items-center rounded-full text-ink hover:bg-white/80 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="glass-strong mx-auto mt-2 max-w-6xl rounded-[24px] p-3 lg:hidden"
      >
        <ul className="grid gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-12 items-center rounded-2xl px-4 text-lg font-semibold text-ink hover:bg-white/80"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-2 grid gap-2 border-t border-ink/10 px-1 pt-3 sm:hidden">
          <BookButton className="w-full" />
        </div>
      </div>
    </header>
  );
}
