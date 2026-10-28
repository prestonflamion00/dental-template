/**
 * The website's one form: "Request an appointment" (default) or "Ask a question".
 * Shared by components/booking/RequestForm.tsx and worker/contact.ts so both check the same rules.
 * Nothing here books a time: the office gets an email and calls or texts the patient to confirm.
 */
import type { Day } from "@/config/types";
import { DAYS } from "./hours";
import { parsePhone } from "./phone";

export type RequestKind = "appointment" | "question";
export type PatientType = "new" | "returning";

export const DAY_LABELS: Record<Day, string> = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };
export const DAY_ORDER = DAYS;
export const TIMES_OF_DAY = ["Morning", "Afternoon", "Any time"] as const;
export type TimeOfDay = (typeof TIMES_OF_DAY)[number];
/** Last choice in the "reason for visit" list, after the practice's own services. */
export const OTHER_REASON = "Something else";

export const LIMITS = { name: 100, email: 200, phone: 30, reason: 100, insurance: 100, message: 2000 };

export interface RequestValues {
  kind: RequestKind;
  name: string;
  phone: string;
  email: string;
  patientType: PatientType;
  reason: string;
  days: Day[];
  time: TimeOfDay | "";
  insurance: string;
  message: string;
}

export type RequestErrors = Partial<Record<"name" | "phone" | "email" | "reason" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateRequest(v: RequestValues): RequestErrors {
  const e: RequestErrors = {};
  if (v.name.trim().length < 2) e.name = "Please tell us your name.";
  const phone = v.phone.trim();
  if (v.kind === "appointment" && !phone) e.phone = "Please add a phone number so the office can confirm a time.";
  else if (phone && !parsePhone(phone).ok) e.phone = "Please check your phone number. Outside the US, start with + and your country code.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (v.kind === "appointment" && !v.reason) e.reason = "Please choose a reason for your visit.";
  if (v.kind === "question" && v.message.trim().length < 10) e.message = "Please add a little more detail (at least 10 characters).";
  return e;
}

/** The email the office receives. */
export function requestEmail(v: RequestValues, practice: string): { subject: string; text: string } {
  const parsed = v.phone.trim() ? parsePhone(v.phone) : null;
  const phone = parsed?.ok ? parsed.display : "not given";
  const who = v.patientType === "new" ? "new patient" : "returning patient";
  if (v.kind === "question") {
    return {
      subject: `Website question (${v.name})`,
      text: [
        `New question from the ${practice} website. Reply to this email to answer ${v.name} directly.`,
        "",
        `Name:  ${v.name}`,
        `Email: ${v.email}`,
        `Phone: ${phone}`,
        "",
        v.message,
      ].join("\n"),
    };
  }
  const days = v.days.length ? DAY_ORDER.filter((d) => v.days.includes(d)).map((d) => DAY_LABELS[d]).join(", ") : "any day";
  return {
    subject: `Appointment request: ${v.name} (${who})`,
    text: [
      `${v.name} asked for an appointment on the ${practice} website. Please call or text to confirm a time.`,
      "Nothing has been booked yet.",
      "",
      `Name:       ${v.name}`,
      `Phone:      ${phone}`,
      `Email:      ${v.email}`,
      `Patient:    ${who}`,
      `Reason:     ${v.reason}`,
      `Best days:  ${days}`,
      `Best time:  ${v.time || "any time"}`,
      `Insurance:  ${v.insurance.trim() || "not given"}`,
      ...(v.message.trim() ? ["", v.message.trim()] : []),
    ].join("\n"),
  };
}
