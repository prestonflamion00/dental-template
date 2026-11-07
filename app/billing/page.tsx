import type { Metadata } from "next";
import { CreditCard, ExternalLink, Phone } from "lucide-react";
import office from "@/config/office";
import { PageShell } from "@/components/ui/PageShell";
import { telHref } from "@/lib/format";

export const metadata: Metadata = {
  title: `Payments & financing`,
  description: `Pay your bill online, accepted payment methods and financing options at ${office.practice.name}.`,
  alternates: { canonical: "/billing/" },
};

/** One page for everything about paying: bill pay, accepted payments and financing. */
export default function BillingPage() {
  const b = office.billing;
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl">
        <header className="text-center">
          <p className="eyebrow">Patients</p>
          <h1 className="mt-3 text-[2.6rem] leading-[1.05] text-ink sm:text-6xl">Payments & financing</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            {b?.intro ?? "Questions about a bill or your options? Give us a call and we’ll help."}
          </p>
        </header>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <section aria-labelledby="pay" className="glass flex flex-col rounded-[26px] p-6 sm:p-7">
            <span className="icon-tile" aria-hidden="true">
              <CreditCard size={22} />
            </span>
            <h2 id="pay" className="mt-4 text-2xl text-ink">
              Pay your bill
            </h2>
            <p className="mt-2 flex-1 text-muted">{b?.payUrl ? "Pay online by credit card in a minute, securely." : "Call us to pay by card over the phone."}</p>
            {b?.payUrl ? (
              <a href={b.payUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg mt-5 self-start">
                Pay online <ExternalLink size={17} aria-hidden="true" />
              </a>
            ) : (
              <a href={telHref(office.contact.phone)} className="btn btn-primary btn-lg mt-5 self-start">
                <Phone size={18} aria-hidden="true" /> {office.contact.phone}
              </a>
            )}
          </section>

          {b?.methods.length ? (
            <section aria-labelledby="methods" className="glass rounded-[26px] p-6 sm:p-7">
              <h2 id="methods" className="text-2xl text-ink">
                We gladly accept
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {b.methods.map((m) => (
                  <li key={m} className="rounded-full bg-accent-soft px-3.5 py-1.5 text-sm font-semibold text-ink">
                    {m}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[0.95rem] text-muted">We also accept most dental insurance plans.</p>
            </section>
          ) : null}
        </div>

        {b?.financing?.length ? (
          <section aria-labelledby="financing" className="mt-12">
            <h2 id="financing" className="text-center text-3xl text-ink sm:text-4xl">
              Financing
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-muted">
              Interest-deferred and low-interest options for qualified applicants, and payment plans to suit almost every budget.
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {b.financing.map((f) => (
                <li key={f.name}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="glass glass-hover flex h-full flex-col rounded-[22px] p-5">
                    <span className="text-xl font-semibold text-ink">{f.name}</span>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-accent">
                      Apply at {new URL(f.url).hostname.replace(/^www\./, "")} <ExternalLink size={14} aria-hidden="true" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="mt-12 text-center text-muted">
          Questions? Call us at{" "}
          <a href={telHref(office.contact.phone)} className="font-semibold text-ink underline decoration-ink/20 underline-offset-4">
            {office.contact.phone}
          </a>
          .
        </p>
      </div>
    </PageShell>
  );
}
