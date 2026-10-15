"use client";

import { CalendarDays } from "lucide-react";
import { useBooking } from "./BookingProvider";
import { cx } from "@/lib/format";

/** The primary "Book Appointment" CTA. Opens the booking modal, or links to `booking.url` if configured. */
export function BookButton({
  children = "Book Appointment",
  serviceId,
  className,
  size = "md",
  variant = "primary",
  icon = true,
}: {
  children?: React.ReactNode;
  serviceId?: string;
  className?: string;
  size?: "md" | "lg";
  variant?: "primary" | "glass";
  icon?: boolean;
}) {
  const { open, url } = useBooking();
  const cls = cx("btn", variant === "primary" ? "btn-primary" : "btn-glass", size === "lg" && "btn-lg", className);
  const content = (
    <>
      {icon && <CalendarDays size={18} aria-hidden="true" />}
      {children}
    </>
  );
  if (url) {
    return (
      <a href={url} className={cls} target="_blank" rel="noopener noreferrer">
        {content}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <button type="button" className={cls} onClick={() => open(serviceId)} aria-haspopup="dialog">
      {content}
    </button>
  );
}
