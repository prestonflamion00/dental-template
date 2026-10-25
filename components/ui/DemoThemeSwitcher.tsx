"use client";

import { useEffect, useState } from "react";
import { Palette } from "lucide-react";
import { DESIGNS, designLabels, designPalettes, type Design } from "@/config/designs";
import { themes, type ThemePreset } from "@/config/themes";
import { cx } from "@/lib/format";

/**
 * Sales-demo helper: add ?demo to the URL to show a floating design picker.
 * Hidden from real visitors. Swaps <html data-design>, the same switch an office sets with `design`.
 */
export function DemoThemeSwitcher() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("demo")) setVisible(true);
    setCurrent(document.documentElement.getAttribute("data-design") ?? "butter");
  }, []);

  if (!visible) return null;

  const apply = (d: Design) => {
    const root = document.documentElement;
    root.setAttribute("data-design", d);
    root.style.cssText = ""; // drop any accent override so the design shows as-is
    setCurrent(d);
    const preset = root.getAttribute("data-theme") as ThemePreset;
    const bg = d === "butter" ? themes[preset]?.bg : designPalettes[d].bg;
    if (bg) document.querySelector('meta[name="theme-color"]')?.setAttribute("content", bg);
  };

  return (
    <div
      className="glass-strong fixed bottom-28 left-3 z-50 flex items-center gap-1 rounded-full p-1.5 pl-3 md:bottom-6 md:left-6"
      role="group"
      aria-label="Demo: preview design"
    >
      <Palette size={18} aria-hidden="true" className="mr-1 text-muted" />
      {DESIGNS.map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => apply(d)}
          aria-pressed={current === d}
          title={designLabels[d].feel}
          className={cx(
            "min-h-10 rounded-full px-3.5 text-sm font-semibold transition",
            current === d ? "bg-ink text-bg" : "text-ink hover:bg-ink/10",
          )}
        >
          {designLabels[d].label}
        </button>
      ))}
    </div>
  );
}
