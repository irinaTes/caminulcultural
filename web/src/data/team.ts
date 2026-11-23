import "server-only";
import type { Locale } from "@/i18n/config";
import { urlFor } from "@/sanity/image";
import { sanityFetch } from "@/sanity/live";
import { localized } from "@/sanity/localized";
import { TEAM_QUERY } from "@/sanity/queries";
import type { TeamMember } from "./types";

/** Portraits are square; twice the largest size they're shown at. */
const PORTRAIT_SIZE = 640;

/** The people on the honour board, in the editor's order. Empty until filled in. */
export async function getTeam(locale: Locale): Promise<TeamMember[]> {
  "use cache";

  const { data } = await sanityFetch({
    query: TEAM_QUERY,
    perspective: "published",
    stega: false,
  });

  return (data ?? []).map(({ _key, name, role, bio, photo }) => ({
    id: _key,
    name: name.trim(),
    role: localized(role, locale),
    bio: localized(bio, locale),
    photo: photo?.asset
      ? {
          src: urlFor(photo)
            .width(PORTRAIT_SIZE)
            .height(PORTRAIT_SIZE)
            .fit("crop")
            .url(),
          alt: localized(photo.alt, locale),
          lqip: photo.lqip,
        }
      : null,
  }));
}
