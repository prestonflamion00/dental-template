import { cx } from "@/lib/format";

/**
 * Demo stand-in for a doctor's photo (real-practice demos never use their photos): a soft, slowly
 * shimmering silhouette with "Your photo here". `small` is the round avatar version, without the label.
 */
export function PhotoPlaceholder({ small = false, className }: { small?: boolean; className?: string }) {
  return (
    <span className={cx("photo-placeholder flex flex-col items-center justify-center gap-1.5 sm:gap-3", className)} aria-hidden="true">
      <svg viewBox="0 0 120 120" className={small ? "w-3/5" : "w-1/3"} fill="currentColor">
        <circle cx="60" cy="44" r="22" />
        <path d="M16 116c4-28 22-42 44-42s40 14 44 42z" />
      </svg>
      {!small && <span className="text-center text-[0.65rem] font-semibold leading-tight tracking-wide sm:text-sm">Your photo here</span>}
    </span>
  );
}
