"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Directions on iPhone and iPad, the way AllTrails does it: tapping any Directions link
 * (lib/format.ts mapsProps) opens a sheet to pick Apple Maps, Google Maps or Waze, or copy the
 * address. It asks every time (no remembered choice).
 * The Google and Waze links open their apps when installed, or their websites when not.
 * Android and computers never see this: their tap goes straight to the link.
 */
type Choice = "apple" | "google" | "waze";
type Target = { apple: string; google: string; waze: string; address: string };
const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);

export function MapsChooser() {
  const [target, setTarget] = useState<Target | null>(null);
  const [copied, setCopied] = useState(false);
  const first = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isIOS()) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[data-apple-maps]") as HTMLAnchorElement | null;
      if (!a) return;
      const t: Target = { apple: a.dataset.appleMaps!, google: a.href, waze: a.dataset.waze ?? a.href, address: a.dataset.address ?? "" };
      e.preventDefault();
      opener.current = a;
      setCopied(false);
      setTarget(t);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (!target) return;
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [target]);

  const close = () => {
    setTarget(null);
    opener.current?.focus();
  };
  const go = (c: Choice) => {
    if (!target) return;
    const url = target[c];
    setTarget(null);
    window.location.href = url;
  };
  const copy = async () => {
    if (!target) return;
    try {
      await navigator.clipboard.writeText(target.address);
      setCopied(true);
      setTimeout(close, 900);
    } catch {
      setCopied(false);
    }
  };

  if (!target) return null;
  return (
    <div className="maps-sheet" role="presentation" onClick={close}>
      <div className="maps-sheet-panel" role="dialog" aria-modal="true" aria-label="Get directions" onClick={(e) => e.stopPropagation()}>
        <button ref={first} type="button" className="maps-sheet-btn" onClick={() => go("apple")}>Open Apple Maps</button>
        <button type="button" className="maps-sheet-btn" onClick={() => go("google")}>Open Google Maps</button>
        <button type="button" className="maps-sheet-btn" onClick={() => go("waze")}>Open Waze</button>
        <button type="button" className="maps-sheet-btn" onClick={copy}>{copied ? "Address copied" : "Copy address"}</button>
        <button type="button" className="maps-sheet-cancel" onClick={close}>Cancel</button>
      </div>
    </div>
  );
}
