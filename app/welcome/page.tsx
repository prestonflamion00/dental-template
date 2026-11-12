import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Mail, Smartphone } from "lucide-react";
import office from "@/config/office";
import { WelcomeVideo } from "@/components/ui/WelcomeVideo";
import { withBase } from "@/lib/format";

/*
 * The private page we send a prospect (office.welcome): a 30-second walkthrough of the demo we
 * built from their site, a link to try it on their phone, their First Bite highlights and how to
 * reach us. Not linked from the site, and kept out of search.
 */
export const metadata: Metadata = {
  title: { absolute: `We built you something | butterbite digital` },
  robots: { index: false, follow: false },
};

export default function WelcomePage() {
  const w = office.welcome;
  if (!w) notFound();
  const s = w.snapshot;
  return (
    <main className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-4 py-10 sm:px-6 sm:py-16 [&>*]:min-w-0">
      <header className="grid gap-3 text-center">
        <p className="font-serif text-lg text-ink">butterbite digital</p>
        <h1 className="text-balance text-[2.3rem] leading-[1.08] text-ink sm:text-6xl">
          {w.greeting}, we built you a new website
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted">
          We rebuilt {office.practice.name}&rsquo;s site from what&rsquo;s on your current one, with your photos, your team
          and every service. Here&rsquo;s a quick look, then try it yourself.
        </p>
      </header>

      <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 [&>*]:min-w-0">
        <WelcomeVideo src={w.video} poster={w.poster} captions={w.captions} label={`A walkthrough of the new ${office.practice.name} website`} />
        <div className="grid grid-cols-1 gap-6">
          <div className="glass grid gap-4 rounded-[26px] p-6 sm:p-7">
            <h2 className="text-2xl text-ink">Try it on your phone</h2>
            <p className="text-muted">It&rsquo;s a private preview: only people with the link can see it, and it isn&rsquo;t on Google.</p>
            <a href={withBase("/")} className="btn btn-primary btn-lg w-full">
              <Smartphone size={18} aria-hidden="true" /> Open your new site
            </a>
          </div>
          {s && (
            <div className="glass grid gap-3 rounded-[26px] p-6 sm:p-7">
              <p className="eyebrow">Your current site today</p>
              <p className="font-serif text-ink">
                <span className="text-4xl">{s.score.toFixed(1)}</span>
                <span className="text-lg text-muted"> / 10 First Bite score · {s.band}</span>
              </p>
              <ul className="grid gap-2 text-[0.98rem]">
                {s.findings.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                    {f}
                  </li>
                ))}
              </ul>
              <a href={s.url} className="inline-flex items-center gap-1.5 font-bold text-accent" target="_blank" rel="noopener noreferrer">
                See the full one-page snapshot <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </section>

      {w.intro && (
        <section className="grid justify-items-center gap-4 text-center">
          <h2 className="text-3xl text-ink">A quick hello from Preston and Foster</h2>
          <video className="w-full max-w-3xl rounded-[26px] shadow-xl" src={withBase(w.intro.video)} poster={withBase(w.intro.poster)} controls playsInline preload="metadata" />
        </section>
      )}

      <section className="glass grid grid-cols-1 justify-items-center gap-3 rounded-[26px] p-6 text-center sm:p-10 [&>*]:max-w-full">
        <h2 className="text-3xl text-ink">Questions, or want to talk it through?</h2>
        <p className="max-w-xl text-muted">Reply to our message, or email us. No pressure: the preview is yours to look at either way.</p>
        <a href="mailto:hello@butterbitedigital.com" className="btn btn-glass btn-lg max-w-full whitespace-normal break-all max-sm:px-4 max-sm:text-[0.95rem]">
          <Mail size={18} aria-hidden="true" className="text-accent" /> hello@butterbitedigital.com
        </a>
      </section>
    </main>
  );
}
