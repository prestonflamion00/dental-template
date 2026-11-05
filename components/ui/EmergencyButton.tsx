import { Siren } from "lucide-react";
import { cx } from "@/lib/format";

/**
 * The one way the site says "emergency": a solid red button that opens the emergency pop-up
 * (components/sections/EmergencyDialog.tsx). Red is kept for this alone.
 */
export function EmergencyButton({
  label = "Dental emergency?",
  size = "md",
  className,
  onClick,
}: {
  label?: string;
  size?: "sm" | "md" | "lg" | "hero";
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href="#emergency"
      onClick={onClick}
      className={cx(
        "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-danger font-bold text-white shadow-sm transition-[filter] hover:brightness-110",
        size === "sm" && "min-h-9 px-3 text-sm",
        size === "md" && "min-h-10 px-4 text-[0.95rem]",
        size === "lg" && "min-h-12 px-5 text-lg",
        // Same height and type as the hero's other big buttons (.btn-lg).
        size === "hero" && "min-h-14 px-5 text-[1.0625rem]",
        className,
      )}
    >
      <Siren size={size === "lg" || size === "hero" ? 18 : 16} aria-hidden="true" className="shrink-0" />
      {label}
    </a>
  );
}
