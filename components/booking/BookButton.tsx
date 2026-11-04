"use client";

import { CalendarDays } from "lucide-react";
import { useBooking } from "./BookingProvider";
import { cx } from "@/lib/format";

/** The primary "Request appointment" button. Goes to the request form, or links to `booking.url` if configured. */
export function BookButton({
  children = "Request appointment",
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
  // A real link to the form, so it works before scripts load; with scripts it also picks the service.
  return (
    <a
      href="#request"
      className={cls}
      onClick={(e) => {
        e.preventDefault();
        open(serviceId);
      }}
    >
      {content}
    </a>
  );
}
