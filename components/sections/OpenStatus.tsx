"use client";

import { useEffect, useState } from "react";
import type { Day, DayHours } from "@/config/types";
import { DAY_LABELS, formatRange, getOpenStatus, nowInTimezone, type OpenStatus } from "@/lib/hours";
import { cx } from "@/lib/format";

/**
 * Hours are evaluated in the browser (not at build time) and in the office's
 * own timezone, so a static site still shows the right status.
 */
function useNow(timezone: string, hours: Record<Day, DayHours>) {
  const [state, setState] = useState<{ status: OpenStatus; today: Day } | null>(null);
  useEffect(() => {
    const tick = () => setState({ status: getOpenStatus({ hours, timezone }), today: nowInTimezone(timezone).day });
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [timezone, hours]);
  return state;
}

export function OpenBadge({ timezone, hours, className }: { timezone: string; hours: Record<Day, DayHours>; className?: string }) {
  const now = useNow(timezone, hours);
  if (!now) {
    return <span className={cx("inline-flex min-h-7 items-center text-sm text-muted", className)}>Checking hours…</span>;
  }
  const { status, today } = now;
  const open = status.state === "open";
  return (
    <span className={cx("inline-flex flex-col gap-1", className)}>
      <span
        className={cx(
          "inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-bold",
          open ? "bg-success/10 text-success" : "bg-danger/10 text-danger",
        )}
      >
        <span className={cx("status-dot", open && "live")} aria-hidden="true" />
        {open ? (status.closingSoon ? "Closing soon" : "Open now") : "Closed now"}
      </span>
      <span className="text-[0.95rem] text-muted">
        {open
          ? `Today ${formatRange(hours[today])}`
          : status.opensAt
            ? `Opens ${status.opensDay} at ${status.opensAt}`
            : "See hours below"}
      </span>
    </span>
  );
}

/** Weekly hours table with today's row highlighted. */
export function HoursTable({ timezone, hours }: { timezone: string; hours: Record<Day, DayHours> }) {
  const now = useNow(timezone, hours);
  const days = Object.keys(DAY_LABELS) as Day[];
  return (
    <table className="w-full text-[0.975rem]">
      <caption className="sr-only">Office hours</caption>
      <tbody>
        {days.map((d) => {
          const isToday = now?.today === d;
          return (
            <tr key={d} className={cx(isToday && "font-semibold")} aria-current={isToday ? "date" : undefined}>
              <th scope="row" className={cx("whitespace-nowrap py-1.5 pr-3 text-left font-medium", isToday ? "text-ink" : "text-muted")}>
                <abbr title={DAY_LABELS[d]} className="no-underline">
                  {DAY_LABELS[d].slice(0, 3)}
                </abbr>
                {isToday && <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-bold text-accent">Today</span>}
              </th>
              <td className={cx("whitespace-nowrap py-1.5 text-right tabular-nums", hours[d] ? "text-ink" : "text-muted")}>{formatRange(hours[d])}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
