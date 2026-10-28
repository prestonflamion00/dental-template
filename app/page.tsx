import { Fragment } from "react";
import office from "@/config/office";
import type { SectionId } from "@/config/types";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { Logo } from "@/components/ui/Logo";
import { Section } from "@/components/ui/Section";
import { DemoThemeSwitcher } from "@/components/ui/DemoThemeSwitcher";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { QuickInfo } from "@/components/sections/QuickInfo";
import { RequestSection } from "@/components/sections/RequestSection";
import { ServicesGrid } from "@/components/sections/Services";
import { Emergency } from "@/components/sections/Emergency";
import { NewPatients } from "@/components/sections/NewPatients";
import { Doctors } from "@/components/sections/Doctors";
import { Cta } from "@/components/sections/Cta";
import { Reviews } from "@/components/sections/Reviews";
import { GalleryGrid } from "@/components/sections/Gallery";
import { FaqList } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { MobileBar } from "@/components/sections/MobileBar";
import { openDays } from "@/lib/hours";

/** Each section id → its component. Order and visibility come from `office.sections`. */
const SECTIONS: Record<SectionId, () => React.ReactNode> = {
  hero: () => <Hero office={office} />,
  quickInfo: () => <QuickInfo office={office} />,
  request: () => <RequestSection office={office} />,
  services: () => (
    <Section id="services" eyebrow="Services" title="Care for every smile" intro={office.copy.servicesIntro}>
      <ServicesGrid services={office.services} phone={office.contact.phone} />
    </Section>
  ),
  emergency: () => <Emergency office={office} />,
  newPatients: () => <NewPatients office={office} />,
  doctors: () => <Doctors office={office} />,
  cta: () => <Cta office={office} />,
  reviews: () => <Reviews office={office} />,
  gallery: () =>
    office.gallery?.length ? (
      <Section id="gallery" eyebrow="Smile gallery" title="Before & after" intro="Slide to compare. Every plan is designed around the person.">
        <GalleryGrid items={office.gallery} />
      </Section>
    ) : null,
  faq: () => (
    <Section id="faq" eyebrow="FAQ" title="Questions? We’ve got answers" intro={office.copy.faqIntro}>
      <FaqList faqs={office.faqs} />
    </Section>
  ),
  contact: () => <Contact office={office} />,
};

const NAV_LINKS: Partial<Record<SectionId, { href: string; label: string }>> = {
  services: { href: "#services", label: "Services" },
  newPatients: { href: "#new-patients", label: "New Patients" },
  doctors: { href: "#doctors", label: "Our Team" },
  reviews: { href: "#reviews", label: "Reviews" },
  faq: { href: "#faq", label: "FAQ" },
  contact: { href: "#contact", label: "Contact" },
};

export default function Home() {
  const links = office.sections.map((s) => NAV_LINKS[s]).filter((l): l is { href: string; label: string } => !!l);

  return (
    <BookingProvider
      settings={{
        practiceName: office.practice.name,
        services: office.services.map(({ id, name }) => ({ id, name })),
        openDays: openDays(office.hours),
        url: office.booking.url,
      }}
    >
      <Nav logo={<Logo practice={office.practice} />} practiceName={office.practice.name} phone={office.contact.phone} links={links} />
      <main id="main">
        {office.sections.map((id) => (
          <Fragment key={id}>{SECTIONS[id]()}</Fragment>
        ))}
      </main>
      <Footer office={office} />
      <MobileBar phone={office.contact.phone} />
      <RevealObserver />
      <DemoThemeSwitcher />
    </BookingProvider>
  );
}
