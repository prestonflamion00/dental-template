import type { OfficeConfig } from "@/config/types";
import { openingHoursSpecification } from "./hours";
import { telHref } from "./format";

/** schema.org Dentist markup for local SEO (rendered as JSON-LD in <head>). */
export function dentistJsonLd(o: OfficeConfig) {
  const a = o.contact.address;
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${o.seo.siteUrl}/#dentist`,
    name: o.practice.name,
    description: o.practice.description,
    url: o.seo.siteUrl,
    image: `${o.seo.siteUrl}/opengraph-image`,
    telephone: telHref(o.contact.phone).replace("tel:", ""),
    email: o.contact.email,
    priceRange: o.seo.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: a.street,
      addressLocality: a.city,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    ...(o.contact.geo
      ? { geo: { "@type": "GeoCoordinates", latitude: o.contact.geo.lat, longitude: o.contact.geo.lng } }
      : {}),
    openingHoursSpecification: openingHoursSpecification(o.hours),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: o.rating.value,
      reviewCount: o.rating.count,
      bestRating: 5,
    },
    employee: o.doctors.map((d) => ({ "@type": "Person", name: d.name, jobTitle: d.title, honorificSuffix: d.credentials })),
    availableService: o.services.map((s) => ({ "@type": "MedicalProcedure", name: s.name, description: s.short })),
    sameAs: Object.values(o.social).filter(Boolean),
    isAcceptingNewPatients: o.practice.acceptingNewPatients,
  };
}
