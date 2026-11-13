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
  morph = "glide",
}: {
  logo: React.ReactNode;
  /**
   * Phones with a big hero name: how it hands over to the bar. "glide": the name flies into the
   * bar's logo; "fade": iPhone large-title style, the name scrolls away and the logo fades in;
   * "expand": the call/menu capsule stretches into the full bar, revealing the logo.
   */
  morph?: "glide" | "fade" | "expand";
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
  const [stage, setStage] = useState<
    "none" | "hero" | "moving" | "leaving" | "bar"
  >("none");
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
    const glideMode = morph === "glide";
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const phone = () => window.innerWidth < 640;

    // The big name sits on one line, as large as fits, so it can shrink straight into the bar.
    // An image logo is sized by CSS instead and travels by height.
    const isImg = big instanceof HTMLImageElement;
    const fit = () => {
      if (isImg) return;
      big.style.fontSize = "";
      if (!phone()) return;
      const max = parseFloat(getComputedStyle(big).fontSize);
      big.style.fontSize = `${Math.min(max, (max * (document.documentElement.clientWidth - 32)) / big.scrollWidth)}px`;
    };

    // The travelling copies: fixed to the screen, line height 1 like both ends, and resized by font
    // size (not by scaling), so the last frame is drawn exactly like the bar's own logo.
    // A screen-sized frame that clips: iPhone Safari lets an off-screen fixed element widen the
    // page (shifting everything sideways), so the copies live inside this instead.
    const layer = document.createElement("div");
    layer.setAttribute("aria-hidden", "true");
    Object.assign(layer.style, {
      position: "fixed",
      inset: "0",
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: "41",
    });
    const copy = (el: HTMLElement | null) => {
      if (!el) return null;
      const c = el.cloneNode(true) as HTMLElement;
      c.removeAttribute("id");
      Object.assign(c.style, {
        position: "absolute",
        left: "0",
        top: "0",
        margin: "0",
        lineHeight: "1",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: "41",
        willChange: "transform",
        visibility: "hidden",
      });
      layer.appendChild(c);
      return c;
    };
    const pairs = !glideMode
      ? []
      : [
          { src: big, dst: logoText, c: copy(big) },
          ...(bigMark && logoMark
            ? [{ src: bigMark, dst: logoMark, c: copy(bigMark) }]
            : []),
        ];
    document.body.appendChild(layer);
    const px = (el: HTMLElement) =>
      isImg ? el.getBoundingClientRect().height : parseFloat(getComputedStyle(el).fontSize);
    type Box = { x: number; y: number; size: number };
    const boxOf = (el: HTMLElement): Box => {
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, size: px(el) };
    };
    const draw = (c: HTMLElement, b: Box) => {
      if (isImg && c === pairs[0]?.c) Object.assign(c.style, { height: `${b.size}px`, width: "auto", maxWidth: "none" });
      else c.style.fontSize = `${b.size}px`;
      c.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
    };

    // Scroll decides WHEN (two thresholds, so stopping on the line can't flicker); the glide runs
    // on a clock at one speed. Up into the bar it glides in screen coordinates (the bar doesn't
    // move), so a fast flick can't leave it behind; back down it lands on the name's live spot.
    // If a fast fling has already carried the name off screen, it switches without a glide.
    // Up into the bar: a visible glide. Back down to the hero: quick and quiet, so the hand-back is
    // barely noticed (Preston's call, Nov 13).
    const DURATION_UP = reduce ? 0 : 300; // ms
    const DURATION_DOWN = reduce ? 0 : 140; // ms
    // Gap between the big name's top and the bar's bottom that switches stages (two thresholds, so
    // stopping on the line can't flicker). "fade" and "expand" wait until the name is half under the bar.
    const TO_BAR = morph !== "glide" ? -Math.round(big.offsetHeight * 0.6) : 24;
    const TO_HERO = TO_BAR + 48;
    let current = "",
      raf = 0,
      anim = 0,
      dir: 0 | 1 = 0,
      startAt = 0,
      from: Box[] = [];
    const show = (next: string) => {
      if (next !== current) setStage((current = next) as never);
      const flying = next === "moving" || next === "leaving";
      // Only the glide hides the real name (its copy does the travelling); the other modes leave
      // the big name scrolling with the page.
      // An image logo hides only itself: the town line under it has no twin in the bar, so it just
      // scrolls away with the page.
      (isImg ? big : heroName).style.visibility = !glideMode || next === "hero" ? "" : "hidden";
      pairs.forEach(
        ({ c }) => c && (c.style.visibility = flying ? "visible" : "hidden"),
      );
    };
    // Starts quickly and settles gently (ease-out), so it answers the scroll at once.
    const ease = (t: number) => 1 - Math.pow(1 - t, 4);
    const MARK_LAG_UP = 50; // ms: "Vincennes, Indiana" follows the name a beat behind (on the way up only)
    const frame = (now: number) => {
      anim = 0;
      const el = now - startAt;
      const DURATION = dir ? DURATION_UP : DURATION_DOWN;
      const MARK_LAG = dir ? MARK_LAG_UP : 0;
      if (!DURATION || el >= DURATION + MARK_LAG)
        return show(dir ? "bar" : "hero");
      pairs.forEach(({ src, dst, c }, k) => {
        if (!c) return;
        const t = Math.max(0, Math.min(1, (el - k * MARK_LAG) / DURATION));
        const e = ease(t);
        const a = from[k],
          b = boxOf(dir ? dst : src);
        draw(c, {
          x: a.x + (b.x - a.x) * e,
          y: a.y + (b.y - a.y) * e,
          size: a.size + (b.size - a.size) * e,
        });
      });
      // The bar fades in while the name is on its way (and out on the way back), as one motion.
      show(dir ? "moving" : "leaving");
      anim = requestAnimationFrame(frame);
    };
    const glide = (to: 0 | 1) => {
      if (dir === to) return;
      dir = to;
      // Start from wherever the name is drawn right now (mid-glide: the copy's current spot).
      from = pairs.map(({ src, dst, c }, k) => {
        if ((current === "moving" || current === "leaving") && c) {
          const r = c.getBoundingClientRect();
          return { x: r.left, y: r.top, size: isImg && k === 0 ? r.height : parseFloat(c.style.fontSize) };
        }
        return boxOf(to ? src : dst);
      });
      const target = (to ? logoText : big).getBoundingClientRect();
      const source = from[0];
      const offscreen = (y: number) => y < -60 || y > window.innerHeight;
      if (offscreen(source.y) || offscreen(target.top)) {
        cancelAnimationFrame(anim);
        anim = 0;
        return show(to ? "bar" : "hero");
      }
      startAt = performance.now();
      if (!anim) anim = requestAnimationFrame(frame);
    };
    const update = () => {
      raf = 0;
      if (!phone()) {
        cancelAnimationFrame(anim);
        anim = 0;
        dir = 0;
        if (current !== "none") setStage((current = "none"));
        pairs.forEach(({ c }) => c && (c.style.visibility = "hidden"));
        heroName.style.visibility = big.style.visibility = "";
        return;
      }
      if (!current || current === "none") show(dir ? "bar" : "hero");
      const gap =
        big.getBoundingClientRect().top -
        navRef.current!.getBoundingClientRect().bottom;
      if (!glideMode) {
        // "fade" and "expand": a stage switch; CSS does the motion.
        if (gap < TO_BAR && dir !== 1) show(((dir = 1), "bar"));
        else if (gap > TO_HERO && dir !== 0) show(((dir = 0), "hero"));
        return;
      }
      if (gap < TO_BAR) glide(1);
      else if (gap > TO_HERO) glide(0);
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
      cancelAnimationFrame(anim);
      layer.remove();
      heroName.style.visibility = big.style.visibility = "";
    };
  }, [morph]);
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
          "glass-strong mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-[24px] pl-4 pr-2.5 transition-all ease-[var(--ease-soft)] sm:pl-5",
          // The bar clears quickly when the name heads back to the hero, so the return is barely seen.
          stage === "leaving" ? "duration-150" : "duration-300",
          scrolled ? "py-1.5 shadow-lg" : "py-2.5",
          heroMode && "nav-hero",
          // See-through until the name hands over (the glide fades the bar in while it flies).
          heroMode &&
            morph !== "expand" &&
            (stage === "hero" || stage === "leaving") &&
            "nav-clear",
          // "expand": only the call/menu capsule shows, then it stretches into the full bar.
          heroMode && morph === "expand" && stage === "hero" && "nav-collapsed",
        )}
      >
        <a href="#top" className="min-w-0 shrink rounded-xl">
          <span
            className={cx(
              "block origin-left duration-300",
              morph === "fade" && heroMode
                ? "transition-[transform,opacity]"
                : "transition-transform",
              // The shrink-on-scroll is skipped on phones with the hero name, so the gliding name lands
              // on the logo at its exact size.
              scrolled && (heroMode ? "sm:scale-[0.94]" : "scale-[0.94]"),
              heroMode &&
                morph !== "expand" &&
                stage !== "bar" &&
                (morph === "fade"
                  ? "max-sm:pointer-events-none max-sm:translate-y-1.5 max-sm:opacity-0"
                  : "max-sm:pointer-events-none max-sm:opacity-0"),
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
