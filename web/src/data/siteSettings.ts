import "server-only";
import { sanityFetch } from "@/sanity/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import type { SiteSettings } from "./types";

/** The `siteSettings` singleton. Empty fields stay null so the UI shows its placeholders. */
export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";

  const { data } = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    perspective: "published",
    stega: false,
  });

  return {
    address: clean(data?.address),
    metroStation: clean(data?.metroStation),
    email: clean(data?.email),
    whatsapp: clean(data?.whatsapp),
    instagram: clean(data?.instagram),
    company: {
      legalName: clean(data?.company?.legalName),
      cui: clean(data?.company?.cui),
    },
    promoCode: clean(data?.promoCode),
  };
}

const clean = (value: string | null | undefined) => value?.trim() || null;
