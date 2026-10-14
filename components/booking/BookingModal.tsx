"use client";

/**
 * Booking flow MOCK: service → date & time → details → confirmation.
 *
 * INTEGRATION POINT: availability and submission go through
 * `getAvailableSlots` and `submitBooking` in lib/integrations.ts. Swap those
 * for your scheduling provider (NexHealth, LocalMed, Zocdoc, Open Dental…),
 * or set `booking.url` in the office config to link out to a hosted scheduler.
 */

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarCheck, Check, Clock, Loader2, Phone } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Icon } from "@/components/ui/Icon";
import { getAvailableSlots, submitBooking, type Slot } from "@/lib/integrations";
import { dayFromDate } from "@/lib/hours";
import { cx, telHref } from "@/lib/format";
import type { BookingSettings } from "./BookingProvider";

type Step = 0 | 1 | 2 | 3;
const STEP_TITLES = ["Choose a visit", "Pick a time", "Your details", "You’re all set"];

interface Details {
  name: string;
  phone: string;
  email: string;
  patientType: "new" | "existing";
  notes: string;
}
type Errors = Partial<Record<"name" | "phone" | "email", string>>;

export function validateDetails(d: Details): Errors {
  const e: Errors = {};
  if (d.name.trim().length < 2) e.name = "Please enter your full name.";
  if (d.phone.replace(/\D/g, "").length < 10) e.phone = "Please enter a 10-digit phone number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = "Please enter a valid email address.";
  return e;
}

function nextDays(n: number): Date[] {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 1; i <= n; i++) out.push(new Date(d.getFullYear(), d.getMonth(), d.getDate() + i));
  return out;
}

