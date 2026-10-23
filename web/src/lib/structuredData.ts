import { siteCity } from "@/config/site";
import { absoluteUrl } from "@/config/siteUrl";
import type { SiteSettings, WorkshopDetail } from "@/data/types";
import { localizedPath, type Locale } from "@/i18n/config";
import { instagramHref } from "@/lib/links";

// schema.org data for the home page (the business) and the workshop pages
// (one Event per session). Only real details go in: empty settings are left
// out rather than sent as placeholders.

const businessId = () => `${absoluteUrl("/")}#business`;

function postalAddress(settings: SiteSettings) {
  return {
    "@type": "PostalAddress",
    ...(settings.address && { streetAddress: settings.address }),
    addressLocality: siteCity,
    addressCountry: "RO",
  };
}

export function localBusiness({
  locale,
  name,
  description,
  settings,
}: {
  locale: Locale;
  name: string;
  description: string;
  settings: SiteSettings;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": businessId(),
    name,
    description,
    url: absoluteUrl(localizedPath(locale)),
    image: absoluteUrl(localizedPath(locale, "/opengraph-image")),
    address: postalAddress(settings),
    ...(settings.email && { email: settings.email }),
    ...(settings.whatsapp && { telephone: settings.whatsapp }),
    ...(settings.instagram && { sameAs: [instagramHref(settings.instagram)] }),
  };
}

export function workshopEvents({
  workshop,
  url,
  businessName,
  settings,
}: {
  workshop: WorkshopDetail;
  /** The workshop page, absolute. */
  url: string;
  businessName: string;
  settings: SiteSettings;
}) {
  const hours = workshop.durationHours * 60 * 60 * 1000;
  return workshop.sessions.map((session) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${workshop.name}: ${workshop.verb}`,
    description: workshop.shortLine,
    startDate: session.startsAt,
    endDate: new Date(
      new Date(session.startsAt).getTime() + hours,
    ).toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: businessName,
      address: postalAddress(settings),
    },
    organizer: {
      "@type": "Organization",
      "@id": businessId(),
      name: businessName,
    },
    ...(workshop.photo && { image: [workshop.photo.src] }),
    url,
    ...(workshop.priceLei != null && {
      offers: {
        "@type": "Offer",
        price: workshop.priceLei,
        priceCurrency: "RON",
        url,
        availability: session.full
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      },
    }),
  }));
}
