import type { MetadataRoute } from "next";
import { workshopPath } from "@/config/site";
import { absoluteUrl } from "@/config/siteUrl";
import { getWorkshopSlugs } from "@/data/workshops";
import { locales } from "@/i18n/config";
import { languageAlternates } from "@/lib/seo";

// Every page in every language, each listing its translations. The legal
// pages stay out until they have real text.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getWorkshopSlugs();
  const paths = ["/", ...slugs.map(workshopPath)];

  return paths.flatMap((path) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(path)).map(([lang, href]) => [
        lang,
        absoluteUrl(href),
      ]),
    );
    return locales.map((locale) => ({
      url: languages[locale],
      changeFrequency: path === "/" ? "daily" : "weekly",
      priority: path === "/" ? 1 : 0.8,
      alternates: { languages },
    }));
  });
}
