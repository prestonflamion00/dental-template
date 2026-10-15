import type { Day, DayHours, OfficeConfig } from "@/config/types";

export const DAYS: Day[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
export const DAY_LABELS: Record<Day, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};
const SCHEMA_DAYS: Record<Day, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const JS_DAY_TO_DAY: Day[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/** "17:30" → "5:30 PM" ; "09:00" → "9 AM" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour} ${suffix}` : `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatRange(h: DayHours): string {
  return h ? `${formatTime(h.open)} – ${formatTime(h.close)}` : "Closed";
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Current weekday + minutes-past-midnight in the office's own timezone. */
export function nowInTimezone(timezone: string, date = new Date()): { day: Day; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = get("weekday").toLowerCase().slice(0, 3) as Day;
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export type OpenStatus =
  | { state: "open"; closesAt: string; closingSoon: boolean }
  | { state: "closed"; opensAt?: string; opensDay?: string };

/** Compute open/closed status for the office right now (in its timezone). */
export function getOpenStatus(office: Pick<OfficeConfig, "hours" | "timezone">, date = new Date()): OpenStatus {
  const { day, minutes } = nowInTimezone(office.timezone, date);
  const today = office.hours[day];
  if (today && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    return { state: "open", closesAt: formatTime(today.close), closingSoon: toMinutes(today.close) - minutes <= 60 };
  }
  // Find the next opening.
  const idx = DAYS.indexOf(day);
  if (today && minutes < toMinutes(today.open)) {
    return { state: "closed", opensAt: formatTime(today.open), opensDay: "today" };
  }
  for (let i = 1; i <= 7; i++) {
    const d = DAYS[(idx + i) % 7];
    const h = office.hours[d];
    if (h) return { state: "closed", opensAt: formatTime(h.open), opensDay: i === 1 ? "tomorrow" : DAY_LABELS[d] };
  }
  return { state: "closed" };
}

export function dayFromDate(date: Date): Day {
  return JS_DAY_TO_DAY[date.getDay()];
}

/** schema.org openingHoursSpecification, grouping days with identical hours. */
export function openingHoursSpecification(hours: Record<Day, DayHours>) {
  const groups = new Map<string, string[]>();
  for (const d of DAYS) {
    const h = hours[d];
    if (!h) continue;
    const key = `${h.open}-${h.close}`;
    groups.set(key, [...(groups.get(key) ?? []), SCHEMA_DAYS[d]]);
  }
  return [...groups.entries()].map(([key, days]) => {
    const [opens, closes] = key.split("-");
    return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes };
  });
}

/** Compact lines for the footer, e.g. "Mon – Thu  8 AM – 5 PM". */
export function compactHours(hours: Record<Day, DayHours>): { label: string; value: string }[] {
  const out: { label: string; value: string; days: Day[] }[] = [];
  for (const d of DAYS) {
    const value = formatRange(hours[d]);
    const last = out[out.length - 1];
    if (last && last.value === value) last.days.push(d);
    else out.push({ label: "", value, days: [d] });
  }
  const short = (d: Day) => DAY_LABELS[d].slice(0, 3);
  return out.map((g) => ({
    label: g.days.length === 1 ? short(g.days[0]) : `${short(g.days[0])} – ${short(g.days[g.days.length - 1])}`,
    value: g.value,
  }));
}
