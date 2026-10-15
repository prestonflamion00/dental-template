"use client";

import { useEffect, useState } from "react";
import { Palette } from "lucide-react";
import { THEME_PRESETS, themes, type ThemePreset } from "@/config/themes";
import { cx } from "@/lib/format";

/**
 * Sales-demo helper: add ?demo to the URL to show a floating theme picker.
 * Hidden from real visitors. Uses the same CSS variables as config theming.
 */
export function DemoThemeSwitcher() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("demo")) setVisible(true);
    setCurrent(document.documentElement.getAttribute("data-theme") ?? "");
  }, []);

  if (!visible) return null;

  const apply = (p: ThemePreset) => {
    const root = document.documentElement;
    root.setAttribute("data-theme", p);
    root.style.cssText = ""; // drop any accent override so the preset shows as-is
    setCurrent(p);
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", themes[p].bg);
  };

  return (
    <div className="glass-strong fixed bottom-28 left-3 z-50 flex items-center gap-2 rounded-full p-1.5 pl-3 md:bottom-6 md:left-6" role="group" aria-label="Demo: preview theme">
      <Palette size={18} aria-hidden="true" className="text-muted" />
      {THEME_PRESETS.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => apply(p)}
          aria-pressed={current === p}
          title={themes[p].label}
          className={cx("size-9 rounded-full border-2 transition", current === p ? "border-ink scale-110" : "border-white")}
          style={{ background: `linear-gradient(135deg, ${themes[p].orb1}, ${themes[p].accent})` }}
        >
          <span className="sr-only">{themes[p].label}</span>
        </button>
      ))}
    </div>
  );
}
