"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { EmergencyButton } from "@/components/ui/EmergencyButton";
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
  /** `mobileOnly` links appear in the phone menu only (e.g. Emergency); `urgent` ones become the red Emergency button. */
  links: {
    href: string;
    label: string;
    mobileOnly?: boolean;
    wideOnly?: boolean;
    urgent?: boolean;
  }[];
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

  // Phones with a big practice name in the hero (#hero-name): as the page scrolls, that name
  // shrinks and glides up into the bar, landing exactly on the bar's logo, which then takes over.
  // A copy of the name does the travelling (fixed to the screen); the real hero name and the bar's
  // logo stay hidden while it moves, so there's only ever one name on screen. Before the move the
  // bar is see-through: the photo runs up behind it, with call and menu in one frosted capsule.
  // stage: "none" (no big name) | "hero" (name in the hero) | "moving" | "bar" (logo in the bar).
  const navRef = useRef<HTMLElement>(null);
  const [stage, setStage] = useState<"none" | "hero" | "moving" | "bar">(
    "none",
  );
  useEffect(() => {
    const heroName = document.getElementById("hero-name");
    const big = heroName?.querySelector<HTMLElement>("[data-name-text]");
    const bigMark =
      heroName?.querySelector<HTMLElement>("[data-name-mark]") ?? null;
    const logoText =
      navRef.current?.querySelector<HTMLElement>("[data-logo-text]");
    const logoMark =
      navRef.current?.querySelector<HTMLElement>("[data-logo-mark]") ?? null;
    if (!heroName || !big || !logoText) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const phone = () => window.innerWidth < 640;

    // The big name sits on one line, as large as fits, so it can shrink straight into the bar.
    const fit = () => {
      big.style.fontSize = "";
      if (!phone()) return;
      const max = parseFloat(getComputedStyle(big).fontSize);
      // The screen minus the page's side gutters (the column itself may be stretched by the name).
      const avail = document.documentElement.clientWidth - 32;
      big.style.fontSize = `${Math.min(max, (max * avail) / big.scrollWidth)}px`;
    };

    // The travelling copies.
    const layer = document.createElement("div");
    layer.setAttribute("aria-hidden", "true");
    const copy = (el: HTMLElement | null) => {
      if (!el) return null;
      const c = el.cloneNode(true) as HTMLElement;
      c.removeAttribute("id");
      Object.assign(c.style, {
        position: "fixed",
        left: "0",
        top: "0",
        margin: "0",
        transformOrigin: "0 0",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: "41",
        willChange: "transform",
        visibility: "hidden",
      });
      layer.appendChild(c);
      return c;
    };
    const cText = copy(big),
      cMark = copy(bigMark);
    document.body.appendChild(layer);

    const place = (
      src: HTMLElement,
      dst: HTMLElement,
      c: HTMLElement,
      e: number,
    ) => {
      c.style.fontSize = getComputedStyle(src).fontSize;
      const a = src.getBoundingClientRect(),
        b = dst.getBoundingClientRect();
      const k = 1 + (b.width / a.width - 1) * e;
      c.style.transform = `translate(${a.left + (b.left - a.left) * e}px, ${a.top + (b.top - a.top) * e}px) scale(${k})`;
    };
    let current = "",
      raf = 0;
    const update = () => {
      raf = 0;
      if (!phone()) {
        if (current !== "none") setStage((current = "none"));
        [cText, cMark].forEach((c) => c && (c.style.visibility = "hidden"));
        heroName.style.visibility = "";
        return;
      }
      // Progress: 0 while the name is more than 140px below the bar's logo, 1 when it reaches it.
      const gap =
        big.getBoundingClientRect().top - logoText.getBoundingClientRect().top;
      const p = Math.max(0, Math.min(1, 1 - gap / 140));
      const next =
        p <= 0
          ? "hero"
          : p >= 1
            ? "bar"
            : reduce
              ? p < 0.5
                ? "hero"
                : "bar"
              : "moving";
      if (next !== current) setStage((current = next));
      const moving = next === "moving";
      heroName.style.visibility = next === "hero" ? "" : "hidden";
      [cText, cMark].forEach(
        (c) => c && (c.style.visibility = moving ? "visible" : "hidden"),
      );
      if (moving) {
        const e = p * p * (3 - 2 * p); // ease in and out
        place(big, logoText, cText!, e);
        if (cMark && bigMark && logoMark) place(bigMark, logoMark, cMark, e);
      }
    };
    const schedule = () => (raf ||= requestAnimationFrame(update));
    fit();
    update();
    document.fonts?.ready.then(() => (fit(), update()));
    const onResize = () => (fit(), schedule());
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      layer.remove();
      heroName.style.visibility = "";
    };
  }, []);
  const heroMode = stage !== "none";

  // While the menu is open, the sticky Call / Request bar at the bottom steps aside (the menu has
  // the same buttons, and the two would overlap); app/globals.css hides it on html[data-menu-open].
  useEffect(() => {
    document.documentElement.toggleAttribute("data-menu-open", menuOpen);
    return () => document.documentElement.removeAttribute("data-menu-open");
  }, [menuOpen]);

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
        ref={navRef}
        aria-label="Main"
        className={cx(
          "glass-strong mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-[24px] pl-4 pr-2.5 transition-all duration-300 ease-[var(--ease-soft)] sm:pl-5",
          scrolled ? "py-1.5 shadow-lg" : "py-2.5",
          heroMode && "nav-hero",
          heroMode && stage !== "bar" && "nav-clear",
        )}
      >
        <a href="#top" className="min-w-0 shrink rounded-xl">
          <span
            className={cx(
              "block origin-left transition-transform duration-300",
              scrolled && "scale-[0.94]",
              heroMode &&
                stage !== "bar" &&
                "max-sm:pointer-events-none max-sm:opacity-0",
            )}
          >
            {logo}
          </span>
        </a>

        <ul className="hidden items-center gap-1 xl:flex">
          {links
            .filter((l) => !l.mobileOnly)
            .map((l) => (
              <li
                key={l.href}
                className={l.wideOnly ? "hidden 2xl:block" : undefined}
              >
                <a
                  href={l.href}
                  className="whitespace-nowrap rounded-full px-2.5 py-2.5 text-[0.95rem] font-semibold text-ink/90 transition-colors hover:bg-white/80 hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
        </ul>

        <div className="nav-actions flex items-center gap-1.5">
          <a
            href={telHref(phone)}
            className="hidden items-center gap-2 whitespace-nowrap rounded-full px-3 py-2.5 text-[0.95rem] font-semibold text-ink hover:bg-white/80 lg:inline-flex"
          >
            <Phone size={17} aria-hidden="true" className="text-accent" />
            {phone}
          </a>
          {/* Phones and tablets get a tap-to-call icon; computers show the number itself, since most people
              dial it from their phone while looking at the screen. */}
          <a
            href={telHref(phone)}
            className="grid size-12 place-items-center rounded-full text-accent hover:bg-white/80 lg:hidden"
            title={`Call ${phone}`}
            aria-label={`Call ${practiceName} at ${phone}`}
          >
            <Phone size={21} aria-hidden="true" />
          </a>
          <BookButton className="hidden sm:inline-flex" icon={false} />
          <button
            ref={menuBtn}
            type="button"
            className="grid size-12 place-items-center rounded-full text-ink hover:bg-white/80 xl:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <Menu size={22} aria-hidden="true" />
            )}
            <span className="sr-only">
              {menuOpen ? "Close menu" : "Open menu"}
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!menuOpen}
        // Never taller than the screen below the bar: on small phones it scrolls inside itself.
        className="glass-strong mx-auto mt-2 max-h-[calc(100svh-7.5rem)] max-w-6xl overflow-y-auto overscroll-contain rounded-[24px] p-3 xl:hidden"
      >
        <ul className="grid gap-1">
          {links.map((l) =>
            l.urgent ? (
              <li key={l.href} className="px-1 pt-2">
                <EmergencyButton
                  label={l.label}
                  size="lg"
                  className="w-full"
                  onClick={() => setMenuOpen(false)}
                />
              </li>
            ) : (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-12 items-center rounded-2xl px-4 text-lg font-semibold text-ink hover:bg-white/80"
                >
                  {l.label}
                </a>
              </li>
            ),
          )}
        </ul>
        <div className="mt-2 grid gap-2 border-t border-ink/10 px-1 pt-3 sm:hidden">
          <BookButton className="w-full" />
        </div>
      </div>
    </header>
  );
}
