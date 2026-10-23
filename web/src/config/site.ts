import { localizedPath, type Locale } from "@/i18n/config";

/**
 * Anchors of the one-page sections. The header, the CTAs and the sections
 * themselves all link through these, so renaming one is a single change.
 */
export const sectionIds = {
  content: "continut",
  home: "acasa",
  poster: "afisier",
  rent: "inchiriaza",
  gift: "bilet",
  register: "condica",
  directions: "drum",
} as const;

export type SectionId = (typeof sectionIds)[keyof typeof sectionIds];

/** "#afisier", for links within the home page. */
export const anchor = (id: SectionId) => `#${id}`;

/** "/#afisier" or "/en#afisier", for links to a home section from any page. */
export const sectionHref = (locale: Locale, id: SectionId) =>
  `${localizedPath(locale)}${anchor(id)}`;

/** A workshop page, without the locale prefix: "/atelier/mozaic". */
export const workshopPath = (slug: string) => `/atelier/${slug}`;

/**
 * Query parameters that preselect a session on a workshop page:
 * "/atelier/mozaic?zi=2026-11-05&ora=19:30".
 */
export const bookingParams = { day: "zi", time: "ora" } as const;

export function bookingHref(
  locale: Locale,
  slug: string,
  session?: { date: string; time: string },
) {
  const path = localizedPath(locale, workshopPath(slug));
  if (!session) return path;
  const query = new URLSearchParams({
    [bookingParams.day]: session.date,
    [bookingParams.time]: session.time,
  });
  return `${path}?${query}`;
}

/** Sessions, dates and opening hours are all in Bucharest time. */
export const siteTimeZone = "Europe/Bucharest";

/** The city every address is in; shown after the street and sent to Maps. */
export const siteCity = "București";

/** Legal pages, without the locale prefix. The pages themselves come in step 7. */
export const legalPaths = {
  terms: "/termeni",
  privacy: "/confidentialitate",
  cancellation: "/anulare",
} as const;
