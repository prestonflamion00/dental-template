import { cx } from "@/lib/format";

/**
 * Demo stand-in where a real photo belongs: a soft, slowly shimmering shape with a label. Clearly a
 * placeholder, like the sample reviews, so nobody mistakes it for a real person or a real job.
 * `kind`: "person" (a silhouette, for team photos) or "photo" (a picture frame, for project photos
 * such as before and after). `small` is the round avatar version, without the label.
 */
export function PhotoPlaceholder({
  small = false,
  kind = "person",
  label,
  className,
}: {
  small?: boolean;
  kind?: "person" | "photo";
  label?: string;
  className?: string;
}) {
  return (
    <span className={cx("photo-placeholder flex flex-col items-center justify-center gap-1.5 sm:gap-3", className)} aria-hidden="true">
      {kind === "person" ? (
        <svg viewBox="0 0 120 120" className={small ? "w-3/5" : "w-1/3"} fill="currentColor">
          <circle cx="60" cy="44" r="22" />
          <path d="M16 116c4-28 22-42 44-42s40 14 44 42z" />
        </svg>
      ) : (
        <svg viewBox="0 0 120 96" className="w-1/4" fill="currentColor">
          <path d="M14 8h92a10 10 0 0 1 10 10v60a10 10 0 0 1-10 10H14A10 10 0 0 1 4 78V18A10 10 0 0 1 14 8Zm4 66h84L74 38 56 60 44 46Z" fillRule="evenodd" />
          <circle cx="36" cy="30" r="9" />
        </svg>
      )}
      {!small && <span className="text-center text-[0.65rem] font-semibold leading-tight tracking-wide sm:text-sm">{label ?? "Your photo here"}</span>}
    </span>
  );
}
