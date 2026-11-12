"use client";

import { Siren } from "lucide-react";
import { useBooking } from "@/components/booking/BookingProvider";
import { cx } from "@/lib/format";

/**
 * The one way the site says "emergency": a red button (same shape and shading as the main buttons)
 * that opens the emergency pop-up (components/sections/EmergencyDialog.tsx). Red is kept for this alone.
 * Businesses without emergencies (office.terms.emergency null, e.g. landscaping) get no red button.
 */
export function EmergencyButton({
  label,
  size = "md",
  className,
  onClick,
}: {
  label?: string;
  /** `lg` matches the hero's big Request and Call buttons. */
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
}) {
  const { emergency } = useBooking();
  if (emergency === null) return null;
  return (
    <a href="#emergency" onClick={onClick} className={cx("btn btn-danger shrink-0 font-bold", size === "lg" && "btn-lg", className)}>
      <Siren size={18} aria-hidden="true" className="shrink-0" />
      {label ?? emergency}
    </a>
  );
}