export function BookingModal({
  open,
  onClose,
  initialServiceId,
  settings,
}: {
  open: boolean;
  onClose: () => void;
  initialServiceId?: string;
  settings: BookingSettings;
}) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const [step, setStep] = useState<Step>(initialServiceId ? 1 : 0);
  const [serviceId, setServiceId] = useState(initialServiceId ?? "");
  const days = useMemo(() => nextDays(21), []);
  const firstOpen = days.find((d) => settings.hours[dayFromDate(d)]) ?? days[0];
  const [date, setDate] = useState<Date>(firstOpen);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slotId, setSlotId] = useState("");
  const [details, setDetails] = useState<Details>({ name: "", phone: "", email: "", patientType: "new", notes: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const service = settings.services.find((s) => s.id === serviceId);
  const slot = slots?.find((s) => s.id === slotId);

  // Load fake availability whenever the date or service changes.
  useEffect(() => {
    if (step !== 1 || !serviceId) return;
    let live = true;
    setSlots(null);
    getAvailableSlots(date, settings.hours, settings.slotMinutes, serviceId).then((s) => live && setSlots(s));
    return () => {
      live = false;
    };
  }, [date, serviceId, step, settings.hours, settings.slotMinutes]);

  // Move focus to the step heading so screen readers announce progress.
  useEffect(() => {
    if (open) headingRef.current?.focus();
  }, [step, open]);

  const go = (s: Step) => setStep(s);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateDetails(details);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      formRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSubmitting(true);
    const res = await submitBooking({
      serviceId,
      serviceName: service?.name ?? "",
      slotId,
      name: details.name,
      phone: details.phone,
      email: details.email,
      patientType: details.patientType,
      notes: details.notes,
    });
    setSubmitting(false);
    setConfirmation(res.confirmation);
    go(3);
  }

  const dateLabel = (d: Date, opts: Intl.DateTimeFormatOptions) => d.toLocaleDateString("en-US", opts);

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} wide>
      <div className="p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:p-9">
        {/* Progress */}
        {step < 3 && (
          <div className="mb-6 pr-12">
            <p className="text-sm font-semibold text-muted">Step {step + 1} of 3</p>
            <div className="mt-2 flex gap-1.5" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={cx("h-1.5 flex-1 rounded-full transition-colors duration-300", i <= step ? "bg-accent" : "bg-ink/10")}
                />
              ))}
            </div>
          </div>
        )}

        <h2 id={titleId} ref={headingRef} tabIndex={-1} className="text-3xl text-ink outline-none sm:text-4xl">
          {STEP_TITLES[step]}
        </h2>

        {/* ── Step 1: service ── */}
        {step === 0 && (
          <fieldset className="mt-6">
            <legend className="mb-4 text-muted">What would you like to come in for?</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {settings.services.map((s) => (
                <label
                  key={s.id}
                  className={cx(
                    "flex cursor-pointer items-start gap-3 rounded-2xl border bg-white/70 p-4 transition has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                    serviceId === s.id ? "border-accent ring-1 ring-accent" : "border-white hover:bg-white",
                  )}
                >
                  <input
                    type="radio"
                    name="service"
                    value={s.id}
                    checked={serviceId === s.id}
                    onChange={() => setServiceId(s.id)}
                    className="sr-only"
                  />
                  <span className="icon-tile !size-10 shrink-0 !rounded-xl">
                    <Icon name={s.icon} size={20} />
                  </span>
                  <span>
                    <span className="block font-semibold leading-snug text-ink">{s.name}</span>
                    {s.durationMin && <span className="text-sm text-muted">About {s.durationMin} min</span>}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-7 flex justify-end">
              <button type="button" className="btn btn-primary" disabled={!serviceId} onClick={() => go(1)}>
                Continue <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </fieldset>
        )}

        {/* ── Step 2: date & time ── */}
        {step === 1 && (
          <div className="mt-6">
            {service && (
              <p className="mb-5 text-muted">
                <span className="font-semibold text-ink">{service.name}</span>
                {service.durationMin ? ` · about ${service.durationMin} minutes` : ""}
              </p>
            )}
            <fieldset>
              <legend className="mb-3 font-semibold text-ink">Date</legend>
              <div className="snap-row -mx-2 flex gap-2 overflow-x-auto px-2 pb-2">
                {days.map((d) => {
                  const closed = !settings.hours[dayFromDate(d)];
                  const selected = d.getTime() === date.getTime();
                  return (
                    <button
                      key={d.toISOString()}
                      type="button"
                      disabled={closed}
                      aria-pressed={selected}
                      aria-label={`${dateLabel(d, { weekday: "long", month: "long", day: "numeric" })}${closed ? ", closed" : ""}`}
                      onClick={() => {
                        setDate(d);
                        setSlotId("");
                      }}
                      className={cx(
                        "flex min-h-[76px] w-[64px] shrink-0 flex-col items-center justify-center rounded-2xl border text-center transition",
                        selected
                          ? "border-transparent bg-accent text-white shadow-lg"
                          : closed
                            ? "cursor-not-allowed border-transparent bg-white/30 text-muted line-through decoration-1"
                            : "border-white bg-white/70 text-ink hover:bg-white",
                      )}
                    >
                      <span className="text-xs font-semibold uppercase tracking-wide">{dateLabel(d, { weekday: "short" })}</span>
                      <span className="text-xl font-semibold">{d.getDate()}</span>
                      <span className="text-xs">{dateLabel(d, { month: "short" })}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-5">
              <legend className="mb-3 font-semibold text-ink">
                Available times on {dateLabel(date, { weekday: "long", month: "long", day: "numeric" })}
              </legend>
              <div aria-live="polite" aria-busy={slots === null}>
                {slots === null ? (
                  <p className="flex items-center gap-2 py-6 text-muted">
                    <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Checking availability…
                  </p>
                ) : slots.filter((s) => s.available).length === 0 ? (
                  <p className="py-4 text-muted">No openings this day. Please try another date.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots
                      .filter((s) => s.available)
                      .map((s) => (
                        <label
                          key={s.id}
                          className={cx(
                            "flex min-h-12 cursor-pointer items-center justify-center rounded-xl border text-[0.95rem] font-semibold transition has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                            slotId === s.id ? "border-transparent bg-accent text-white" : "border-white bg-white/70 text-ink hover:bg-white",
                          )}
                        >
                          <input
                            type="radio"
                            name="slot"
                            value={s.id}
                            checked={slotId === s.id}
                            onChange={() => setSlotId(s.id)}
                            className="sr-only"
                          />
                          {s.label}
                        </label>
                      ))}
                  </div>
                )}
              </div>
            </fieldset>

            <div className="mt-7 flex items-center justify-between gap-3">
              <button type="button" className="btn btn-glass" onClick={() => go(0)}>
                <ArrowLeft size={18} aria-hidden="true" /> Back
              </button>
              <button type="button" className="btn btn-primary" disabled={!slotId} onClick={() => go(2)}>
                Continue <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: details ── */}
        {step === 2 && (
          <form ref={formRef} className="mt-6" onSubmit={handleSubmit} noValidate>
            <p className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
              <span className="font-semibold text-ink">{service?.name}</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={16} aria-hidden="true" />
                {dateLabel(date, { weekday: "short", month: "short", day: "numeric" })}, {slot?.label}
              </span>
            </p>

            <fieldset className="mb-5">
              <legend className="mb-2 font-semibold text-ink">Have you visited us before?</legend>
              <div className="inline-grid grid-cols-2 rounded-full bg-ink/5 p-1">
                {(["new", "existing"] as const).map((t) => (
                  <label
                    key={t}
                    className={cx(
                      "flex min-h-11 cursor-pointer items-center justify-center rounded-full px-5 text-[0.95rem] font-semibold transition has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-accent",
                      details.patientType === t ? "bg-white text-ink shadow" : "text-muted",
                    )}
                  >
                    <input
                      type="radio"
                      name="patientType"
                      value={t}
                      checked={details.patientType === t}
                      onChange={() => setDetails({ ...details, patientType: t })}
                      className="sr-only"
                    />
                    {t === "new" ? "I’m new" : "Returning patient"}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field id={`${uid}-name`} name="name" label="Full name" autoComplete="name" value={details.name} error={errors.name}
                onChange={(v) => setDetails({ ...details, name: v })} className="sm:col-span-2" />
              <Field id={`${uid}-phone`} name="phone" label="Mobile phone" type="tel" autoComplete="tel" value={details.phone} error={errors.phone}
                onChange={(v) => setDetails({ ...details, phone: v })} />
              <Field id={`${uid}-email`} name="email" label="Email" type="email" autoComplete="email" value={details.email} error={errors.email}
                onChange={(v) => setDetails({ ...details, email: v })} />
              <div className="sm:col-span-2">
                <label htmlFor={`${uid}-notes`} className="mb-1.5 block font-semibold text-ink">
                  Anything we should know? <span className="font-normal text-muted">(optional)</span>
                </label>
                <textarea
                  id={`${uid}-notes`}
                  rows={3}
                  value={details.notes}
                  onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                  placeholder="Worries, accessibility needs, insurance…"
                  className="w-full rounded-2xl border border-ink/15 bg-white/85 px-4 py-3 text-ink placeholder:text-muted"
                />
                <p className="mt-1.5 text-sm text-muted">Please don’t include detailed medical history here.</p>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between gap-3">
              <button type="button" className="btn btn-glass" onClick={() => go(1)}>
                <ArrowLeft size={18} aria-hidden="true" /> Back
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Booking…
                  </>
                ) : (
                  <>
                    Request appointment <Check size={18} aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ── Confirmation ── */}
        {step === 3 && (
          <div className="mt-4" role="status">
            <div className="mb-5 grid size-16 place-items-center rounded-full bg-success/10 text-success">
              <CalendarCheck size={30} aria-hidden="true" />
            </div>
            <p className="text-lg text-ink">
              Thanks, {details.name.split(" ")[0]}! We’ve received your request for{" "}
              <strong>{service?.name}</strong> on{" "}
              <strong>
                {dateLabel(date, { weekday: "long", month: "long", day: "numeric" })} at {slot?.label}
              </strong>
              .
            </p>
            <p className="mt-3 text-muted">
              {settings.practiceName} will confirm by text or email shortly
              {details.patientType === "new" ? ", along with your new patient forms" : ""}. Need to change something? Just call us.
            </p>
            <dl className="mt-6 grid gap-3 rounded-2xl bg-white/70 p-4 text-[0.95rem] sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted">Confirmation</dt>
                <dd className="font-semibold text-ink">{confirmation}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Phone</dt>
                <dd>
                  <a href={telHref(settings.phone)} className="inline-flex items-center gap-1.5 font-semibold text-accent underline-offset-4 hover:underline">
                    <Phone size={16} aria-hidden="true" />
                    {settings.phone}
                  </a>
                </dd>
              </div>
            </dl>
            <p className="mt-4 rounded-xl bg-accent-soft px-4 py-3 text-sm text-ink">
              Demo note: this is a mock. No appointment was created. See <code>lib/integrations.ts</code>.
            </p>
            <div className="mt-7 flex justify-end">
              <button type="button" className="btn btn-primary" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

function Field({
  id,
  name,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  className,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block font-semibold text-ink">
        {label} <span className="text-danger" aria-hidden="true">*</span>
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={value}
        required
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cx(
          "min-h-12 w-full rounded-2xl border bg-white/85 px-4 text-ink",
          error ? "border-danger" : "border-ink/15",
        )}
      />
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
