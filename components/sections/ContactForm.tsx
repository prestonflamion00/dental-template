"use client";

/**
 * Contact form MOCK with client-side validation and a success state.
 * INTEGRATION POINT: `sendContactMessage` in lib/integrations.ts
 * (Formspree / Netlify Forms / a Resend-backed server route).
 */

import { useId, useRef, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { sendContactMessage } from "@/lib/integrations";
import { cx } from "@/lib/format";

type Values = { name: string; email: string; phone: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

export function validateContact(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please tell us your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Please enter a valid email so we can reply.";
  if (v.phone && v.phone.replace(/\D/g, "").length < 10) e.phone = "Please enter a 10-digit phone number, or leave it blank.";
  if (v.message.trim().length < 10) e.message = "Please add a little more detail (at least 10 characters).";
  return e;
}

export function ContactForm({ practiceName }: { practiceName: string }) {
  const uid = useId();
  const [values, setValues] = useState<Values>({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    await sendContactMessage(values);
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
        <p className="mt-4 rounded-xl bg-accent-soft px-4 py-3 text-sm text-ink">Demo note: this form is a mock and nothing was sent.</p>
        <button
          type="button"
          className="btn btn-glass mt-6"
          onClick={() => {
            setValues({ name: "", email: "", phone: "", message: "" });
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

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-describedby={`${uid}-note`}>
      <h3 className="text-[1.85rem] text-ink">Send us a message</h3>
      <p id={`${uid}-note`} className="mt-1 text-muted">
        We usually reply within one business day. Please don’t share medical details here.
      </p>
      <div aria-live="assertive" className="sr-only">
        {errorCount > 0 ? `${errorCount} field${errorCount > 1 ? "s need" : " needs"} attention.` : ""}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {field("name", "Name", { auto: "name" })}
        {field("email", "Email", { type: "email", auto: "email" })}
        <div className="sm:col-span-2">{field("phone", "Phone", { type: "tel", auto: "tel", optional: true })}</div>
        {field("message", "How can we help?", { area: true })}
      </div>
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
