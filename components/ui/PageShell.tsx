import office from "@/config/office";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { Logo } from "@/components/ui/Logo";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { MobileBar } from "@/components/sections/MobileBar";
import { EmergencyDialog } from "@/components/sections/EmergencyDialog";
import { withBase } from "@/lib/format";

/**
 * Frame for the site's inner pages (a doctor, a service, the team, billing…): the same top bar,
 * footer, sticky phone bar and emergency pop-up as the home page, with the menu pointing back to
 * the home page's sections.
 */
export function PageShell({ children }: { children: React.ReactNode }) {
  const home = (hash: string) => withBase(`/${hash}`);
  const has = (id: string) => office.sections.includes(id as (typeof office.sections)[number]);
  const links = [
    { href: office.catalog ? withBase("/services/") : home("#services"), label: "Services" },
    ...(has("reviews") ? [{ href: home("#reviews"), label: "Reviews" }] : []),
    ...(has("doctors") ? [{ href: home("#doctors"), label: "Our Team" }] : []),
    { href: home("#new-patients"), label: office.terms.newCustomersNav },
    ...(has("faq") ? [{ href: home("#faq"), label: "FAQ" }] : []),
    ...(office.terms.emergency ? [{ href: "#emergency", label: office.terms.emergency, mobileOnly: true, urgent: true }] : []),
  ];
  return (
    <BookingProvider settings={{ url: office.booking.url, requestLabel: office.terms.request, emergency: office.terms.emergency }}>
      <Nav logo={<Logo practice={office.practice} />} practiceName={office.practice.name} phone={office.contact.phone} links={links} />
      <main id="main" className="px-4 pb-16 pt-5 sm:px-6 sm:pt-10">
        {children}
      </main>
      <Footer office={office} />
      <MobileBar phone={office.contact.phone} label={office.terms.requestShort} />
      {office.terms.emergency && <EmergencyDialog headline={office.copy.emergencyHeadline} text={office.copy.emergencyText} warning={office.terms.emergencyWarning} locations={office.locations} />}
      <RevealObserver />
    </BookingProvider>
  );
}

/** A content page's text blocks (headings, paragraphs, bullet lists) in the site's style. */
export function ContentBlocks({ blocks }: { blocks: [string, string][] }) {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const [kind, text] = blocks[i];
    if (kind === "li") {
      const items: string[] = [];
      while (i < blocks.length && blocks[i][0] === "li") items.push(blocks[i++][1]);
      i--;
      out.push(
        <ul key={i} className="grid gap-2 pl-1">
          {items.map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span>{t}</span>
            </li>
          ))}
        </ul>,
      );
    } else if (kind === "h") {
      out.push(
        <h2 key={i} className="mt-4 text-[1.6rem] leading-tight text-ink">
          {text}
        </h2>,
      );
    } else {
      out.push(<p key={i}>{text}</p>);
    }
  }
  return <div className="grid gap-4 text-[1.075rem] leading-relaxed text-muted">{out}</div>;
}
