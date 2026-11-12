import type { OfficeConfig } from "@/config/types";
import { openingHoursSpecification } from "./hours";
import { telHref } from "./format";

/** schema.org markup for local SEO (rendered as JSON-LD in <head>): Dentist, Plumber, HVACBusiness... per office.terms. */
export function dentistJsonLd(o: OfficeConfig) {
  const a = o.contact.address;
  return {
    "@context": "https://schema.org",
    "@type": o.terms.schemaType,
    "@id": `${o.seo.siteUrl}/#business`,
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
    ...(o.rating
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: o.rating.value, reviewCount: o.rating.count, bestRating: 5 } }
      : {}),
    employee: o.doctors.map((d) => ({ "@type": "Person", name: d.name, jobTitle: d.title, honorificSuffix: d.credentials })),
    ...(o.terms.insurance
      ? { availableService: o.services.map((s) => ({ "@type": "MedicalProcedure", name: s.name, description: s.short })) }
      : { makesOffer: o.services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.name, description: s.short } })) }),
    sameAs: Object.values(o.social).filter(Boolean),
    ...(o.terms.insurance ? { isAcceptingNewPatients: o.practice.acceptingNewPatients } : {}),
    // Other offices, each with its own address, phone and hours.
    ...(o.locations.length > 1
      ? {
          department: o.locations.slice(1).map((l) => ({
            "@type": o.terms.schemaType,
            name: `${o.practice.name}, ${l.name}`,
            telephone: telHref(l.phone).replace("tel:", ""),
            address: {
              "@type": "PostalAddress",
              streetAddress: l.address.street,
              addressLocality: l.address.city,
              addressRegion: l.address.region,
              postalCode: l.address.postalCode,
              addressCountry: l.address.country,
            },
            openingHoursSpecification: openingHoursSpecification(l.hours),
          })),
        }
      : {}),
  };
}
