"use client";

/**
 * The site's one form, used inline (the "request" section) and in the pop-up behind every
 * "Request appointment" button. Two modes: request an appointment (default) or ask a question.
 * Nothing is booked: the office gets an email (worker/contact.ts) and calls or texts to confirm.
 * Demos without NEXT_PUBLIC_CONTACT_ENDPOINT show the same flow and send nothing.
 */

import { useEffect, useId, useRef, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import type { Day } from "@/config/types";
import { contactIsLive, sendContactMessage } from "@/lib/integrations";
import {
  DAY_LABELS,
  DAY_ORDER,
  LIMITS,
  OTHER_REASON,
  TIMES_OF_DAY,
  validateRequest,
  type RequestErrors,
  type RequestKind,
  type RequestValues,
} from "@/lib/request";
import { cx } from "@/lib/format";

export interface RequestFormProps {
  practiceName: string;
  /** Visit reasons offered in the dropdown (the practice's services). */
  services: { id: string; name: string }[];
  /** Days the office is open; only these are offered as preferred days. */
  openDays: Day[];
  /** Service to preselect, e.g. when opened from a service's "Request" button. */
  initialServiceId?: string;
  /** id of the heading that names the form (its own, or the surrounding section's when `heading` is false). */
  titleId?: string;
  /** Show the form's own heading. Off when the surrounding section already says "Request an appointment". */
  heading?: boolean;
}

const inputCls = (err?: string) =>
  cx(
    "min-h-12 w-full rounded-2xl border bg-white/85 px-4 text-ink transition focus:bg-white",
    err ? "border-danger" : "border-ink/15",
  );
const chipCls =
  "relative inline-flex min-h-11 cursor-pointer select-none items-center rounded-full border border-ink/15 bg-white/70 px-4 font-semibold text-ink transition hover:border-ink/40 has-checked:border-ink has-checked:bg-ink has-checked:text-bg has-focus-visible:ring-2 has-focus-visible:ring-accent has-focus-visible:ring-offset-2";

export function RequestForm({ practiceName, services, openDays, initialServiceId, titleId, heading = true }: RequestFormProps) {
  const uid = useId();
  const initialReason = services.find((s) => s.id === initialServiceId)?.name ?? "";
  const empty: RequestValues = {
    kind: "appointment",
    name: "",
    phone: "",
    email: "",
    patientType: "new",
    reason: initialReason,
    days: [],
    time: "",
    insurance: "",
    message: "",
  };
  const [values, setValues] = useState<RequestValues>(empty);
  const [errors, setErrors] = useState<RequestErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  // Bot traps (checked by the server): when the form appeared, and a hidden field people never fill.
  const startedAt = useRef(0);
  const [company, setCompany] = useState("");
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const isAppt = values.kind === "appointment";

  const update = <K extends keyof RequestValues>(k: K, v: RequestValues[K]) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (k in errors) setErrors((er) => ({ ...er, [k]: undefined }));
  };
  const setKind = (kind: RequestKind) => {
    update("kind", kind);
    setErrors({});
  };
  const toggleDay = (d: Day) => update("days", values.days.includes(d) ? values.days.filter((x) => x !== d) : [...values.days, d]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateRequest(values);
    setErrors(errs);
    const first = (["name", "phone", "email", "reason", "message"] as const).find((k) => errs[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      await sendContactMessage({ ...values, company, startedAt: startedAt.current });
    } catch {
      setStatus("failed");
      return;
    }
    setStatus("sent");
    requestAnimationFrame(() => successRef.current?.focus());
  }

  if (status === "sent") {
    const first = values.name.trim().split(" ")[0];
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="flex flex-col items-start py-4 outline-none">
        <span className="grid size-14 place-items-center rounded-full bg-success/10 text-success">
          <CheckCircle2 size={28} aria-hidden="true" />
        </span>
        <h3 id={heading ? titleId : undefined} className="mt-5 text-3xl text-ink">
          {isAppt ? "Request sent. Thank you!" : "Message sent. Thank you!"}
        </h3>
        <p className="mt-2 text-muted">
          {isAppt
            ? `Thanks, ${first}. ${practiceName} will call or text you soon to confirm a time.`
            : `Thanks, ${first}. Someone from ${practiceName} will get back to you within one business day.`}
        </p>
        {!contactIsLive && (
          <p className="mt-4 rounded-xl bg-accent-soft px-4 py-3 text-sm text-ink">Demo note: this form is a preview and nothing was sent.</p>
        )}
        <button
          type="button"
          className="btn btn-glass mt-6"
          onClick={() => {
            setValues(empty);
            setStatus("idle");
          }}
        >
          Send another
        </button>
      </div>
    );
  }

  const text = (
    k: "name" | "phone" | "email" | "insurance",
    label: string,
    opts: { type?: string; auto?: string; optional?: boolean; max: number },
  ) => {
    const id = `${uid}-${k}`;
    const err = k === "insurance" ? undefined : errors[k];
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block font-semibold text-ink">
          {label} {opts.optional ? <span className="font-normal text-muted">(optional)</span> : <span className="text-danger" aria-hidden="true">*</span>}
        </label>
        <input
          id={id}
          name={k}
          type={opts.type ?? "text"}
          autoComplete={opts.auto}
          maxLength={opts.max}
          value={values[k]}
          onChange={(e) => update(k, e.target.value)}
          aria-invalid={!!err}
          aria-required={!opts.optional}
          aria-describedby={err ? `${id}-err` : undefined}
          className={inputCls(err)}
        />
        {err && (
          <p id={`${id}-err`} className="mt-1.5 text-sm font-medium text-danger">
            {err}
          </p>
        )}
      </div>
    );
  };

  const errorCount = Object.values(errors).filter(Boolean).length;
  const reasonId = `${uid}-reason`;
  const messageId = `${uid}-message`;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-labelledby={titleId} aria-describedby={`${uid}-note`}>
      {/* mr-10 keeps clear of the pop-up's close button. */}
      <div role="group" aria-label="What would you like to send?" className="mr-10 inline-flex gap-1 rounded-full bg-ink/5 p-1">
        {(
          [
            ["appointment", "Appointment"],
            ["question", "Question"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            aria-pressed={values.kind === k}
            onClick={() => setKind(k)}
            className={cx(
              "min-h-10 rounded-full px-4 text-sm font-semibold transition",
              values.kind === k ? "bg-ink text-bg" : "text-ink hover:bg-ink/10",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {heading && (
        <h3 id={titleId} className="mt-5 text-[1.85rem] leading-tight text-ink">
          {isAppt ? "Request an appointment" : "Ask us a question"}
        </h3>
      )}
      <p id={`${uid}-note`} className={cx("text-muted", heading ? "mt-1" : "mt-4")}>
        {isAppt
          ? "Tell us what works for you and we’ll call or text to confirm a time. "
          : "We usually reply within one business day. "}
        Please don’t include medical details or insurance numbers.
      </p>
      <div aria-live="assertive" className="sr-only">
        {errorCount > 0 ? `${errorCount} field${errorCount > 1 ? "s need" : " needs"} attention.` : ""}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">{text("name", "Name", { auto: "name", max: LIMITS.name })}</div>
        {text("phone", "Phone", { type: "tel", auto: "tel", optional: !isAppt, max: LIMITS.phone })}
        {text("email", "Email", { type: "email", auto: "email", max: LIMITS.email })}

        {isAppt && (
          <>
            <fieldset className="sm:col-span-2">
              <legend className="mb-1.5 font-semibold text-ink">Have you visited us before?</legend>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["new", "I’m a new patient"],
                    ["returning", "I’ve been here before"],
                  ] as const
                ).map(([k, label]) => (
                  <label key={k} className={chipCls}>
                    <input
                      type="radio"
                      name="patientType"
                      value={k}
                      checked={values.patientType === k}
                      onChange={() => update("patientType", k)}
                      className="sr-only"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="sm:col-span-2">
              <label htmlFor={reasonId} className="mb-1.5 block font-semibold text-ink">
                Reason for your visit <span className="text-danger" aria-hidden="true">*</span>
              </label>
              <select
                id={reasonId}
                name="reason"
                value={values.reason}
                onChange={(e) => update("reason", e.target.value)}
                aria-invalid={!!errors.reason}
                aria-required
                aria-describedby={errors.reason ? `${reasonId}-err` : undefined}
                className={inputCls(errors.reason)}
              >
                <option value="">Choose one</option>
                {services.map((s) => (
                  <option key={s.id}>{s.name}</option>
                ))}
                <option>{OTHER_REASON}</option>
              </select>
              {errors.reason && (
                <p id={`${reasonId}-err`} className="mt-1.5 text-sm font-medium text-danger">
                  {errors.reason}
                </p>
              )}
            </div>

            <fieldset className="sm:col-span-2">
              <legend className="mb-1.5 font-semibold text-ink">
                Best days for you <span className="font-normal text-muted">(optional)</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {DAY_ORDER.filter((d) => openDays.includes(d)).map((d) => (
                  <label key={d} className={chipCls}>
                    <input type="checkbox" checked={values.days.includes(d)} onChange={() => toggleDay(d)} className="sr-only" />
                    {DAY_LABELS[d]}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="sm:col-span-2">
              <legend className="mb-1.5 font-semibold text-ink">
                Best time of day <span className="font-normal text-muted">(optional)</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {TIMES_OF_DAY.map((t) => (
                  <label key={t} className={chipCls}>
                    <input
                      type="radio"
                      name="time"
                      value={t}
                      checked={values.time === t}
                      onChange={() => update("time", t)}
                      className="sr-only"
                    />
                    {t}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="sm:col-span-2">{text("insurance", "Insurance provider", { optional: true, max: LIMITS.insurance })}</div>
          </>
        )}

        <div className="sm:col-span-2">
          <label htmlFor={messageId} className="mb-1.5 block font-semibold text-ink">
            {isAppt ? "Anything else we should know?" : "How can we help?"}{" "}
            {isAppt ? <span className="font-normal text-muted">(optional)</span> : <span className="text-danger" aria-hidden="true">*</span>}
          </label>
          <textarea
            id={messageId}
            name="message"
            rows={isAppt ? 3 : 4}
            maxLength={LIMITS.message}
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            aria-invalid={!!errors.message}
            aria-required={!isAppt}
            aria-describedby={errors.message ? `${messageId}-err` : undefined}
            className={cx(inputCls(errors.message), "py-3")}
          />
          {errors.message && (
            <p id={`${messageId}-err`} className="mt-1.5 text-sm font-medium text-danger">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      {/* Honeypot: hidden from people and screen readers; bots that fill it are ignored by the server. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Company
          <input tabIndex={-1} autoComplete="off" name="company" value={company} onChange={(e) => setCompany(e.target.value)} />
        </label>
      </div>
      {status === "failed" && (
        <p role="alert" className="mt-4 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">
          Sorry, that didn’t go through. Please try again, or call us instead.
        </p>
      )}
      <button type="submit" className="btn btn-primary mt-6 w-full sm:w-auto" disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Sending…
          </>
        ) : (
          <>
            {isAppt ? "Send request" : "Send message"} <Send size={17} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
