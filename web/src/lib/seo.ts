import type { Metadata } from "next";
import { defaultLocale, localizedPath, type Locale } from "@/i18n/config";

const ogLocales: Record<Locale, string> = { ro: "ro_RO", en: "en_GB" };

/** Every language's URL for a path, for hreflang links and the sitemap. */
export function languageAlternates(path: string) {
  return {
    ro: localizedPath("ro", path),
    en: localizedPath("en", path),
    "x-default": localizedPath(defaultLocale, path),
  };
}

/**
 * Canonical link, hreflang alternates and Open Graph for one page. `path` is
 * without the locale prefix ("/", "/atelier/mozaic"). Relative URLs resolve
 * against `metadataBase` from the root layout.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  siteName,
  image,
}: {
  locale: Locale;
  path: string;
  /** The full title, as it should appear when shared. */
  title: string;
  description: string;
  siteName: string;
  /** Defaults to the logo image (app/[lang]/opengraph-image). */
  image?: { url: string; width: number; height: number; alt: string };
}): Pick<Metadata, "alternates" | "openGraph" | "twitter"> {
  // Setting `openGraph` replaces the inherited one, image included, so every
  // page names its image explicitly.
  const images = [
    image ?? {
      url: localizedPath(locale, "/opengraph-image"),
      width: 1200,
      height: 630,
      alt: siteName,
    },
  ];
  return {
    alternates: {
      canonical: localizedPath(locale, path),
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      url: localizedPath(locale, path),
      siteName,
      title,
      description,
      locale: ogLocales[locale],
      alternateLocale: Object.entries(ogLocales)
        .filter(([key]) => key !== locale)
        .map(([, value]) => value),
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
