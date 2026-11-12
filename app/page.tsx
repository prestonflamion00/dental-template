import { Fragment } from "react";
import office from "@/config/office";
import type { SectionId } from "@/config/types";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { Logo } from "@/components/ui/Logo";
import { Section } from "@/components/ui/Section";
import { SampleTag } from "@/components/ui/SampleTag";
import { MobileReveal } from "@/components/ui/MobileReveal";
import { DemoThemeSwitcher } from "@/components/ui/DemoThemeSwitcher";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { QuickInfo } from "@/components/sections/QuickInfo";
import { RequestSection } from "@/components/sections/RequestSection";
import { ServicesGrid } from "@/components/sections/Services";
import { CatalogList } from "@/components/sections/CatalogList";
import { NewPatients } from "@/components/sections/NewPatients";
import { Doctors } from "@/components/sections/Doctors";
import { Reviews } from "@/components/sections/Reviews";
import { GalleryGrid } from "@/components/sections/Gallery";
import { VideoTour } from "@/components/sections/VideoTour";
import { FaqList } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { MobileBar } from "@/components/sections/MobileBar";
import { EmergencyDialog } from "@/components/sections/EmergencyDialog";

/** Each section id → its component. Order and visibility come from `office.sections`. */
const SECTIONS: Record<SectionId, () => React.ReactNode> = {
  hero: () => <Hero office={office} />,
  quickInfo: () => <QuickInfo office={office} />,
  request: () => <RequestSection office={office} />,
  services: () => (
    <Section
      id="services"
      eyebrow="Services"
      title={
        <>
          {office.terms.servicesTitle}
          <SampleTag office={office} what="services" />
        </>
      }
      intro={office.copy.servicesIntro}
    >
      <ServicesGrid services={office.services} phone={office.contact.phone} note={office.terms.servicesNote} />
      {office.catalog && <CatalogList categories={office.catalog} />}
    </Section>
  ),
  newPatients: () => <NewPatients office={office} />,
  doctors: () => <Doctors office={office} />,
  reviews: () => <Reviews office={office} />,
  gallery: () =>
    office.gallery?.length ? (
      <Section id="gallery" eyebrow={office.terms.galleryEyebrow} title="Before & after" intro={office.terms.galleryIntro}>
        {/* Phones: the gallery opens from a button, so it doesn't add screens of scrolling. */}
        <MobileReveal label={`See ${office.terms.galleryEyebrow.toLowerCase()}`} className="w-full">
          <GalleryGrid items={office.gallery} note={office.terms.galleryNote} />
        </MobileReveal>
      </Section>
    ) : null,
  video: () => <VideoTour office={office} />,
  faq: () => (
    <Section id="faq" eyebrow="FAQ" title="Questions? We’ve got answers" intro={office.copy.faqIntro}>
      <FaqList faqs={office.faqs} />
    </Section>
  ),
  contact: () => <Contact office={office} />,
};

const NAV_LINKS: Partial<Record<SectionId, { href: string; label: string; wideOnly?: boolean }>> = {
  services: { href: "#services", label: "Services" },
  newPatients: { href: "#new-patients", label: office.terms.newCustomersNav },
  doctors: { href: "#doctors", label: "Our Team" },
  video: { href: "#video", label: "Video", wideOnly: true },
  reviews: { href: "#reviews", label: "Reviews" },
  faq: { href: "#faq", label: "FAQ" },
  // On laptops the number and Request button in the bar cover "Contact"; the link returns on wide screens.
  contact: { href: "#contact", label: "Contact", wideOnly: true },
};

export default function Home() {
  const links = [
    ...office.sections.map((s) => NAV_LINKS[s]).filter((l): l is NonNullable<(typeof NAV_LINKS)[SectionId]> => !!l),
    ...(office.terms.emergency ? [{ href: "#emergency", label: office.terms.emergency, mobileOnly: true, urgent: true }] : []),
  ];

  return (
    <BookingProvider
      settings={{ url: office.booking.url, requestLabel: office.terms.request, emergency: office.terms.emergency }}
    >
      <Nav logo={<Logo practice={office.practice} />} practiceName={office.practice.name} phone={office.contact.phone} links={links} morph={office.nameMorph} />
      <main id="main">
        {office.sections.map((id) => (
          <Fragment key={id}>{SECTIONS[id]()}</Fragment>
        ))}
      </main>
      <Footer office={office} showContact={false} />
      <MobileBar phone={office.contact.phone} label={office.terms.requestShort} />
      {office.terms.emergency && <EmergencyDialog headline={office.copy.emergencyHeadline} text={office.copy.emergencyText} warning={office.terms.emergencyWarning} locations={office.locations} />}
      <RevealObserver />
      <DemoThemeSwitcher />
    </BookingProvider>
  );
}
