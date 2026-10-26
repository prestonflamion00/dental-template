"use client";

/**
 * Contact form with client-side validation and a success state.
 * Sends through `sendContactMessage` in lib/integrations.ts: emailed to the practice by
 * worker/contact.ts when NEXT_PUBLIC_CONTACT_ENDPOINT is set, otherwise a mock (demos).
 */

import { useEffect, useId, useRef, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { contactIsLive, sendContactMessage } from "@/lib/integrations";
import { CONTACT_TOPICS, type ContactTopic } from "@/lib/contact-topics";
import { parsePhone } from "@/lib/phone";
import { cx } from "@/lib/format";

type Values = { name: string; email: string; phone: string; topic: ContactTopic | ""; message: string };
type Errors = Partial<Record<keyof Values, string>>;

export function validateContact(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please tell us your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Please enter a valid email so we can reply.";
  if (v.phone.trim() && !parsePhone(v.phone).ok)
    e.phone = "Please check your phone number. Outside the US, start with + and your country code.";
  if (!v.topic) e.topic = "Please choose what your message is about.";
  if (v.message.trim().length < 10) e.message = "Please add a little more detail (at least 10 characters).";
  return e;
}

export function ContactForm({ practiceName }: { practiceName: string }) {
  const uid = useId();
  const empty: Values = { name: "", email: "", phone: "", topic: "", message: "" };
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  // Bot traps (checked by the server): when the form appeared, and a hidden field people never fill.
  const startedAt = useRef(0);
  const [company, setCompany] = useState("");
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateContact(values);
    setErrors(errs);
    const first = (Object.keys(errs) as (keyof Values)[]).find((k) => errs[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      await sendContactMessage({ ...values, topic: values.topic as ContactTopic, company, startedAt: startedAt.current });
    } catch {
      setStatus("failed");
      return;
    }
    setStatus("sent");
    requestAnimationFrame(() => successRef.current?.focus());
  }

  if (status === "sent") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="flex h-full flex-col items-start justify-center py-6 outline-none">
        <span className="grid size-14 place-items-center rounded-full bg-success/10 text-success">
          <CheckCircle2 size={28} aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-3xl text-ink">Message sent. Thank you!</h3>
        <p className="mt-2 text-muted">
          Thanks, {values.name.split(" ")[0]}. Someone from {practiceName} will get back to you within one business day.
        </p>
        {!contactIsLive && (
          <p className="mt-4 rounded-xl bg-accent-soft px-4 py-3 text-sm text-ink">Demo note: this form is a mock and nothing was sent.</p>
        )}
        <button
          type="button"
          className="btn btn-glass mt-6"
          onClick={() => {
            setValues(empty);
            setStatus("idle");
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  const field = (k: keyof Values, label: string, opts: { type?: string; auto?: string; optional?: boolean; area?: boolean } = {}) => {
    const id = `${uid}-${k}`;
    const err = errors[k];
    const common = {
      id,
      name: k,
      value: values[k],
      onChange: set(k),
      "aria-invalid": !!err,
      "aria-describedby": err ? `${id}-err` : undefined,
      "aria-required": !opts.optional,
      className: cx(
        "w-full rounded-2xl border bg-white/85 px-4 text-ink transition focus:bg-white",
        err ? "border-danger" : "border-ink/15",
        opts.area ? "py-3" : "min-h-12",
      ),
    };
    return (
      <div className={opts.area ? "sm:col-span-2" : undefined}>
        <label htmlFor={id} className="mb-1.5 block font-semibold text-ink">
          {label} {opts.optional ? <span className="font-normal text-muted">(optional)</span> : <span className="text-danger" aria-hidden="true">*</span>}
        </label>
        {opts.area ? <textarea rows={4} {...common} /> : <input type={opts.type ?? "text"} autoComplete={opts.auto} {...common} />}
        {err && (
          <p id={`${id}-err`} className="mt-1.5 text-sm font-medium text-danger">
            {err}
          </p>
        )}
      </div>
    );
  };

  const topicField = () => {
    const id = `${uid}-topic`;
    const err = errors.topic;
    return (
      <>
        <label htmlFor={id} className="mb-1.5 block font-semibold text-ink">
          What’s this about? <span className="text-danger" aria-hidden="true">*</span>
        </label>
        <select
          id={id}
          name="topic"
          value={values.topic}
          onChange={set("topic")}
          aria-invalid={!!err}
          aria-describedby={err ? `${id}-err` : undefined}
          aria-required
          className={cx(
            "min-h-12 w-full rounded-2xl border bg-white/85 px-4 text-ink transition focus:bg-white",
            err ? "border-danger" : "border-ink/15",
          )}
        >
          <option value="">Choose one</option>
          {CONTACT_TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        {err && (
          <p id={`${id}-err`} className="mt-1.5 text-sm font-medium text-danger">
            {err}
          </p>
        )}
      </>
    );
  };

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-describedby={`${uid}-note`}>
      <h3 className="text-[1.85rem] text-ink">Send us a message</h3>
      <p id={`${uid}-note`} className="mt-1 text-muted">
        We usually reply within one business day. Please don’t include medical details, symptoms or insurance numbers.
      </p>
      <div aria-live="assertive" className="sr-only">
        {errorCount > 0 ? `${errorCount} field${errorCount > 1 ? "s need" : " needs"} attention.` : ""}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {field("name", "Name", { auto: "name" })}
        {field("email", "Email", { type: "email", auto: "email" })}
        <div className="sm:col-span-2">{field("phone", "Phone", { type: "tel", auto: "tel", optional: true })}</div>
        <div className="sm:col-span-2">{topicField()}</div>
        {field("message", "How can we help?", { area: true })}
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
          Sorry, your message didn’t go through. Please try again, or call us instead.
        </p>
      )}
      <button type="submit" className="btn btn-primary mt-6 w-full sm:w-auto" disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Sending…
          </>
        ) : (
          <>
            Send message <Send size={17} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
