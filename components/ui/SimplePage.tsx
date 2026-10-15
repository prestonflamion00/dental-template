import { ArrowLeft } from "lucide-react";
import office from "@/config/office";
import { Logo } from "./Logo";
import { Footer } from "@/components/sections/Footer";
import { withBase } from "@/lib/format";

/** Shell for secondary pages (privacy, accessibility). */
export function SimplePage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <header className="px-3 pt-3 sm:px-5 sm:pt-4">
        <div className="glass-strong mx-auto flex max-w-6xl items-center justify-between rounded-[24px] px-5 py-2.5">
          <a href={withBase("/")}>
            <Logo practice={office.practice} />
          </a>
          <a href={withBase("/")} className="btn btn-glass">
            <ArrowLeft size={18} aria-hidden="true" /> Home
          </a>
        </div>
      </header>
      <main id="main" className="px-4 py-14 sm:px-6 sm:py-20">
        <article className="glass mx-auto max-w-3xl rounded-[28px] p-7 sm:p-12 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:text-ink [&_p]:mt-3 [&_p]:text-muted [&_li]:text-muted [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
          <h1 className="text-4xl text-ink sm:text-5xl">{title}</h1>
          {children}
        </article>
      </main>
      <Footer office={office} />
    </>
  );
}
