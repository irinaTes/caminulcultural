import { getSiteSettings } from "@/data/siteSettings";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { localBusiness } from "@/lib/structuredData";
import { JsonLd } from "./JsonLd";

/** The business, for the home page. */
export async function BusinessJsonLd() {
  const [locale, { meta }, settings] = await Promise.all([
    getLocale(),
    getDictionary(),
    getSiteSettings(),
  ]);
  return (
    <JsonLd
      data={localBusiness({
        locale,
        name: meta.title,
        description: meta.description,
        settings,
      })}
    />
  );
}
