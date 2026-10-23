export const locales = ["ro", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ro";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** Builds a URL for a locale. Romanian is served without a prefix. */
export function localizedPath(locale: Locale, path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** BCP 47 tags for `Intl` formatting. */
export const intlLocales: Record<Locale, string> = { ro: "ro-RO", en: "en-GB" };
