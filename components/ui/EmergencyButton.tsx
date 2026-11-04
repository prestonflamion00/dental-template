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
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href="#emergency"
      onClick={onClick}
      className={cx(
        "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-danger font-bold text-white shadow-sm transition-[filter] hover:brightness-110",
        size === "xs" && "min-h-9 gap-1 px-2 text-[0.8125rem]",
        size === "sm" && "min-h-9 px-3 text-sm",
        size === "md" && "min-h-10 px-4 text-[0.95rem]",
        size === "lg" && "min-h-12 px-5 text-lg",
        className,
      )}
    >
      <Siren size={size === "lg" ? 19 : size === "xs" ? 14 : 16} aria-hidden="true" className="shrink-0" />
      {label}
    </a>
  );
}
